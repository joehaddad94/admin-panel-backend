import { InformationService } from './information.service';
export declare class InformationMediator {
    private readonly service;
    constructor(service: InformationService);
    findInformation: () => Promise<any>;
}
