import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsEmail, IsNotEmpty, IsNumber } from "class-validator";

export class TestSendEmailTemplateDto {
  @ApiProperty({ description: 'The ID of the template' })
  @IsNotEmpty({ message: 'TemplateId should not be empty' })
  @IsNumber({}, { message: 'TemplateId must be a number' })
  templateId: number;

  @ApiProperty({ description: 'The emails to send the template to' })
  @IsArray({ message: 'Emails should be an array' })
  @ArrayNotEmpty({ message: 'No emails provided.' })
  @IsEmail({}, { each: true })
  emails: string[];
}