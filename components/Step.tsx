import { QuizData, QuizStep } from "./QuizStep";
import { LessonStep } from "./LessonStep";
import { PairsQuestionStep } from "./PairsQuestionStep";
import { NewLettersStep } from "./NewLettersStep";

export interface Step {
  questionId?: number;
  type: "question" | "lesson" | "additional" | "newLetterData";
  content: QuizData | LessonStep | PairsData | NewLetterData[];
}

interface LessonStep {
  stepType: string;
  data: any;
}

interface PairsData {
  questionType: number;
  pairs: any[];
  sounds: any[];
  isHard: boolean;
}

export interface NewLetterData {
  sound: string;
  sinhala: string;
  englishWord: string;
}

export interface StepProps {
  step: Step;
  nextStep: (isMistake: boolean) => void;
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
      {step.type === "newLetterData" ? (
        <NewLettersStep nextStep={nextStep} data={step.content as any} />
      ) : step.type === "question" && "answers" in step.content ? (
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
          audio={step.content.audio}
          isMistake={step.content.isMistake}
          isLetterQuiz={step.content.isLetterQuiz}
        />
      ) : step.type === "question" && "pairs" in step.content ? (
        <PairsQuestionStep
          nextStep={nextStep}
          pairs={step.content.pairs}
          sounds={step.content.sounds}
          updateLives={updateLives}
          isHard={step.content.isHard}
          questionType={step.content.questionType}
        />
      ) : step.type === "lesson" && "data" in step.content ? (
        <LessonStep nextStep={nextStep} data={step.content.data} />
      ) : (
        <></>
      )}
    </>
  );
};
