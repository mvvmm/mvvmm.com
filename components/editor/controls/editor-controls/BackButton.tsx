"use client";

import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function BackButton() {
  const router = useRouter();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="hover:cursor-pointer hover:text-zinc-200 bg-zinc-900"
        >
          <ChevronLeftIcon className="size-[24px] " />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Back</p>
      </TooltipContent>
    </Tooltip>
  );
}
