import { Status } from '../data/types/applications/applications.types';
import { Application } from '../data/database/entities/application.entity';

export const calculatePassedExam = (
  examScore: number,
  passingGrade?: number,
): { passedExam: boolean; passedExamDate: Date | null } => {
  if (passingGrade === undefined || examScore < 0) {
    return { passedExam: false, passedExamDate: null };
  }

  const passedExam = examScore >= passingGrade;
  const passedExamDate = new Date();

  return { passedExam, passedExamDate };
};

export const calculatePassedInterview = (
  techInterviewScore?: number,
  softInterviewScore?: number,
  thresholds?: {
    weightTech: number;
    weightSoft: number;
    primaryPassingGrade: number;
    secondaryPassingGrade: number;
  },
  skipStatusUpdate: boolean = false,
): {
  passedInterview: boolean | null;
  applicationStatus?: Status;
  passedInterviewDate: Date | null;
} => {
  if (
    techInterviewScore === undefined ||
    softInterviewScore === undefined ||
    !thresholds ||
    thresholds.weightTech === undefined ||
    thresholds.weightSoft === undefined ||
    thresholds.primaryPassingGrade === undefined ||
    thresholds.secondaryPassingGrade === undefined
  ) {
    return {
      passedInterview: null,
      applicationStatus: Status.PENDING,
      passedInterviewDate: null,
    };
  }

  const { weightTech, weightSoft, primaryPassingGrade, secondaryPassingGrade } =
    thresholds;

  const interviewGrade =
    weightTech * techInterviewScore + weightSoft * softInterviewScore;

  let applicationStatus: Status;

  if (interviewGrade >= primaryPassingGrade) {
    applicationStatus = Status.ACCEPTED;
  } else if (interviewGrade >= secondaryPassingGrade) {
    applicationStatus = Status.WAITING_LIST;
  } else {
    applicationStatus = Status.REJECTED;
  }

  const passedInterview = applicationStatus === Status.REJECTED ? false : true;
  const passedInterviewDate = new Date();

  if (skipStatusUpdate) {
    return { passedInterview, passedInterviewDate };
  } else {
    return { passedInterview, applicationStatus, passedInterviewDate };
  }
};

export const calculatePassedInterviewOptimized = async (
  applicationId: number,
  newTechScore?: number,
  newSoftScore?: number,
  thresholds?: {
    weightTech: number;
    weightSoft: number;
    primaryPassingGrade: number;
    secondaryPassingGrade: number;
  },
  skipStatusUpdate: boolean = false,
): Promise<{
  passedInterview: boolean | null;
  applicationStatus?: Status;
  passedInterviewDate: Date | null;
}> => {
  const application = await Application.findOne({ where: { id: applicationId } });
  
  if (!application) {
    return {
      passedInterview: null,
      applicationStatus: Status.PENDING,
      passedInterviewDate: null,
    };
  }

  // Use new scores if provided, otherwise use existing scores from database
  const techInterviewScore = newTechScore !== undefined ? newTechScore : application.tech_interview_score;
  const softInterviewScore = newSoftScore !== undefined ? newSoftScore : application.soft_interview_score;

  // Check if we have both scores available
  const hasTechScore = techInterviewScore !== undefined && techInterviewScore !== null;
  const hasSoftScore = softInterviewScore !== undefined && softInterviewScore !== null;

  // If we don't have both scores, the interview fails (doesn't pass)
  if (!hasTechScore || !hasSoftScore) {
    return {
      passedInterview: false, // Interview fails if only one score is available
      applicationStatus: Status.REJECTED,
      passedInterviewDate: new Date(),
    };
  }

  return calculatePassedInterview(
    techInterviewScore,
    softInterviewScore,
    thresholds,
    skipStatusUpdate,
  );
};
