import { getScripts } from "@/data/getScripts";
import Link from "next/link";

export default async function Home() {
  const scripts = await getScripts();

  return (
    <>
      {scripts.map((script) => (
        <p key={script}>{<Link href={`/editor/${script}`}>{script}</Link>}</p>
      ))}
    </>
  );
}
