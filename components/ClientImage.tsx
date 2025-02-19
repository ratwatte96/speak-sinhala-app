"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect } from "react";

interface ClientImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const ClientImage = ({ src, alt, width, height }: ClientImageProps) => {
  const { theme } = useTheme();

  // It's a good idea to check if the theme has been resolved to avoid mismatches during SSR.
  if (!theme) return null;
  return (
    <>
      {src !== "/blackBackgroundTonguePositions.jpeg" ? (
        <Image src={src} alt={alt} width={width} height={height} />
      ) : src === "/blackBackgroundTonguePositions.jpeg" && theme === "dark" ? (
        <Image
          src={"/blackBackgroundTonguePositions.jpeg"}
          alt={alt}
          width={width}
          height={height}
        />
      ) : (
        <Image
          src={"/toungePositionsWhiteBackground.jpg"}
          alt={alt}
          width={width}
          height={height}
        />
      )}
    </>
  );
};

export default ClientImage;
