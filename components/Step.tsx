import { QuizData, QuizStep } from "./QuizStep";
import { LessonStep } from "./LessonStep";
import { PairsQuestionStep } from "./PairsQuestionStep";

export interface Step {
  type: "question" | "lesson" | "additional";
  content: QuizData | LessonStep | PairsData;
}

interface LessonStep {
  stepType: string;
}

interface PairsData {
  questionType: number;
  pairs: any[];
  sounds: any[];
  isHard: boolean;
}

export interface StepProps {
  step: Step;
  nextStep: () => void;
  updateLives: () => void;
  lives: number;
}

export const Step: React.FC<StepProps> = ({
  step,
  nextStep,
  updateLives,
  lives,
}) => {
  return (
    <>
      {step.type === "question" && "answers" in step.content ? (
        <QuizStep
          correctAnswer={step.content.correctAnswer}
          question_word={step.content.question_word}
          updateLives={updateLives}
          lives={lives}
          nextStep={nextStep}
          answers={step.content.answers}
          questionType={step.content.questionType}
          specific_note={step.content.specific_note}
          additonal_information={step.content.additonal_information}
          isHard={step.content.isHard}
        />
      ) : step.type === "question" && "pairs" in step.content ? (
        <PairsQuestionStep
          nextStep={nextStep}
          pairs={step.content.pairs}
          sounds={step.content.sounds}
          updateLives={updateLives}
          isHard={step.content.isHard}
        />
      ) : (
        <LessonStep nextStep={nextStep} />
      )}
    </>
  );
};
