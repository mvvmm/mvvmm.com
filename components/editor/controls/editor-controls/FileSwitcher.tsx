"use client";

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { clsx } from "clsx";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useExperience } from "@/contexts/ExperienceContext";

export default function FileSwitcher() {
  const experience = useExperience();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="w-32 max-w-md">
          <Listbox
            value={experience.activeFile.name}
            onChange={(fileName) => {
              experience.updateActiveFile({ fileName });
            }}
          >
            <ListboxButton
              className={clsx(
                "relative block w-full pl-3 text-left bg-zinc-900 hover:text-zinc-200",
              )}
            >
              {experience.activeFile.name}
              <ChevronDownIcon
                className="group pointer-events-none absolute -translate-y-1/2 top-1/2 right-2.5 size-[14px] fill-white/60"
                aria-hidden="true"
              />
            </ListboxButton>
            <ListboxOptions
              anchor="bottom"
              transition
              className={clsx("w-[var(--button-width)] bg-zinc-900 z-10 mt-1")}
            >
              {experience.experience.fileNames.map((fileName) => (
                <ListboxOption
                  key={fileName}
                  value={fileName}
                  className="group cursor-pointer px-3 select-none data-[focus]:bg-zinc-800"
                >
                  <div className="text-zinc-400 group-data-[selected]:underline hover:text-zinc-200">
                    {fileName}
                  </div>
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Listbox>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>Switch files</p>
      </TooltipContent>
    </Tooltip>
  );
}
