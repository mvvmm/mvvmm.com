import BackButton from "./BackButton";
import FileSwitcher from "./FileSwitcher";

export default function Controls() {
  return (
    <div className="w-min flex items-stretch gap-2 mb-1 text-zinc-400 line-height-[1.4]">
      <BackButton />
      <FileSwitcher />
    </div>
  );
}
