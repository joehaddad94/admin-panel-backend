import { formatExamDate, formatReadableDate } from 'src/core/helpers/formatDate';

export interface ProgramConfig {
  requiredFields: {
    field: string;
    message: string;
  }[];
  templates: {
    eligible: {
      name: string;
      subject: string;
    };
    ineligible: {
      name: string;
      subject: string;
    };
  };
  getTemplateVariables: (decisionDate: any) => Record<string, any>;
}

export const programConfigs: Record<string, ProgramConfig> = {
  FCS: {
    requiredFields: [
      {
        field: 'date_1',
        message: 'Payment Deadline should be provided.',
      },
      {
        field: 'link_4',
        message: 'Commitment Form should be provided.',
      },
      {
        field: 'link_1',
        message: 'Whish application PDF file should be provided.',
      },
    ],
    templates: {
      eligible: {
        name: 'FCS/acceptance-mail.hbs',
        subject: 'SE Factory FCS Screening Process',
      },
      ineligible: {
        name: 'FCS/rejection-mail.hbs',
        subject: 'SE Factory FCS Screening Process',
      },
    },
    getTemplateVariables: (decisionDate) => ({
      paymentDeadline: formatReadableDate(decisionDate.date_1),
      commitmentForm: decisionDate.link_4,
      wishApplication: decisionDate.link_1,
    }),
  },
  FSE: {
    requiredFields: [
      {
        field: 'date_time_1',
        message: 'Exam Date and time should be provided.',
      },
      {
        field: 'link_4',
        message: 'Exam Link should be provided.',
      },
      {
        field: 'link_2',
        message: 'Info Session Recorded Link should be provided.',
      },
    ],
    templates: {
      eligible: {
        name: 'FSE/shortlisted.hbs',
        subject: 'SE Factory Screening Process',
      },
      ineligible: {
        name: 'FSE/notEligible.hbs',
        subject: 'SE Factory Screening Process',
      },
    },
    getTemplateVariables: (decisionDate) => ({
      examDate: formatExamDate(decisionDate.date_time_1),
      examLink: decisionDate.link_4,
      infoSessionRecordedLink: decisionDate.link_2,
    }),
  },
}; 