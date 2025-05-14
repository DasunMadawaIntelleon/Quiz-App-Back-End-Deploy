-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('MULTIPLE_ANSWERS', 'TRUE_FALSE', 'NORMAL');

-- CreateEnum
CREATE TYPE "QuestionSection" AS ENUM ('TECHNICAL', 'CRITICAL', 'OTHER');

-- CreateEnum
CREATE TYPE "Answer" AS ENUM ('A', 'B', 'C', 'D');

-- CreateEnum
CREATE TYPE "UserAnswerStatus" AS ENUM ('CORRECT', 'WRONG', 'EMPTY');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "user_name" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quiz" (
    "id" TEXT NOT NULL,
    "start_date_time" TIMESTAMP(3) NOT NULL,
    "end_date_time" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "estimated_count" INTEGER NOT NULL,
    "is_visible" BOOLEAN NOT NULL,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "a" TEXT NOT NULL,
    "b" TEXT NOT NULL,
    "c" TEXT,
    "d" TEXT,
    "active" BOOLEAN NOT NULL,
    "question_type" "QuestionType" NOT NULL,
    "section" "QuestionSection" NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionAnswer" (
    "question_id" TEXT NOT NULL,
    "answer" "Answer" NOT NULL,

    CONSTRAINT "QuestionAnswer_pkey" PRIMARY KEY ("question_id","answer")
);

-- CreateTable
CREATE TABLE "QuizQuestion" (
    "quiz_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "question_number" INTEGER NOT NULL,

    CONSTRAINT "QuizQuestion_pkey" PRIMARY KEY ("quiz_id","question_id")
);

-- CreateTable
CREATE TABLE "UserQuizQuestion" (
    "question_number" INTEGER NOT NULL,
    "user_name" TEXT NOT NULL,
    "quiz_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "is_correct" "UserAnswerStatus" NOT NULL,

    CONSTRAINT "UserQuizQuestion_pkey" PRIMARY KEY ("user_name","quiz_id","question_id")
);

-- CreateTable
CREATE TABLE "UserQuiz" (
    "quiz_id" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "is_submitted" BOOLEAN NOT NULL,

    CONSTRAINT "UserQuiz_pkey" PRIMARY KEY ("quiz_id","user_name")
);

-- CreateTable
CREATE TABLE "UserAnswer" (
    "question_number" INTEGER NOT NULL,
    "user_name" TEXT NOT NULL,
    "quiz_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "answer" "Answer" NOT NULL,

    CONSTRAINT "UserAnswer_pkey" PRIMARY KEY ("user_name","quiz_id","question_id","answer")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_user_name_key" ON "User"("user_name");

-- AddForeignKey
ALTER TABLE "QuestionAnswer" ADD CONSTRAINT "QuestionAnswer_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizQuestion" ADD CONSTRAINT "QuizQuestion_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizQuestion" ADD CONSTRAINT "QuizQuestion_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuizQuestion" ADD CONSTRAINT "UserQuizQuestion_user_name_fkey" FOREIGN KEY ("user_name") REFERENCES "User"("user_name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuizQuestion" ADD CONSTRAINT "UserQuizQuestion_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuizQuestion" ADD CONSTRAINT "UserQuizQuestion_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuiz" ADD CONSTRAINT "UserQuiz_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuiz" ADD CONSTRAINT "UserQuiz_user_name_fkey" FOREIGN KEY ("user_name") REFERENCES "User"("user_name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAnswer" ADD CONSTRAINT "UserAnswer_user_name_quiz_id_question_id_fkey" FOREIGN KEY ("user_name", "quiz_id", "question_id") REFERENCES "UserQuizQuestion"("user_name", "quiz_id", "question_id") ON DELETE RESTRICT ON UPDATE CASCADE;
