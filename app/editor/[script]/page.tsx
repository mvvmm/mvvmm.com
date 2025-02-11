import { Editor } from "@/components/Editor";
import ScriptIFrame from "@/components/ScriptIFrame";
import { ScriptProvider } from "@/contexts/ScriptContext";
import { getCSSContents } from "@/data/getCSSContents";
import { getScriptContents } from "@/data/getScriptContents";

export default async function Page({
  params,
}: {
  params: Promise<{ script: string }>;
}) {
  const _params = await params;
  const script = await getScriptContents(_params.script);
  const css = await getCSSContents(_params.script);

  return (
    <>
      <ScriptProvider script={script} css={css}>
        <Editor />
        <ScriptIFrame />
      </ScriptProvider>
    </>
  );
}
