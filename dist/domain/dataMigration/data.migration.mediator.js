"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataMigrationMediator = void 0;
const common_1 = require("@nestjs/common");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
let DataMigrationMediator = class DataMigrationMediator {
    blomBankMigration(DataMigrationDto) {
        const { sourceFilePath } = DataMigrationDto;
        try {
            if (!fs.existsSync(sourceFilePath)) {
                throw new common_1.HttpException('Source file does not exist', common_1.HttpStatus.BAD_REQUEST);
            }
            const fileExtension = path.extname(sourceFilePath).toLowerCase();
            if (fileExtension !== '.xls' && fileExtension !== '.xlsx') {
                throw new common_1.HttpException('Invalid file type. Only Excel files are allowed', common_1.HttpStatus.BAD_REQUEST);
            }
            const fileBuffer = fs.readFileSync(sourceFilePath);
            const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rawData = XLSX.utils.sheet_to_json(sheet, {
                header: 1,
                defval: '',
                range: 3,
            });
            if (rawData.length <= 1) {
                throw new common_1.HttpException('Source file is empty or has no valid data', common_1.HttpStatus.BAD_REQUEST);
            }
            const headers = rawData[0];
            const businessDateIndex = headers.indexOf('Business Date');
            const narrativeIndex = headers.indexOf('Narrative');
            const amountIndex = headers.indexOf('Amount (USD)');
            if (businessDateIndex === -1 ||
                narrativeIndex === -1 ||
                amountIndex === -1) {
                throw new common_1.HttpException('Required headers not found in the source file', common_1.HttpStatus.BAD_REQUEST);
            }
            const formattedData = [];
            for (let i = 1; i < rawData.length; i++) {
                const row = rawData[i];
                const businessDate = row[businessDateIndex];
                if (!businessDate) {
                    break;
                }
                formattedData.push({
                    'Business Date': businessDate || '',
                    Narrative: row[narrativeIndex] || '',
                    Amount: row[amountIndex] || '',
                });
            }
            const mappedData = formattedData.map((row) => ({
                Date: row['Business Date'] || '',
                Description: row['Narrative'] || '',
                Amount: row['Amount'] || '',
            }));
            const newWorkbook = XLSX.utils.book_new();
            const newSheet = XLSX.utils.json_to_sheet(mappedData);
            XLSX.utils.book_append_sheet(newWorkbook, newSheet, 'Xero Data');
            const buffer = XLSX.write(newWorkbook, {
                type: 'buffer',
                bookType: 'xlsx',
            });
            return buffer;
        }
        catch (error) {
            throw new common_1.HttpException(`Error processing file: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    whishMigration(dataMigrationDto) {
        const { sourceFilePath } = dataMigrationDto;
        try {
            if (!fs.existsSync(sourceFilePath)) {
                throw new common_1.HttpException('Source file does not exist', common_1.HttpStatus.BAD_REQUEST);
            }
            const filePathExtension = path.extname(sourceFilePath).toLowerCase();
            if (filePathExtension !== '.xls' && filePathExtension !== '.xlsx') {
                throw new common_1.HttpException('Invalid file type. Only Excel files are allowed', common_1.HttpStatus.BAD_REQUEST);
            }
            const fileBuffer = fs.readFileSync(sourceFilePath);
            const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rawData = XLSX.utils.sheet_to_json(sheet, {
                header: 1,
                defval: '',
                range: 10,
            });
            if (rawData.length === 0) {
                throw new common_1.HttpException('Source file is empty or has no valid data', common_1.HttpStatus.BAD_REQUEST);
            }
            console.log('🚀 ~ DataMigrationMediator ~ whishMigration ~ rawData:', rawData);
            const headers = rawData[0];
            const dateIndex = headers.indexOf('Date');
            const detailsIndex = headers.indexOf('Details');
            const debitIndex = headers.indexOf('Debit');
            const creditIndex = headers.indexOf('Credit');
            if (dateIndex === -1 ||
                detailsIndex === -1 ||
                debitIndex === -1 ||
                creditIndex === -1) {
                throw new common_1.HttpException('Required headers not found in the source file', common_1.HttpStatus.BAD_REQUEST);
            }
            const formattedData = [];
            for (let i = 2; i < rawData.length; i++) {
                const row = rawData[i];
                let date = row[dateIndex];
                if (!date) {
                    break;
                }
                if (typeof date === 'number') {
                    date = XLSX.SSF.format('dd/mm/yyyy', date);
                }
                let amount = 0;
                if (row[debitIndex] !== 0) {
                    amount = -Math.abs(Number(row[debitIndex]));
                }
                else if (row[creditIndex] !== '') {
                    amount = Math.abs(Number(row[creditIndex]));
                }
                formattedData.push({
                    Date: date || '',
                    Description: row[detailsIndex] || '',
                    Amount: amount || '',
                });
            }
            console.log('🚀 ~ DataMigrationMediator ~ whishMigration ~ formattedData:', formattedData);
            const mappedData = formattedData.map((row) => ({
                Date: row['Date'] || '',
                Description: row['Description'] || '',
                Amount: row['Amount'] || '',
            }));
            console.log('🚀 ~ DataMigrationMediator ~ mappedData ~ mappedData:', mappedData);
            const newWorkbook = XLSX.utils.book_new();
            const newSheet = XLSX.utils.json_to_sheet(mappedData);
            XLSX.utils.book_append_sheet(newWorkbook, newSheet, 'Xero Data');
            const buffer = XLSX.write(newWorkbook, {
                type: 'buffer',
                bookType: 'xlsx',
            });
            return buffer;
        }
        catch (error) {
            throw new common_1.HttpException(`Error processing file: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
DataMigrationMediator = __decorate([
    (0, common_1.Injectable)()
], DataMigrationMediator);
exports.DataMigrationMediator = DataMigrationMediator;
//# sourceMappingURL=data.migration.mediator.js.map