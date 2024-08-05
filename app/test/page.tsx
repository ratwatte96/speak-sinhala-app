import { SinhalaDisplay } from "@/components/SinhalaDisplay";

export default function Test() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-skin-base">
      <SinhalaDisplay phonetic={"hataxa"} />
    </main>
  );
}
