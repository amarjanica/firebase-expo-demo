import {
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ZodError, ZodType } from 'zod';

@Injectable()
export class ZodValidatorPipe implements PipeTransform {
  constructor(private readonly schema: ZodType<any>) {}
  transform(value: any) {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      const errors = this.formatErrors(result.error);
      throw new BadRequestException({
        message: 'Validation failed',
        errors,
      });
    }
    return result.data;
  }

  private formatErrors(error: ZodError) {
    const { fieldErrors, formErrors } = error.flatten();

    return {
      fieldErrors,
      formErrors,
    };
  }
}
