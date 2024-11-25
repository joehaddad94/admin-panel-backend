import { Status } from '../data/types/applications/applications.types';

export const calculatePassedExam = (
  examScore: number,
  passingGrade?: number,
): { passedExam: boolean; passedExamDate: Date | null } => {
  if (passingGrade === undefined || examScore < 0) {
    return { passedExam: false, passedExamDate: null };
  }

  const passedExam = examScore >= passingGrade;
  const passedExamDate = passedExam ? new Date() : null;

  return { passedExam, passedExamDate };
};

export const calculatePassedInterview = (
  techInterviewScore: number,
  softInterviewScore: number,
  thresholds: {
    weightTech: number;
    weightSoft: number;
    primaryPassingGrade: number;
    secondaryPassingGrade: number;
  },
): {
  passedInterview: boolean;
  interviewStatus: Status;
  passedInterviewDate: Date | null;
} => {
  const { weightTech, weightSoft, primaryPassingGrade, secondaryPassingGrade } =
    thresholds;

  if (
    weightTech === undefined ||
    weightSoft === undefined ||
    techInterviewScore < 0 ||
    softInterviewScore < 0
  ) {
    return {
      passedInterview: false,
      interviewStatus: Status.REJECTED,
      passedInterviewDate: null,
    };
  }

  const interviewGrade =
    weightTech * techInterviewScore + weightSoft * softInterviewScore;

  let interviewStatus: Status;
  if (interviewGrade >= primaryPassingGrade) {
    interviewStatus = Status.ACCEPTED;
  } else if (interviewGrade >= secondaryPassingGrade) {
    interviewStatus = Status.WAITING_LIST;
  } else {
    interviewStatus = Status.REJECTED;
  }

  const passedInterview = interviewStatus !== Status.REJECTED;
  const passedInterviewDate = passedInterview ? new Date() : null;

  return { passedInterview, interviewStatus, passedInterviewDate };
};
