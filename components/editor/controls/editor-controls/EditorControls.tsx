import BackButton from "./BackButton";
import FileSwitcher from "./FileSwitcher";

export default function EditorControls() {
  return (
    <div className="flex gap-2">
      <BackButton />
      <FileSwitcher />
    </div>
  );
}
