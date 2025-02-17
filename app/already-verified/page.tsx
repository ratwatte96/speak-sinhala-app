import Logo from "@/components/Logo";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function AlreadyVerified() {
  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen items-center justify-center bg-gray-100 dark:bg-black">
        <Logo width={120} height={80} textSize={"text-3xl"} />
        <div className="p-6 bg-white shadow-lg rounded-lg text-center dark:bg-black dark:border dark:border-solid dark:border-gray-400 w-80 mt-6">
          <h1 className="text-md sm:text-xl font-semibold text-yellow-600 dark:text-yellow-500">
            Already Verified
          </h1>
          <p className="mt-4 text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Your email has already been verified. You can log in to your
            account.
          </p>
          <a
            href="/login"
            className="mt-6 inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-all"
          >
            Go to Login
          </a>
        </div>
      </div>
    </ThemeProvider>
  );
}
