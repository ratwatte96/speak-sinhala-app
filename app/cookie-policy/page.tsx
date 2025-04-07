import { ThemeProvider } from "@/components/ThemeProvider";
import TopNavbar from "@/components/TopNavBar";
import BottomNavbar from "@/components/BottomNavbar";
import { SharedStateProvider } from "@/components/StateProvider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy - Learn Sinhala",
  description:
    "Learn about how we use cookies and local storage on Learn Sinhala",
};

export default function CookiePolicy() {
  return (
    <SharedStateProvider>
      <ThemeProvider>
        <TopNavbar loggedOut={true} isPremium={false} />
        <div className="min-h-screen bg-[#EAEAEA] dark:bg-black animate-fadeIn">
          <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
              Cookie Policy
            </h1>

            <div className="space-y-6 text-gray-700 dark:text-gray-300">
              <section>
                <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                  What are cookies and local storage?
                </h2>
                <p className="mb-4">
                  Cookies are small text files that are stored on your device
                  when you visit our website. Local storage is a similar
                  technology that allows us to store data on your device. We use
                  both to provide you with a better learning experience.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                  How we use cookies and local storage
                </h2>
                <p className="mb-2">We use these technologies for:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>
                    Authentication: To keep you signed in and secure your
                    account
                  </li>
                  <li>
                    Progress Tracking: To save your quiz progress and learning
                    achievements
                  </li>
                  <li>
                    Preferences: To remember your language and theme preferences
                  </li>
                  <li>
                    Learning Streaks: To track your daily learning progress
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                  Types of data we store
                </h2>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Authentication tokens (cookies)</li>
                  <li>Quiz progress (local storage)</li>
                  <li>Learning streak information (local storage)</li>
                  <li>User preferences (local storage)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                  Your choices
                </h2>
                <p className="mb-4">
                  Most web browsers allow you to control cookies through their
                  settings. However, if you choose to disable cookies, some
                  features of our website may not work properly. The same
                  applies to local storage, which can be cleared through your
                  browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                  Updates to this policy
                </h2>
                <p className="mb-4">
                  We may update this cookie policy from time to time. Any
                  changes will be posted on this page.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                  Contact us
                </h2>
                <p className="mb-4">
                  If you have any questions about our cookie policy, please
                  contact us.
                </p>
              </section>
            </div>
          </div>
        </div>
        <BottomNavbar />
      </ThemeProvider>
    </SharedStateProvider>
  );
}
