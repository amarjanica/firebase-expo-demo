import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { FirebaseMiddleware } from './firebase.middleware';

@Global()
@Module({
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FirebaseMiddleware).forRoutes('*');
  }
}
