import { ApplicationService } from '@domain/applications/application.service';
import { InformationService } from '@domain/information/information.service';
import { UserService } from '@domain/users/user.service';
import { FiltersDto } from './dtos/filters.dto';
import { ApplicationRepository } from '@domain/applications/application.repository';
export declare class ReportMediator {
    private readonly informationService;
    private readonly applicationRepository;
    private readonly applicationService;
    private readonly userService;
    constructor(informationService: InformationService, applicationRepository: ApplicationRepository, applicationService: ApplicationService, userService: UserService);
    applicationReport: (filtersDto: FiltersDto) => Promise<any>;
    informationReport: (filtersDto: FiltersDto) => Promise<any>;
    usersReport: (filtersDto: FiltersDto) => Promise<any>;
}
