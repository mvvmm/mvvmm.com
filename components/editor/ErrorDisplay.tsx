"use client";

import { useExperience } from "@/contexts/ExperienceContext";
import type { ExperienceError } from "@/types/experience";

const getErrorMessage = (errorMessage: ExperienceError) => {
  const msg = errorMessage.message;
  const colonIndex = msg.indexOf(":");
  return colonIndex !== -1 ? msg.slice(colonIndex + 1).trim() : msg;
};

export default function ErrorDisplay() {
  const experience = useExperience();
  if (experience.errors.length === 0) {
    return null;
  }

  // return (
  //   <div className="mt-2 border-t border-red-500/30 bg-red-950/20 px-4 py-2 text-sm">
  //     <div className="mb-2 font-semibold text-red-400">
  //       Errors ({experience.errors.length})
  //     </div>
  //     <div className="space-y-2">
  //       {experience.errors.map((error) => {
  //         // Create a unique key from error properties
  //         const errorKey = `${error.message}-${error.filename}-${error.lineno}-${error.colno}`;
  //         return (
  //           <div
  //             key={errorKey}
  //             className="rounded border border-red-500/30 bg-red-950/10 p-3 text-red-300"
  //           >
  //             <div className="font-medium text-red-400">{error.message}</div>
  //             {(error.filename !== "unknown" || error.lineno > 0) && (
  //               <div className="mt-1 text-xs text-red-400/70">
  //                 {error.filename !== "unknown" && error.filename}
  //                 {error.lineno > 0 && `:${error.lineno}:${error.colno}`}
  //               </div>
  //             )}
  //             {error.stack && (
  //               <details className="mt-2">
  //                 <summary className="cursor-pointer text-xs text-red-400/60 hover:text-red-400/80">
  //                   Stack trace
  //                 </summary>
  //                 <pre className="mt-1 overflow-auto text-xs text-red-300/70">
  //                   {error.stack}
  //                 </pre>
  //               </details>
  //             )}
  //           </div>
  //         );
  //       })}
  //     </div>
  //   </div>
  // );

  return (
    <div className="bg-zinc-900 h-max-content mt-2 flex flex-col text-red-400 text-sm">
      {experience.errors[0] && (
        <div className="border-red-500 border">
          <div className="px-2">{getErrorMessage(experience.errors[0])}</div>
        </div>
      )}
    </div>
  );
}
