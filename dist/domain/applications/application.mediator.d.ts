import { ApplicationService } from './application.service';
export declare class ApplicationMediator {
    private readonly service;
    constructor(service: ApplicationService);
    findApplications: () => Promise<any>;
}
