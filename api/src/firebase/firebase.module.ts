import { DynamicModule, Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { FirebaseMiddleware } from './firebase.middleware';
import { RouteInfo } from '@nestjs/common/interfaces';

@Global()
@Module({
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule implements NestModule {
  private static excludes: (string | RouteInfo)[] = [];

  static forRoot(options: { exclude: (string | RouteInfo)[] }): DynamicModule {
    FirebaseModule.excludes = options.exclude || [];

    return {
      imports: [],
      module: FirebaseModule,
      providers: [FirebaseService],
      exports: [FirebaseService],
    };
  }

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(FirebaseMiddleware)
      .exclude(...FirebaseModule.excludes)
      .forRoutes('*');
  }
}
