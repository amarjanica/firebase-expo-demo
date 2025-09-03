import { z } from 'zod';

export const RegisterDeviceTokenSchema = z.object({
  token: z.string(),
});

export type RegisterDeviceToken = z.infer<typeof RegisterDeviceTokenSchema>;
