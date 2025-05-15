import { formatReadableDate } from 'src/core/helpers/formatDate';
import { Status } from 'src/core/data/types/applications/applications.types';

export interface StatusEmailConfig {
  requiredFields: {
    field: string;
    message: string;
  }[];
  templates: {
    [key in Status]?: {
      name: string;
      subject: string;
    };
  };
  getTemplateVariables: (decisionDate: any) => Record<string, any>;
}

export const statusEmailConfigs: Record<string, StatusEmailConfig> = {
  FSE: {
    requiredFields: [
      {
        field: 'link_3',
        message: 'Status Confirmation Form should be provided.',
      },
      {
        field: 'date_1',
        message: 'Orientation Date should be provided.',
      },
      {
        field: 'date_2',
        message: 'Class Debut Date should be provided.',
      },
    ],
    templates: {
      [Status.ACCEPTED]: {
        name: 'FSE/passedInterview.hbs',
        subject: 'SE Factory Acceptance',
      },
      [Status.REJECTED]: {
        name: 'FSE/failedInterview.hbs',
        subject: 'SE Factory Application Status',
      },
      [Status.WAITING_LIST]: {
        name: 'FSE/waitingList.hbs',
        subject: 'SE Factory Application Status',
      },
    },
    getTemplateVariables: (decisionDate) => ({
      statusConfirmationForm: decisionDate.link_3,
      orientationDate: formatReadableDate(decisionDate.date_1),
      classDebutDate: formatReadableDate(decisionDate.date_2),
      submissionConfirmationDate: formatReadableDate(
        new Date(
          new Date(decisionDate.date_1).setDate(
            new Date(decisionDate.date_1).getDate() - 3,
          ),
        ),
      ),
    }),
  },
  FCS: {
    requiredFields: [
      {
        field: 'link_3',
        message: 'Status Confirmation Form should be provided.',
      },
      {
        field: 'date_1',
        message: 'Orientation Date should be provided.',
      },
      {
        field: 'date_2',
        message: 'Class Debut Date should be provided.',
      },
    ],
    templates: {
      [Status.ACCEPTED]: {
        name: 'FCS/passedInterview.hbs',
        subject: 'SE Factory FCS Acceptance',
      },
      [Status.REJECTED]: {
        name: 'FCS/failedInterview.hbs',
        subject: 'SE Factory FCS Application Status',
      },
      [Status.WAITING_LIST]: {
        name: 'FCS/waitingList.hbs',
        subject: 'SE Factory FCS Application Status',
      },
    },
    getTemplateVariables: (decisionDate) => ({
      statusConfirmationForm: decisionDate.link_3,
      orientationDate: formatReadableDate(decisionDate.date_1),
      classDebutDate: formatReadableDate(decisionDate.date_2),
      submissionConfirmationDate: formatReadableDate(
        new Date(
          new Date(decisionDate.date_1).setDate(
            new Date(decisionDate.date_1).getDate() - 3,
          ),
        ),
      ),
    }),
  },
}; 