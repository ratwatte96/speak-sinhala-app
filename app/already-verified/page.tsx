export default function AlreadyVerified() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-yellow-50">
      <div className="p-8 bg-white shadow-lg rounded-xl text-center">
        <h1 className="text-2xl font-bold text-yellow-600">Already Verified</h1>
        <p className="mt-4 text-gray-600">
          Your email has already been verified. You can log in to your account.
        </p>
        <a
          href="/login"
          className="mt-6 inline-block bg-yellow-600 text-white px-6 py-2 rounded-md hover:bg-yellow-700"
        >
          Go to Login
        </a>
      </div>
    </div>
  );
}
