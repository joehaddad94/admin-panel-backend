"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const db_data_source_1 = require("./core/config/db/db.data.source");
const enviroment_1 = require("./core/config/server/enviroment");
const auth_1 = require("./domain/auth");
const jwt_1 = require("@nestjs/jwt");
const students_1 = require("./domain/students");
const quizes_1 = require("./domain/quizes");
const questions_1 = require("./domain/questions");
const application_module_1 = require("./domain/applications/application.module");
const user_module_1 = require("./domain/users/user.module");
const information_module_1 = require("./domain/information/information.module");
const report_module_1 = require("./domain/reports/report.module");
const data_migration_module_1 = require("./domain/dataMigration/data.migration.module");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: enviroment_1.enivroment,
            }),
            typeorm_1.TypeOrmModule.forRoot(db_data_source_1.dataSourceOptions),
            jwt_1.JwtModule.register({
                global: true,
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '1d' },
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, 'public'),
            }),
            auth_1.AuthModule,
            students_1.StudentModule,
            quizes_1.QuizModule,
            questions_1.QuestionModule,
            application_module_1.ApplicationModule,
            user_module_1.UserModule,
            information_module_1.InformationModule,
            report_module_1.ReportModule,
            data_migration_module_1.DataMigrationModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map