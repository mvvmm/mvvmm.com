"use client";

import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/")}
      className="hover:cursor-pointer hover:text-zinc-200 bg-zinc-900"
    >
      <ChevronLeftIcon className="size-[24px] " />
    </button>
  );
}
