import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function BackButton() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href="/"
          aria-label="Back to the gallery"
          className="hover:cursor-pointer hover:text-zinc-200 bg-zinc-900"
        >
          <ChevronLeftIcon className="size-[24px] " />
        </a>
      </TooltipTrigger>
      <TooltipContent>
        <p>Back</p>
      </TooltipContent>
    </Tooltip>
  );
}
