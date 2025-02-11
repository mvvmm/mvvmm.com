import { Button } from "@/components/ui/button";
import { getScripts } from "@/data/getScripts";

export default async function Home() {
  const scripts = await getScripts();

  return (
    <>
      <Button>test</Button>
    </>
  );
}
