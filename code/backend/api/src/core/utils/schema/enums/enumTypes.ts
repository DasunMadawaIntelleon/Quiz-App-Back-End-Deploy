import { z } from 'zod';

import { UserRole, QuestionType, QuestionSection, Answer } from '../../../config/constants';

const RoleEnum = z.enum([UserRole.USER, UserRole.ADMIN]).refine(role => 
  [UserRole.USER, UserRole.ADMIN].includes(role), {
  message: "Invalid role provided"
});

const AnswerEnum = z.enum([Answer.A, Answer.B, Answer.C, Answer.D]).refine(answer => 
  [Answer.A, Answer.B, Answer.C, Answer.D].includes(answer), {
  message: "Invalid answer provided"
});

const QuestionTypeEnum = z.enum([QuestionType.MULTIPLE_ANSWERS, QuestionType.TRUE_FALSE, QuestionType.NORMAL]).refine(type => 
  [QuestionType.MULTIPLE_ANSWERS, QuestionType.TRUE_FALSE, QuestionType.NORMAL].includes(type), {
  message: "Invalid question type"
});

const QuestionSectionEnum = z.enum([QuestionSection.TECHNICAL, QuestionSection.CRITICAL, QuestionSection.OTHER]).refine(section => 
  [QuestionSection.TECHNICAL, QuestionSection.CRITICAL, QuestionSection.OTHER].includes(section), {
  message: "Invalid section type"
});

export {
  RoleEnum,
  AnswerEnum,
  QuestionTypeEnum,
  QuestionSectionEnum
};
