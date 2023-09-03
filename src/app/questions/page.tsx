import QuestionForm from "@/components/QuestionForm";

export default async () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <QuestionForm className="w-full" />
    </main>
  );
};
