import { formatReadableDate, formatTime } from 'src/core/helpers/formatDate';
import { Status } from 'src/core/data/types/applications/applications.types';

const formatSectionDays = (days: string): string => {
  switch (days) {
    case 'MWF':
      return 'Every Monday, Wednesday & Friday';
    case 'TTH':
      return 'Every Tuesday & Thursday';
    case 'SS':
      return 'Every Saturday & Sunday';
  }
};

export interface StatusEmailConfig {
  requiredFields: {
    field: string;
    message: string;
  }[];
  templates: {
    [key in Status]?: {
      name: string;
      subject?: string;
      getSubject?: (sectionName: string) => string;
    };
  };
  getTemplateVariables: (decisionDate: any, section?: any, orientationInfo?: string, submissionDateTime?: string) => Record<string, any>;
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
        message: 'Orientation Meet Link should be provided.',
      },
      {
        field: 'date_1',
        message: 'Orientation Date should be provided.',
      },
    ],
    templates: {
      [Status.ACCEPTED]: {
        name: 'FCS/status-mail.hbs',
        getSubject: (sectionName: string) => `${sectionName.substring(0, 6)} Bootcamp Debut`,
      }
    },
    getTemplateVariables: (decisionDate, section) => ({
      orientationDate: formatReadableDate(decisionDate.date_1),
      orientationMeetLink: decisionDate.link_3,
      sectionDays: formatSectionDays(section?.days),
      courseTimeStart: formatTime(section?.course_time_start),
      courseTimeEnd: formatTime(section?.course_time_end),
    }),
  },
  UIX: {
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
        name: 'UIX/accepted.hbs',
        subject: 'SE Factory | UIX Bootcamp Acceptance',
      },
      [Status.REJECTED]: {
        name: 'UIX/rejected.hbs',
        subject: 'SE Factory | UIX Application Status',
      },
      [Status.WAITING_LIST]: {
        name: 'UIX/waitingList.hbs',
        subject: 'SE Factory | UIX Application Status',
      },
    },
    getTemplateVariables: (decisionDate, section, orientationInfo, submissionDateTime) => ({
      statusConfirmationForm: decisionDate.link_3,
      orientationDate: formatReadableDate(decisionDate.date_1),
      classDebutDate: formatReadableDate(decisionDate.date_2),
      submissionConfirmationDate: formatReadableDate(new Date(submissionDateTime)),
      orientationInfo,
      submissionDateTime: submissionDateTime ? formatReadableDate(new Date(submissionDateTime)) : undefined,
    }),
  },
}; 