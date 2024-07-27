import { HttpStatus } from '@nestjs/common';
import { Threshold } from '../data/database/entities/threshold.entity';
import { throwError } from '../settings/base/errors/base.error';

export function validateThresholdEntity(threshold: Threshold): void {
  const invalidProperties = [];

  if (
    threshold.exam_passing_grade === null ||
    threshold.exam_passing_grade === undefined
  ) {
    invalidProperties.push('Exam Passing Grade');
  }
  if (
    threshold.primary_passing_grade === null ||
    threshold.primary_passing_grade === undefined
  ) {
    invalidProperties.push('Primary Passing Grade');
  }
  if (
    threshold.secondary_passing_grade === null ||
    threshold.secondary_passing_grade === undefined
  ) {
    invalidProperties.push('Secondary Passing Grade');
  }
  if (threshold.weight_tech === null || threshold.weight_tech === undefined) {
    invalidProperties.push('Weight Tech');
  }
  if (threshold.weight_soft === null || threshold.weight_soft === undefined) {
    invalidProperties.push('Weight Soft');
  }

  if (invalidProperties.length > 0) {
    throwError(
      `The following properties are invalid: ${invalidProperties.join(', ')}`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
