import { FirebaseMiddleware } from './firebase.middleware';

describe('FirebaseMiddleware', () => {
  it('should be defined', () => {
    expect(new FirebaseMiddleware()).toBeDefined();
  });
});
