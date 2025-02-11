import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Editor",
  description: "Edit some code",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.1.9/p5.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.1.9/addons/p5.sound.min.js"
        strategy="beforeInteractive"
      />
      {children}
    </>
  );
}
