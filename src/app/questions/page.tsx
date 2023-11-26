import { getQuestions } from "@/api";
import QuestionForm from "@/components/QuestionForm";

export default async () => {
  const { sessionId, choices } = await getQuestions();

  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-4 p-4">
      <QuestionForm
        choices={choices}
        sessionId={sessionId}
        className="w-full"
      />
    </main>
  );
};
