import { ApplicationMediator } from "./application.mediator";
export declare class ApplicationController {
    private readonly mediator;
    constructor(mediator: ApplicationMediator);
    getApplications(): Promise<any>;
}
