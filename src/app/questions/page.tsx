import { getQuestions } from "@/api";
import QuestionForm from "@/components/QuestionForm";

export default async () => {
  const choices = await getQuestions();

  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-4 p-4">
      <QuestionForm choices={choices} className="w-full" />
    </main>
  );
};
