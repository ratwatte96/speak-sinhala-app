import Logo from "@/components/Logo";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function AlreadyVerified() {
  return (
    <ThemeProvider>
      <div className="page-container">
        <Logo width={120} height={80} textSize={"text-3xl"} />
        <div className="auth-card">
          <h1 className="card-heading">Already Verified</h1>
          <p className="card-text">
            Your email has already been verified. You can log in to your
            account.
          </p>
          <a href="/login" className="btn-action mt-6 inline-block">
            Go to Login
          </a>
        </div>
      </div>
    </ThemeProvider>
  );
}
