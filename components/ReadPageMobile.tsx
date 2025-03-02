import { CompletionBar } from "./CompletionBar";
import { CustomQuizForm } from "./CustomQuizForm";
import Lessons from "./Lessons";

interface ReadPageMobileProps {
  quizCompletionPercentage: number;
  decoded: any;
  sinhalaObjects: any[];
  isPremium: boolean;
  units: any[];
  readStatus: object;
}

export default function ReadPageMobile({
  quizCompletionPercentage,
  decoded,
  sinhalaObjects,
  isPremium,
  units,
  readStatus,
}: ReadPageMobileProps) {
  return (
    <div className="mx-6 mt-10 mb-16 sm:w-96">
      <CompletionBar quizPercentage={quizCompletionPercentage} />
      {decoded && (
        <CustomQuizForm
          dropDownLetters={sinhalaObjects}
          isPremium={isPremium}
        />
      )}
      <div className="mt-2">
        <Lessons unitData={units} readStatus={readStatus} loggedIn={decoded} />
      </div>
    </div>
  );
}
