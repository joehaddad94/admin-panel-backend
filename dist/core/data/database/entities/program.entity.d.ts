import { BaseEntity } from 'typeorm';
import { ApplicationProgram } from '../relations/application-program.entity';
export declare class Program extends BaseEntity {
    id: number;
    program_name: string;
    abbreviation: string;
    description: string;
    curriculum_url: string;
    created_at: Date;
    updated_at: Date;
    published_at: Date;
    created_by_id: number;
    updated_by_id: number;
    applicationProgram: ApplicationProgram[];
}
