import { ChooseUser } from "@/components/User";

export default async () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <ChooseUser />
    </main>
  );
};
