import ScriptIFrame from "@/components/ScriptIFrame";
import { ScriptProvider } from "@/contexts/ScriptContext";
import { getCSSContents } from "@/data/getCSSContents";
import { getScriptContents } from "@/data/getScriptContents";
import { getScripts } from "@/data/getScripts";
import Link from "next/link";

export default async function Home() {
  const scripts = await getScripts();
  const scriptArray: string[] = [];
  const cssArray: string[] = [];

  for (const script of scripts) {
    scriptArray.push(await getScriptContents(script));
  }

  for (const script of scripts) {
    cssArray.push(await getCSSContents(script));
  }

  return (
    <>
      <div className="w-full grid grid-cols-auto-fit-300">
        {scripts.map((script, i) => (
          <Link
            href={`/editor/${script}`}
            key={script}
            className="relative w-full h-80 transition-transform hover:scale-[1.01] hover:z-10"
          >
            <ScriptProvider
              script={scriptArray[i]}
              css={cssArray[i]}
              scale={0.33}
            >
              <ScriptIFrame className="pointer-events-none" />
            </ScriptProvider>
          </Link>
        ))}
      </div>
    </>
  );
}
