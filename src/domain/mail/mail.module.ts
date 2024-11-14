import { Logger, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from './mail.service';
import { UserModule } from '../users/user.module';

// @Module({
//   imports: [
//     MailerModule.forRootAsync({
//       useFactory: async () => ({
//         transport: {
//           host: process.env.SMTP_HOST,
//           secure: true,
//           auth: {
//             user: process.env.SMTP_USER,
//             pass: process.env.SMTP_PASS,
//           },
//         },
//         defaults: {
//           from: '"SEF Admin Panel" <noreply@example.com>',
//         },
//         template: {
//           dir: join(__dirname, 'templates'),
//           adapter: new HandlebarsAdapter(),
//           options: {
//             strict: false,
//           },
//         },
//       }),
//     }),
//     UserModule,
//   ],
//   controllers: [],
//   providers: [MailService],
//   exports: [MailService],
// })
// export class MailModule {}

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => {
        // Log the SMTP user and pass for debugging
        console.log('SMTP User:', process.env.SMTP_USER);
        console.log('SMTP Pass:', process.env.SMTP_PASS);

        // return {
        //   transport: {
        //     host: process.env.SMTP_HOST,
        //     port: 465,
        //     secure: true,
        //     auth: {
        //       user: process.env.SMTP_USER,
        //       pass: process.env.SMTP_PASS,
        //     },
        //   },
        //   defaults: {
        //     from: '"SEF Admin Panel" <noreply@example.com>',
        //   },
        //   template: {
        //     dir: join(__dirname, 'templates'),
        //     adapter: new HandlebarsAdapter(),
        //     options: {
        //       strict: false,
        //     },
        //   },
        // };
        return {
          transport: {
            service: 'gmail',
            port: 465,
            secure: true,
            logger: true,
            secureConnection: false,
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
            tls: {
              rejectAuthorized: true,
            },
          },
          defaults: {
            from: '"SEF Admin Panel" <noreply@example.com>',
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: false,
            },
          },
        };
      },
    }),
    UserModule,
  ],
  controllers: [],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
