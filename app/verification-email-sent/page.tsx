export default function VerificationEmailSent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-50">
      <div className="p-8 bg-white shadow-lg rounded-xl text-center">
        <h1 className="text-2xl font-bold text-blue-600">
          Verification Email Sent
        </h1>
        <p className="mt-4 text-gray-600">
          If an account with this email exists, a new verification email has
          been sent.
        </p>
        <a
          href="/"
          className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Go to Homepage
        </a>
      </div>
    </div>
  );
}
