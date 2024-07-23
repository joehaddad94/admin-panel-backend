import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsNotEmpty } from 'class-validator';

export class SendingEmailsDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'CycleId should not be empty' })
  cycleId: number;

  @ApiProperty()
  @IsArray({ message: 'Emails should be an array' })
  @ArrayNotEmpty({ message: 'No emails provided.' })
  emails: [];
}
