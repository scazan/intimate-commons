import { getQuestions } from "@/api";
import { checkUserId } from "@/api/actions";
import QuestionForm from "@/components/QuestionForm";
import { Suspense } from "react";

export default async () => {
  const { sessionId, choices } = await getQuestions();

  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-4 p-4">
      <Suspense fallback={null}>
        <QuestionForm
          choices={choices}
          sessionId={sessionId}
          className="w-full"
        />
      </Suspense>
    </main>
  );
};
