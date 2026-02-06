export class RecaptchaException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RecaptchaException';
  }
}

export class RecaptchaTokenInvalidException extends RecaptchaException {
  constructor() {
    super('Invalid reCAPTCHA token');
    this.name = 'RecaptchaTokenInvalidException';
  }
}

export class RecaptchaActionMismatchException extends RecaptchaException {
  constructor() {
    super('reCAPTCHA action mismatch');
    this.name = 'RecaptchaActionMismatchException';
  }
}

export class RecaptchaLowScoreException extends RecaptchaException {
  constructor() {
    super('Low reCAPTCHA score');
    this.name = 'RecaptchaLowScoreException';
  }
}
