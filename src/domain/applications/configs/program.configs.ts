import { formatExamDate } from 'src/core/helpers/formatDate';

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
        field: 'exam_date',
        message: 'Exam Date and time should be provided.',
      },
      {
        field: 'exam_link',
        message: 'Exam Link should be provided.',
      },
      {
        field: 'info_session_recorded_link',
        message: 'Info Session Recorded Link should be provided.',
      },
    ],
    templates: {
      eligible: {
        name: 'FCS/shortlisted.hbs',
        subject: 'SE Factory FCS Screening Process',
      },
      ineligible: {
        name: 'FCS/notEligible.hbs',
        subject: 'SE Factory FCS Screening Process',
      },
    },
    getTemplateVariables: (decisionDate) => ({
      examDate: formatExamDate(decisionDate.exam_date),
      examLink: decisionDate.exam_link,
      infoSessionRecordedLink: decisionDate.info_session_recorded_link,
    }),
  },
  FSE: {
    requiredFields: [
      {
        field: 'exam_date',
        message: 'Exam Date and time should be provided.',
      },
      {
        field: 'exam_link',
        message: 'Exam Link should be provided.',
      },
      {
        field: 'info_session_recorded_link',
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
      examDate: formatExamDate(decisionDate.exam_date),
      examLink: decisionDate.exam_link,
      infoSessionRecordedLink: decisionDate.info_session_recorded_link,
    }),
  },
}; 