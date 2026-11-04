import { DiplomaTypes } from '../models';

const progressAverage = (nums: number[], precision: number) => {
  if (nums.length === 0) return 0;
  const total = nums.reduce((prev, current) => prev + current, 0);
  return parseFloat((total / nums.length).toFixed(precision));
};

export const calculateSectionProgress = (
  section: DiplomaTypes.Section,
): number => {
  const {
    progress: { completed, total },
  } = section;
  if (!total || total <= 0) return 0;
  return parseFloat(((completed / total) * 100).toFixed(0));
};

export const calculateCourseProgress = (
  course: DiplomaTypes.Course,
  precision = 0,
): number => {
  const { sections } = course;
  if (!sections || sections.length === 0) return 0;
  const progresses = sections.map(calculateSectionProgress);
  return progressAverage(progresses, precision);
};

export const calculateSemesterProgress = (
  semester: DiplomaTypes.Semester,
  precision = 0,
): number => {
  // Consider core content only.
  const courses = semester.courses.filter((c) => !c.isOptional);
  if (courses.length === 0) return 0;
  const progresses = courses.map(calculateCourseProgress);
  return progressAverage(progresses, precision);
};

export const calculateDiplomaProgress = (
  diploma: DiplomaTypes.Curriculum,
  precision = 0,
): number => {
  const { semesters } = diploma;
  if (!semesters || semesters.length === 0) return 0;
  const progresses = semesters.map(calculateSemesterProgress);
  return progressAverage(progresses, precision);
};
