export class EmailSendFailedError extends Error {
  constructor(reason?: string) {
    super('Failed to send email');
    this.name = 'EmailSendFailedError';
  }
}
