import { Status } from 'src/core/data/types/applications/applications.types';

export interface InterviewEmailConfig {
  requiredFields: {
    field: string;
    message: string;
  }[];
  templates: {
    passed: {
      name: string;
      subject: string;
    };
    failed: {
      name: string;
      subject: string;
    };
  };
  getTemplateVariables: (interviewMeetLink: string) => Record<string, any>;
}

export const interviewEmailConfigs: Record<string, InterviewEmailConfig> = {
  'FSE': {
    requiredFields: [
      {
        field: 'link_1',
        message: 'Interview meet link should be provided before sending emails.',
      },
    ],
    templates: {
      passed: {
        name: 'FSE/passedExam.hbs',
        subject: 'SE Factory | Welcome to Stage 3',
      },
      failed: {
        name: 'FSE/failedExam.hbs',
        subject: 'SE Factory | Full Stack Engineer',
      },
    },
    getTemplateVariables: (interviewMeetLink) => ({
      interviewMeetLink,
    }),
  },
  'UIX': {
    requiredFields: [
      {
        field: 'link_1',
        message: 'Interview meet link should be provided before sending emails.',
      },
    ],
    templates: {
      passed: {
        name: 'UIX/passedExam.hbs',
        subject: 'SE Factory | Welcome to Stage 3',
      },
      failed: {
        name: 'UIX/failedExam.hbs',
        subject: 'SE Factory | Full Stack Engineer',
      },
    },
    getTemplateVariables: (interviewMeetLink) => ({
      interviewMeetLink,
    }),
  },
};