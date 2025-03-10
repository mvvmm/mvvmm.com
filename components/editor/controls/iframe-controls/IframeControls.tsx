import Opacity from "./Opacity";
import Pause from "./Pause";

export default function IframeControls() {
  return (
    <div className="flex gap-2">
      <Pause />
      <Opacity />
    </div>
  );
}
