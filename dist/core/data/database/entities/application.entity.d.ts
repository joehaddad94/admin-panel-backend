import { BaseEntity } from 'typeorm';
import { ApplicationInfo } from '../relations/application-info.entity';
import { ApplicationProgram } from '../relations/application-program.entity';
import { ApplicationUser } from '../relations/application-user.entity';
export declare class Application extends BaseEntity {
    id: number;
    passed_screening: boolean;
    created_at: Date;
    updated_at: Date;
    published_at: Date;
    created_by_id: number;
    updated_by_id: number;
    passed_screening_date: Date;
    passed_exam: boolean;
    passed_exam_date: Date;
    passed_interview: boolean;
    passed_interview_date: Date;
    enrolled: boolean;
    remarks: string;
    extras: any;
    applicationInfo: ApplicationInfo[];
    applicationProgram: ApplicationProgram[];
    applicationUser: ApplicationUser[];
}
