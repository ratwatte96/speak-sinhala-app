export default function VerificationError() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-red-50">
      <div className="p-8 bg-white shadow-lg rounded-xl text-center">
        <h1 className="text-2xl font-bold text-red-600">Verification Failed</h1>
        <p className="mt-4 text-gray-600">
          The verification link is invalid or has expired. You can request a new
          verification email.
        </p>
        <a
          href="/resend-verification"
          className="mt-6 inline-block bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
        >
          Resend Verification Email
        </a>
      </div>
    </div>
  );
}
