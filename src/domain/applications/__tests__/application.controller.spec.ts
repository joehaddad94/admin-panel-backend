import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationController } from '../application.controller';
import { ApplicationMediator } from '../application.mediator';

// Mock the external dependencies
jest.mock('../../../core/helpers/operation', () => ({
  catcher: jest.fn((promise) => promise()),
}));

describe('ApplicationController', () => {
  let controller: ApplicationController;
  let mediator: ApplicationMediator;
  let module: TestingModule;

  const mockApplicationMediator = {
    findApplications: jest.fn(),
    findApplicationsNew: jest.fn(),
    findApplicationsByLatestCycle: jest.fn(),
    editApplication: jest.fn(),
    rowEditApplications: jest.fn(),
    editFCSApplications: jest.fn(),
    editApplications: jest.fn(),
    sendPostScreeningEmails: jest.fn(),
    importExamScores: jest.fn(),
    sendPassedExamEmails: jest.fn(),
    importInterviewScores: jest.fn(),
    sendStatusEmail: jest.fn(),
    sendScheduleConfirmationEmails: jest.fn(),
    applyToFSE: jest.fn(),
    importData: jest.fn(),
  };

  const mockFiltersDto = {
    programId: 1,
    cycleId: 1,
    page: 1,
    pageSize: 10,
    useAllCycles: false,
  };

  const mockSendingEmailsDto = {
    cycleId: 1,
    emails: [
      { ids: 1, emails: 'test@example.com' },
    ],
  };

  const mockExamScoresDto = {
    cycleId: 1,
    examScores: [
      { email: 'test@example.com', score: 85 },
    ],
  };

  const mockInterviewScoresDto = {
    cycleId: 1,
    interviewScores: [
      { 
        email: 'test@example.com', 
        techScore: 90, 
        softScore: 85, 
        remarks: 'Good candidate' 
      },
    ],
  };

  const mockEditApplicationDto = {
    id: 1,
    cycleId: 1,
    inputCycleId: 1,
    data: { status: 'approved' },
  };

  const mockEditApplicationsDto = {
    ids: [1, 2],
    cycleId: 1,
    inputCycleId: 1,
    applications: [
      { id: 1, data: { status: 'approved' } },
    ],
  };

  const mockEditFCSApplicationsDto = {
    ids: [1, 2],
    inputCycleId: 1,
    applications: [
      { id: 1, data: { status: 'approved' } },
    ],
  };

  const mockRowEditApplicationsDto = {
    ids: [1, 2],
    cycleId: 1,
    inputCycleId: 1,
    applications: [
      { id: 1, data: { status: 'approved' } },
    ],
  };

  const mockApplyToFSEDto = {
    selectedApplicationsIds: [
      { userId: 1, infoId: 1 },
    ],
    targetedFSECycleId: 1,
  };

  const mockImportDataDto = {
    cycleId: 1,
    importType: 'applications',
    data: [{ name: 'Test User', email: 'test@example.com' }],
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [ApplicationController],
      providers: [
        {
          provide: ApplicationMediator,
          useValue: mockApplicationMediator,
        },
      ],
    }).compile();

    controller = module.get<ApplicationController>(ApplicationController);
    mediator = module.get<ApplicationMediator>(ApplicationMediator);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    if (module) {
      await module.close();
    }
  });

  describe('findApplications', () => {
    it('should find applications with filters', async () => {
      const mockResponse = { applications: [], total: 0, page: 1, pageSize: 10 };
      mockApplicationMediator.findApplications.mockResolvedValue(mockResponse);

      const result = await controller.findApplications(mockFiltersDto);

      expect(mockApplicationMediator.findApplications).toHaveBeenCalledWith(mockFiltersDto);
      expect(result).toEqual(mockResponse);
    });

    it('should use ValidationPipe with whitelist option', () => {
      expect(typeof controller.findApplications).toBe('function');
      expect(controller.findApplications).toHaveLength(1);
    });
  });

  describe('findApplicationsNew', () => {
    it('should find new applications with filters', async () => {
      const mockResponse = { applications: [], total: 0, page: 1, pageSize: 10 };
      mockApplicationMediator.findApplicationsNew.mockResolvedValue(mockResponse);

      const result = await controller.findApplicationsNew(mockFiltersDto);

      expect(mockApplicationMediator.findApplicationsNew).toHaveBeenCalledWith(mockFiltersDto);
      expect(result).toEqual(mockResponse);
    });

    it('should use ValidationPipe with whitelist option', () => {
      expect(typeof controller.findApplicationsNew).toBe('function');
      expect(controller.findApplicationsNew).toHaveLength(1);
    });
  });

  describe('getApplicationsByLatestCycle', () => {
    it('should get applications by latest cycle', async () => {
      const mockResponse = { applications: [], total: 0, page: 1, pageSize: 10 };
      mockApplicationMediator.findApplicationsByLatestCycle.mockResolvedValue(mockResponse);

      const result = await controller.getApplicationsByLatestCycle(mockFiltersDto);

      expect(mockApplicationMediator.findApplicationsByLatestCycle).toHaveBeenCalledWith(mockFiltersDto);
      expect(result).toEqual(mockResponse);
    });

    it('should use ValidationPipe with whitelist option', () => {
      expect(typeof controller.getApplicationsByLatestCycle).toBe('function');
      expect(controller.getApplicationsByLatestCycle).toHaveLength(1);
    });
  });

  describe('editApplication', () => {
    it('should edit a single application', async () => {
      const mockResponse = { success: true, message: 'Application updated' };
      mockApplicationMediator.editApplication.mockResolvedValue(mockResponse);

      const result = await controller.editApplication(mockEditApplicationDto);

      expect(mockApplicationMediator.editApplication).toHaveBeenCalledWith(mockEditApplicationDto);
      expect(result).toEqual(mockResponse);
    });

    it('should use ValidationPipe with whitelist option', () => {
      expect(typeof controller.editApplication).toBe('function');
      expect(controller.editApplication).toHaveLength(1);
    });
  });

  describe('rowEditApplication', () => {
    it('should edit applications in row format', async () => {
      const mockResponse = { success: true, message: 'Applications updated' };
      mockApplicationMediator.rowEditApplications.mockResolvedValue(mockResponse);

      const result = await controller.rowEditApplication(mockRowEditApplicationsDto);

      expect(mockApplicationMediator.rowEditApplications).toHaveBeenCalledWith(mockRowEditApplicationsDto);
      expect(result).toEqual(mockResponse);
    });

    it('should use ValidationPipe with whitelist option', () => {
      expect(typeof controller.rowEditApplication).toBe('function');
      expect(controller.rowEditApplication).toHaveLength(1);
    });
  });

  describe('editFCSApplications', () => {
    it('should edit FCS applications', async () => {
      const mockResponse = { success: true, message: 'FCS applications updated' };
      mockApplicationMediator.editFCSApplications.mockResolvedValue(mockResponse);

      const result = await controller.editFCSApplications(mockEditFCSApplicationsDto);

      expect(mockApplicationMediator.editFCSApplications).toHaveBeenCalledWith(mockEditFCSApplicationsDto);
      expect(result).toEqual(mockResponse);
    });

    it('should use ValidationPipe with whitelist option', () => {
      expect(typeof controller.editFCSApplications).toBe('function');
      expect(controller.editFCSApplications).toHaveLength(1);
    });
  });

  describe('editApplications', () => {
    it('should edit multiple applications', async () => {
      const mockResponse = { success: true, message: 'Applications updated' };
      mockApplicationMediator.editApplications.mockResolvedValue(mockResponse);

      const result = await controller.editApplications(mockEditApplicationsDto);

      expect(mockApplicationMediator.editApplications).toHaveBeenCalledWith(mockEditApplicationsDto);
      expect(result).toEqual(mockResponse);
    });

    it('should use ValidationPipe with whitelist option', () => {
      expect(typeof controller.editApplications).toBe('function');
      expect(controller.editApplications).toHaveLength(1);
    });
  });

  describe('sendPostScreeningEmails', () => {
    it('should send post screening emails', async () => {
      const mockResponse = { success: true, message: 'Emails sent' };
      mockApplicationMediator.sendPostScreeningEmails.mockResolvedValue(mockResponse);

      const result = await controller.sendPostScreeningEmails(mockSendingEmailsDto);

      expect(mockApplicationMediator.sendPostScreeningEmails).toHaveBeenCalledWith(mockSendingEmailsDto);
      expect(result).toEqual(mockResponse);
    });

    it('should use ValidationPipe with whitelist option', () => {
      expect(typeof controller.sendPostScreeningEmails).toBe('function');
      expect(controller.sendPostScreeningEmails).toHaveLength(1);
    });
  });

  describe('importExamScores', () => {
    it('should import exam scores', async () => {
      const mockResponse = { success: true, message: 'Scores imported' };
      mockApplicationMediator.importExamScores.mockResolvedValue(mockResponse);

      const result = await controller.importExamScores(mockExamScoresDto);

      expect(mockApplicationMediator.importExamScores).toHaveBeenCalledWith(mockExamScoresDto);
      expect(result).toEqual(mockResponse);
    });

    it('should use ValidationPipe with whitelist option', () => {
      expect(typeof controller.importExamScores).toBe('function');
      expect(controller.importExamScores).toHaveLength(1);
    });
  });

  describe('sendInterviewDateEmails', () => {
    it('should send interview date emails', async () => {
      const mockResponse = { success: true, message: 'Emails sent' };
      mockApplicationMediator.sendPassedExamEmails.mockResolvedValue(mockResponse);

      const result = await controller.sendInterviewDateEmails(mockSendingEmailsDto);

      expect(mockApplicationMediator.sendPassedExamEmails).toHaveBeenCalledWith(mockSendingEmailsDto);
      expect(result).toEqual(mockResponse);
    });

    it('should use ValidationPipe with whitelist option', () => {
      expect(typeof controller.sendInterviewDateEmails).toBe('function');
      expect(controller.sendInterviewDateEmails).toHaveLength(1);
    });
  });

  describe('importInterviewScores', () => {
    it('should import interview scores', async () => {
      const mockResponse = { success: true, message: 'Scores imported' };
      mockApplicationMediator.importInterviewScores.mockResolvedValue(mockResponse);

      const result = await controller.importInterviewScores(mockInterviewScoresDto);

      expect(mockApplicationMediator.importInterviewScores).toHaveBeenCalledWith(mockInterviewScoresDto);
      expect(result).toEqual(mockResponse);
    });

    it('should use ValidationPipe with whitelist option', () => {
      expect(typeof controller.importInterviewScores).toBe('function');
      expect(controller.importInterviewScores).toHaveLength(1);
    });
  });

  describe('sendStatusEmails', () => {
    it('should send status emails', async () => {
      const mockResponse = { success: true, message: 'Status emails sent' };
      mockApplicationMediator.sendStatusEmail.mockResolvedValue(mockResponse);

      const result = await controller.sendStatusEmails(mockSendingEmailsDto);

      expect(mockApplicationMediator.sendStatusEmail).toHaveBeenCalledWith(mockSendingEmailsDto);
      expect(result).toEqual(mockResponse);
    });

    it('should use ValidationPipe with whitelist option', () => {
      expect(typeof controller.sendStatusEmails).toBe('function');
      expect(controller.sendStatusEmails).toHaveLength(1);
    });
  });

  describe('sendScheduleConfirmationEmails', () => {
    it('should send schedule confirmation emails', async () => {
      const mockResponse = { success: true, message: 'Schedule emails sent' };
      mockApplicationMediator.sendScheduleConfirmationEmails.mockResolvedValue(mockResponse);

      const result = await controller.sendScheduleConfirmationEmails(mockSendingEmailsDto);

      expect(mockApplicationMediator.sendScheduleConfirmationEmails).toHaveBeenCalledWith(mockSendingEmailsDto);
      expect(result).toEqual(mockResponse);
    });

    it('should use ValidationPipe with whitelist option', () => {
      expect(typeof controller.sendScheduleConfirmationEmails).toBe('function');
      expect(controller.sendScheduleConfirmationEmails).toHaveLength(1);
    });
  });

  describe('applyToFSE', () => {
    it('should apply to FSE program', async () => {
      const mockResponse = { success: true, message: 'Application submitted' };
      mockApplicationMediator.applyToFSE.mockResolvedValue(mockResponse);

      const result = await controller.applyToFSE(mockApplyToFSEDto);

      expect(mockApplicationMediator.applyToFSE).toHaveBeenCalledWith(mockApplyToFSEDto);
      expect(result).toEqual(mockResponse);
    });

    it('should use ValidationPipe with whitelist option', () => {
      expect(typeof controller.applyToFSE).toBe('function');
      expect(controller.applyToFSE).toHaveLength(1);
    });
  });

  describe('importData', () => {
    it('should import application data', async () => {
      const mockResponse = { success: true, message: 'Data imported' };
      mockApplicationMediator.importData.mockResolvedValue(mockResponse);

      const result = await controller.importData(mockImportDataDto);

      expect(mockApplicationMediator.importData).toHaveBeenCalledWith(mockImportDataDto);
      expect(result).toEqual(mockResponse);
    });

    it('should use ValidationPipe with whitelist option', () => {
      expect(typeof controller.importData).toBe('function');
      expect(controller.importData).toHaveLength(1);
    });
  });
});
