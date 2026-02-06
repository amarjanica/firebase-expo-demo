import z from 'zod';

export const SendEmailFormSchema = z.object({
  subject: z.string().max(255, 'Subject must be at most 255 characters long'),
  message: z.string().max(5000, 'Message must be at most 5000 characters long'),
  from: z.email('Expected a valid email address'),
  name: z.string().optional(),
});
export type SendEmailForm = z.infer<typeof SendEmailFormSchema>;
export type SendEmailFormWithToken = SendEmailForm & {
  platform: string;
  token: string;
};
