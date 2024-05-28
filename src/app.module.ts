import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { dataSourceOptions } from 'src/core/config/db/db.data.source';
import { enivroment } from 'src/core/config/server/enviroment';
import { AuthModule } from 'src/domain/auth';
import { JwtModule } from '@nestjs/jwt';
import { StudentModule } from 'src/domain/students';
import { QuizModule } from 'src/domain/quizes';
import { QuestionModule } from 'src/domain/questions';
import { ApplicationModule } from 'src/domain/applications/application.module';
import { UserModule } from 'src/domain/users/user.module';
import { InformationModule } from 'src/domain/information/information.module';
import { ReportModule } from 'src/domain/reports/report.module';
import { DataMigrationModule } from 'src/domain/dataMigration/data.migration.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

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
    StudentModule,
    QuizModule,
    QuestionModule,
    ApplicationModule,
    UserModule,
    InformationModule,
    ReportModule,
    DataMigrationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
