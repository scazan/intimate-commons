import Link from "next/link";
import { Button } from "../base/ui";

export const SiteHeader = async () => {
  return (
    <header className="flex flex-row justify-between items-center w-full uppercase p-4">
      <Link href="/">
        <h1 className="text-xl">Intimate Commons</h1>
      </Link>
      <Button asChild variant="large">
        <Link href="/questions">About</Link>
      </Button>
    </header>
  );
};

export default SiteHeader;
