import QuestionForm from "@/components/QuestionForm";

export default async () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-4 p-4">
      <QuestionForm className="w-full" />
    </main>
  );
};
