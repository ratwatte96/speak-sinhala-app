import Image from "next/image";
import { Outfit } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"] });
export default function Logo({ width, height, textSize }: any) {
  return (
    <a href="/" className="relative">
      <div className="flex flex-col items-center">
        <Image
          src="/Flag_of_Sri_Lanka.svg.png"
          alt="Sri Lankan Flag"
          width={width}
          height={width}
        />
        <span className={`${outfit.className} ${textSize} mt-0.5`}>
          Learn Sinhala
        </span>
      </div>
    </a>
  );
}
