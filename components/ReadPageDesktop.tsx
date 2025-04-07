import { CompletionBar } from "./CompletionBar";
import { CustomQuizForm } from "./CustomQuizForm";
import Lessons from "./Lessons";
import ProfileCard from "./ProfileCard";
import Shop from "./ShopComponent";
import Tabs from "./Tabs";

interface ReadPageDesktopProps {
  quizCompletionPercentage: number;
  decoded: any;
  sinhalaObjects: any[];
  isPremium: boolean;
  units: any[];
  readStatus: object;
  userData: any;
}

export default function ReadPageDesktop({
  quizCompletionPercentage,
  decoded,
  sinhalaObjects,
  isPremium,
  units,
  readStatus,
  userData,
}: ReadPageDesktopProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#EAEAEA] dark:bg-black">
      <div className="mx-4 flex flex-col md:flex-row justify-around max-h-[100vh] mt-10">
        <div className="relative w-full pl-8 pr-12">
          {!decoded && (
            <div className="overlay-container">
              <div className="overlay-bg"></div>
              <div className="flex flex-col">
                <a href="/login" className="relative z-10">
                  <button className="btn-action w-40 mb-2">Login</button>
                </a>
                <a href="/signup" className="relative z-10">
                  <button className="btn-secondary bg-yellow-400 w-40">
                    Signup to Unlock
                  </button>
                </a>
              </div>
            </div>
          )}
          <div className={!decoded ? "blurred-content" : ""}>
            <Shop />
          </div>
        </div>
        <div className="mx-4 w-full flex justify-center">
          <Tabs
            readComponent={
              <>
                <CompletionBar quizPercentage={quizCompletionPercentage} />
                {decoded && (
                  <CustomQuizForm
                    dropDownLetters={sinhalaObjects}
                    isPremium={isPremium}
                  />
                )}
                <div className="mt-4">
                  <Lessons
                    unitData={units}
                    readStatus={readStatus}
                    loggedIn={decoded}
                  />
                </div>
              </>
            }
            speakComponent={
              <div className="text-center">🎤 Speak section coming soon!</div>
            }
          />
        </div>
        <div className="relative w-full flex justify-center pl-12 pr-8">
          {!decoded && (
            <div className="overlay-container">
              <div className="overlay-bg"></div>
              <div className="flex flex-col">
                <a href="/login" className="relative z-10">
                  <button className="btn-action w-40 mb-2">Login</button>
                </a>
                <a href="/signup" className="relative z-10">
                  <button className="btn-secondary bg-yellow-400 w-40">
                    Signup to Unlock
                  </button>
                </a>
              </div>
            </div>
          )}
          <div className={!decoded ? "blurred-content" : ""}>
            <ProfileCard
              userData={
                userData ?? {
                  username: "",
                  email: "",
                  readPercentage: 0,
                  premiumEndDate: null,
                }
              }
              isPremium={isPremium}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
