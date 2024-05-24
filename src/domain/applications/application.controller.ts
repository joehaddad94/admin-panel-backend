import { Controller, Get } from "@nestjs/common";
import { ApplicationMediator } from "./application.mediator";

@Controller('applications')
export class ApplicationController {
    constructor(private readonly mediator: ApplicationMediator) {}

    @Get()
    getApplications() {
        return this.mediator.findApplications();
    }
}
