import { ReportMediator } from './report.mediator';
import { FiltersDto } from './dtos/filters.dto';
export declare class ReportController {
    private readonly mediator;
    constructor(mediator: ReportMediator);
    generateReport(filtersDto: FiltersDto): Promise<any>;
}
