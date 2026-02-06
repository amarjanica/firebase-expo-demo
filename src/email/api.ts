import axios, { AxiosResponse } from 'axios';
import { SendEmailFormWithToken } from './schema';

type MailSendResult = { success: boolean };

const client = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

export const sendEmail = (data: SendEmailFormWithToken): Promise<AxiosResponse<MailSendResult>> => {
  return client.post<MailSendResult>('/feedback', data);
};
