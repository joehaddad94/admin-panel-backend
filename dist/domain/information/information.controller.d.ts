import { InformationMediator } from './informattion.mediator';
export declare class InformationController {
    private readonly mediator;
    constructor(mediator: InformationMediator);
    GetInformation(): Promise<any>;
}
