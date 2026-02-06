import { z } from 'zod';

export const SendEmailFormSchema = z.object({
  subject: z.string().max(255),
  message: z.string().max(5000),
  from: z.email(),
  name: z.string().optional(),
});
export type SendEmailForm = z.infer<typeof SendEmailFormSchema>;
