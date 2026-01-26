import {
  CallableRequest,
  CallableResponse,
  HttpsError,
} from 'firebase-functions/https';
import {logger} from 'firebase-functions';
import {ZodObject, ZodRawShape, infer as zInfer} from 'zod';

type Handler<T = unknown, R = unknown, S = unknown> = (
  req: CallableRequest<T>,
  res?: CallableResponse<S>
) => R | Promise<R>
  ;
export const withValidation =
  <T extends ZodRawShape, R>(schema: ZodObject<T>) =>
    (next: Handler<zInfer<ZodObject<T>>, R>):
      Handler<zInfer<ZodObject<T>>, R> =>
      async (request, res) => {
        const parsed = schema.safeParse(request.data);
        if (!parsed.success) {
          logger.error('Input validation failed', {
            data: request.data,
            issues: parsed.error.issues.map((zodIssue) => ({
              path: zodIssue.path.join('.'),
              code: zodIssue.code,
              message: zodIssue.message,
            })),
          });
          throw new HttpsError('invalid-argument', 'Invalid request data');
        }
        return next({...request, data: parsed.data}, res);
      };
