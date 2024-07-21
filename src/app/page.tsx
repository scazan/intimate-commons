import { ChooseUser } from "@/components/User";
import { cookies } from "next/headers";

export default async () => {
  const userId = cookies().get("userId");
  const userName = cookies().get("userName");

  return (
    <div className="sm:max-w-7xl flex min-h-screen flex-col items-center justify-between p-4 font-extralight font-serif text-[2rem] leading-[2.575rem] pb-32">
      <div className="flex flex-col gap-8">
        <p>
          Welcome to Intimate Commons an exploration of personal boundaries and
          shared intimacies. Through this experience, we invite you to
          contemplate the hypothetical exchange of your most personal
          experiences, spaces, and relationships.
        </p>
        <p>
          This interactive journey tests the waters of your comfort zone,
          pushing you to rethink what is 'private' in our interconnected world.
          As each participant contributes, a living dialogue evolves—the large
          language model employed generates unique prompts, shaped by your
          responses, for future participants.
        </p>
        <p>
          Intimate Commons offers more than a personal exploration—it's a window
          into the shared sentiments of diverse communities. By participating,
          you join a conversation, illuminating our collective relationship with
          sharing. Are you ready to delve into your Intimate Commons?
        </p>
      </div>
      <div className="fixed flex items-center justify-center bottom-8 right-0 font-sans text-base font-extralight w-full">
        <ChooseUser
          userId={userId}
          userName={userName}
          className="text-center bg-background/80"
        />
      </div>
    </div>
  );
};
