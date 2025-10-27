import Opacity from "./Opacity";
import Pause from "./Pause";
import PointerEvents from "./PointerEvents";

export default function IframeControls() {
  return (
    <div className="flex gap-2">
      <PointerEvents />
      <Pause />
      <Opacity />
    </div>
  );
}
