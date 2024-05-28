"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataMigrationController = void 0;
const common_1 = require("@nestjs/common");
const data_migration_mediator_1 = require("./data.migration.mediator");
const data_migration_dto_1 = require("./dtos/data.migration.dto");
let DataMigrationController = class DataMigrationController {
    constructor(mediator) {
        this.mediator = mediator;
    }
    dataMigration(dataMigrationDto, res) {
        const { category } = dataMigrationDto;
        try {
            let targetFilePath;
            switch (category) {
                case 'blom_bank':
                    targetFilePath = this.mediator.blomBankMigration(dataMigrationDto);
                    break;
                case 'whish':
                    targetFilePath = this.mediator.whishMigration(dataMigrationDto);
                    break;
                default:
                    throw new common_1.HttpException('Unsupported Category', common_1.HttpStatus.BAD_REQUEST);
            }
            res.status(common_1.HttpStatus.OK).json({
                message: 'Data Migration Successfull',
                targetFilePath,
            });
        }
        catch (error) {
            res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Data migration Failed',
                error: error.message,
            });
        }
    }
};
__decorate([
    (0, common_1.Post)('data-migration'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [data_migration_dto_1.DataMigrationDto, Object]),
    __metadata("design:returntype", void 0)
], DataMigrationController.prototype, "dataMigration", null);
DataMigrationController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [data_migration_mediator_1.DataMigrationMediator])
], DataMigrationController);
exports.DataMigrationController = DataMigrationController;
//# sourceMappingURL=data.migration.controller.js.map