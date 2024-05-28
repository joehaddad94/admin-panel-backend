import { User as UserEntity } from '@core/data/database/entities/user.entity';
export declare const User: (...dataOrPipes: (UserEntity | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>>)[]) => ParameterDecorator;
