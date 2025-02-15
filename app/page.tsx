import RedirectWithLoading from "@/components/RedirectWithLoading";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function Home() {
  return (
    <ThemeProvider>
      <main className="flex items-center min-w-screen flex-col justify-center min-h-screen">
        <RedirectWithLoading />
      </main>
    </ThemeProvider>
  );
}
