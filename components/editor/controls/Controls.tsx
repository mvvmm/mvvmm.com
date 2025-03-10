import EditorControls from "./editor-controls/EditorControls";
import IframeControls from "./iframe-controls/IframeControls";

export default function Controls() {
  return (
    <div className="line-height-[1.4] mb-1 flex items-stretch justify-between text-zinc-400">
      <EditorControls />
      <IframeControls />
    </div>
  );
}
