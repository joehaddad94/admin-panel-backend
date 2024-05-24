import { ApiProperty } from '@nestjs/swagger';

export class QuizResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  codeRating: number;

  @ApiProperty()
  logicRating: number;

  @ApiProperty()
  theoreticalRating: number;

  @ApiProperty()
  codingScore: number;

  @ApiProperty()
  logicScore: number;

  @ApiProperty()
  theoreticalScore: number;

  @ApiProperty()
  totalScore: number;

  @ApiProperty()
  studentId: number;

  @ApiProperty()
  comments: string;

  @ApiProperty()
  pace: number;
}
