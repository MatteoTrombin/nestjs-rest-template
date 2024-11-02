import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from '../user/user.module';

import { AuthController } from './controllers/auth.controller';
import { PasswordResetController } from './controllers/password-reset.controller';
import {
  PasswordReset,
  PasswordResetSchema,
} from './schemas/password-reset.schema';
import { AuthService } from './services/auth.service';
import { PasswordResetService } from './services/password-reset.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: PasswordReset.name, schema: PasswordResetSchema },
    ]),
    PassportModule.register({ session: true }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('auth.secret'),
          signOptions: {
            expiresIn: configService.get<string | number>('auth.expiration'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, PasswordResetController],
  providers: [AuthService, PasswordResetService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
