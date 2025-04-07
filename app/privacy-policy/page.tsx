import { ThemeProvider } from "@/components/ThemeProvider";
import TopNavbar from "@/components/TopNavBar";
import BottomNavbar from "@/components/BottomNavbar";
import { SharedStateProvider } from "@/components/StateProvider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Learn Sinhala",
  description: "Learn about how we protect your privacy on Learn Sinhala",
};

export default function PrivacyPolicy() {
  return (
    <SharedStateProvider>
      <ThemeProvider>
        <TopNavbar loggedOut={true} isPremium={false} />
        <div className="min-h-screen bg-[#EAEAEA] dark:bg-black animate-fadeIn">
          <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
              Privacy Policy
            </h1>

            <div className="space-y-8 text-gray-700 dark:text-gray-300">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                  Overview
                </h2>
                <p className="mb-4">
                  Learn Sinhala is committed to protecting your privacy. This
                  policy explains how we collect, use, and protect your personal
                  information when you use our website.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                  Information We Collect
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-medium mb-2 text-gray-800 dark:text-white">
                      Account Information
                    </h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Username</li>
                      <li>Email address</li>
                      <li>Gender (optional)</li>
                      <li>Password (encrypted)</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium mb-2 text-gray-800 dark:text-white">
                      Learning Progress Data
                    </h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Quiz completion and scores</li>
                      <li>Learning streaks</li>
                      <li>Practice history</li>
                      <li>Premium membership status</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                  How We Use Your Information
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>To create and manage your account</li>
                  <li>To track and save your learning progress</li>
                  <li>To provide personalized learning experiences</li>
                  <li>To maintain your learning streak</li>
                  <li>To manage premium features access</li>
                  <li>To improve our website and services</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                  Cookies and Local Storage
                </h2>
                <p className="mb-4">
                  We use cookies and local storage to enhance your learning
                  experience. These are small pieces of data stored on your
                  device that help us:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Keep you signed in (authentication cookies)</li>
                  <li>Save your quiz progress (local storage)</li>
                  <li>Track your learning streaks (local storage)</li>
                  <li>Remember your preferences (local storage)</li>
                </ul>
                <p>
                  You can control cookies through your browser settings, but
                  disabling them may affect website functionality.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                  Data Security
                </h2>
                <p className="mb-4">
                  We implement appropriate security measures to protect your
                  personal information:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Passwords are encrypted</li>
                  <li>Secure authentication tokens</li>
                  <li>Regular security updates</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                  Your Rights
                </h2>
                <p className="mb-4">You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your account and data</li>
                  <li>Export your learning progress data</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                  Updates to This Policy
                </h2>
                <p className="mb-4">
                  We may update this privacy policy from time to time. Any
                  significant changes will be notified to you through the
                  website or email.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                  Contact Us
                </h2>
                <p className="mb-4">
                  If you have any questions about this privacy policy or your
                  personal data, please contact us.
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
