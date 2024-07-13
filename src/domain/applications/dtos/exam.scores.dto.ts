import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ExamScoresDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Source file path is required' })
  sourceFilePath: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Cycle ID is required' })
  cycleId: number;
}
