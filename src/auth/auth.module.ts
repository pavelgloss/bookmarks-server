import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthMiddleware } from './auth.middleware';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    exports: [],
})
export class AuthModule {
}