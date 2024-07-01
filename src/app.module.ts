import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { dataSourceOptions } from './core/config/db/db.data.source';
import { enivroment } from './core/config/server/enviroment';
import { AuthModule } from './domain/auth';
import { JwtModule } from '@nestjs/jwt';
import { StudentModule } from './domain/students';
import { QuizModule } from './domain/quizes';
import { ApplicationModule } from './domain/applications/application.module';
import { UserModule } from './domain/users/user.module';
import { InformationModule } from './domain/information/information.module';
import { ReportModule } from './domain/reports/report.module';
import { DataMigrationModule } from './domain/dataMigration/data.migration.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { QuestionModule } from './domain/questions/question.module';
import { ProgramModule } from './domain/programs/program.module';
import { MailModule } from './domain/mail/mail.module';
import { AdminModule } from './domain/admins';
import { CycleModule } from './domain/cycles/cycle.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: enivroment,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'public'),
    }),
    AuthModule,
    AdminModule,
    StudentModule,
    QuizModule,
    QuestionModule,
    ApplicationModule,
    UserModule,
    InformationModule,
    ReportModule,
    DataMigrationModule,
    ProgramModule,
    MailModule,
    CycleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
