import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { PostsModule } from './modules/posts/posts.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './modules/users/user.entity';
import { Post } from './modules/posts/post.entity';
import { RequestLoggerMiddleware } from './middleware/request-logger/request-logger.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    PostsModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => {
        const isProd = config.get<string>('NODE_ENV') === 'production';

        if (isProd) {
          return {
            type: 'postgres',
            url: config.get<string>('DATABASE_URL'),
            synchronize: false,
            autoLoadEntities: true,
            logging: false,
            entities: [User, Post],
            ssl: {
              rejectUnauthorized: false,
            },
          };
        }

        return {
          type: 'sqlite',
          database: ':memory:',
          synchronize: true,
          entities: [User, Post],
          autoLoadEntities: true,
          logging: true,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
