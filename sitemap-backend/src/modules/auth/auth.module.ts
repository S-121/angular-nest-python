import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

import { AuthService } from './auth.service';
import { UserModule } from '../user';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    MailerModule.forRoot({
      // transport:
      //   'smtps://ahmedcs2012@gmail.com:amira12345678910@smtp.gmail.com',
      transport: {
        host: 'smtp.gmail.com', 
        port: 465,
        auth: {
          user: 'contact@sitemap.io',
          pass: 'Sitemap2020$',
        }
      },
      defaults: {
        from: '"No Reply" <no-reply@sitemap.io>',
      },
      template: {
        dir: process.cwd() + '/template/',
        adapter: new EjsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '6d' },
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
