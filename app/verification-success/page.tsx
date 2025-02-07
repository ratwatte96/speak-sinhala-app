export default function VerificationSuccess() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-green-50">
      <div className="p-8 bg-white shadow-lg rounded-xl text-center">
        <h1 className="text-2xl font-bold text-green-600">Email Verified!</h1>
        <p className="mt-4 text-gray-600">
          Your email has been successfully verified. You can now log in and
          start using your account.
        </p>
        <a
          href="/login"
          className="mt-6 inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
        >
          Go to Login
        </a>
      </div>
    </div>
  );
}
