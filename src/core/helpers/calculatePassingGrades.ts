import { Status } from '../data/types/applications/applications.types';

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
