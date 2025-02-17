import { CompletionBar } from "./CompletionBar";
import { CustomQuizForm } from "./CustomQuizForm";
import Lessons from "./Lessons";
import { TutorialModal } from "./TutorialModal";

interface ReadPageProps {
  quizCompletionPercentage: number;
  decoded: any;
  sinhalaObjects: any[];
  isPremium: boolean;
  units: any[];
  readStatus: object;
}

export default function ReadPage({
  quizCompletionPercentage,
  decoded,
  sinhalaObjects,
  isPremium,
  units,
  readStatus,
}: ReadPageProps) {
  let storageName = "firstTime";
  let tutorialText = [
    "This site will help you practice reading and speaking Sinhala. During the beta phase, only reading exercises are available.",
    "Our structured course includes 13 quiz-based units to help you master Sinhala reading. You can start with Unit 1 for free. No sign-up required!",
    "Unlock all units for free by signing up. Start learning today and make steady progress on your Sinhala journey!",
  ];
  if (decoded) {
    storageName = "firstLogin";
    tutorialText = [
      "Thanks for signing up! Practice daily to improve and maintain your learning streak.",
      "Now that you're signed up, you'll receive 5 lives each day, but unlimited refills are no longer available.",
      "You can purchase refills from the shop. During the beta phase, refills are free.",
      "Premium members get unlimited refills and access to the custom quiz feature. You can upgrade in the shop for free.",
      "Good luck on your Sinhala learning journey!",
    ];
  }

  return (
    <div className="mx-6 sm:w-96">
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
      <TutorialModal
        localStorageName={storageName}
        tutorialText={tutorialText}
        title={"Learn Sinhala"}
      />
    </div>
  );
}
