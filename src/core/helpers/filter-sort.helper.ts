import { FilterDto, SortDto, FilterOperator } from '../../domain/reports/dtos/filters.dto';

export interface ApplicationData {
  id: number;
  sefId?: string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  dob?: Date;
  countryOrigin?: string;
  countryResidence?: string;
  residencyStatus?: string;
  educationStatus?: string;
  programName?: string;
  program?: string;
  passedScreening?: string;
  screeningEmailSent?: string;
  applicationDate?: Date;
  eligible?: string | boolean;
  passedScreeningDate?: Date;
  examScore?: number;
  passedExam?: string;
  passedExamDate?: Date;
  passedExamEmailSent?: string;
  techInterviewScore?: number;
  softInterviewScore?: number;
  passedInterviewDate?: Date;
  passedInterview?: string;
  applicationStatus?: string;
  statusEmailSent?: string;
  remarks?: string;
  cycleId?: number;
  cycleName?: string;
  paid?: string | boolean;
  sectionName?: string;
  userId?: number;
  infoId?: number;
  fcsGraduate?: string;
  [key: string]: any;
}

export function applyFilters(applications: ApplicationData[], filters: FilterDto[]): ApplicationData[] {
  if (!filters || filters.length === 0) {
    return applications;
  }

  return applications.filter(application => {
    return filters.every(filter => {
      const fieldValue = getNestedValue(application, filter.field);
      
      switch (filter.operator) {
        case FilterOperator.EQUALS:
          return fieldValue === filter.value;
        
        case FilterOperator.NOT_EQUALS:
          return fieldValue !== filter.value;
        
        case FilterOperator.CONTAINS:
          if (typeof fieldValue === 'string') {
            return fieldValue.toLowerCase().includes(String(filter.value).toLowerCase());
          }
          return false;
        
        case FilterOperator.NOT_CONTAINS:
          if (typeof fieldValue === 'string') {
            return !fieldValue.toLowerCase().includes(String(filter.value).toLowerCase());
          }
          return true;
        
        case FilterOperator.GREATER_THAN:
          if (typeof fieldValue === 'number' && typeof filter.value === 'number') {
            return fieldValue > filter.value;
          }
          if (fieldValue instanceof Date && filter.value instanceof Date) {
            return fieldValue > filter.value;
          }
          return false;
        
        case FilterOperator.LESS_THAN:
          if (typeof fieldValue === 'number' && typeof filter.value === 'number') {
            return fieldValue < filter.value;
          }
          if (fieldValue instanceof Date && filter.value instanceof Date) {
            return fieldValue < filter.value;
          }
          return false;
        
        case FilterOperator.GREATER_THAN_OR_EQUAL:
          if (typeof fieldValue === 'number' && typeof filter.value === 'number') {
            return fieldValue >= filter.value;
          }
          if (fieldValue instanceof Date && filter.value instanceof Date) {
            return fieldValue >= filter.value;
          }
          return false;
        
        case FilterOperator.LESS_THAN_OR_EQUAL:
          if (typeof fieldValue === 'number' && typeof filter.value === 'number') {
            return fieldValue <= filter.value;
          }
          if (fieldValue instanceof Date && filter.value instanceof Date) {
            return fieldValue <= filter.value;
          }
          return false;
        
        case FilterOperator.IN:
          if (Array.isArray(filter.value)) {
            return filter.value.includes(fieldValue);
          }
          return false;
        
        case FilterOperator.NOT_IN:
          if (Array.isArray(filter.value)) {
            return !filter.value.includes(fieldValue);
          }
          return true;
        
        case FilterOperator.IS_NULL:
          return fieldValue === null || fieldValue === undefined;
        
        case FilterOperator.IS_NOT_NULL:
          return fieldValue !== null && fieldValue !== undefined;
        
        default:
          return true;
      }
    });
  });
}

export function applySorting(applications: ApplicationData[], sortCriteria: SortDto[]): ApplicationData[] {
  if (!sortCriteria || sortCriteria.length === 0) {
    return applications;
  }

  return applications.sort((a, b) => {
    for (const sort of sortCriteria) {
      const aValue = getNestedValue(a, sort.field);
      const bValue = getNestedValue(b, sort.field);
      
      let comparison = 0;
      
      if (aValue === null || aValue === undefined) {
        comparison = 1;
      } else if (bValue === null || bValue === undefined) {
        comparison = -1;
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime();
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }
      
      if (comparison !== 0) {
        return sort.sort === 'desc' ? -comparison : comparison;
      }
    }
    
    return 0;
  });
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
} 