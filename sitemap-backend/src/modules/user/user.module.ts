import { Module, CacheModule } from '@nestjs/common';
import { UserController } from './controllers';
import { UserService } from './services';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, USER_COLLECTION_NAME } from './schemas';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com', 
        port: 465,
        auth: {
          user: 'contact@sitemap.io',
          pass: 'Sitemap2020$',
        }
      },
        // 'smtps://ahmedcs2012@gmail.com:amira12345678910@smtp.gmail.com',
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
    CacheModule.register(),
    MongooseModule.forFeatureAsync([
      {
        name: USER_COLLECTION_NAME,
        useFactory: () => {
          const schema = UserSchema;
          schema.plugin(require('mongoose-autopopulate'));
          return schema;
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
