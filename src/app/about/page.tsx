import { cookies } from "next/headers";

export default async () => {
  const userId = cookies().get("userId");
  const userName = cookies().get("userName");

  return (
    <div className="sm:max-w-7xl flex min-h-screen flex-col items-center justify-between p-4 font-extralight font-serif text-[2rem] leading-[2.575rem] pb-32">
      <div className="flex flex-col gap-8">
        <p>
          Intimate Commons extends the concept of the commons and commoning into
          the intimate realms of personal experiences, spaces, and
          relationships. This provocation interrogates how hypothetical
          exchanges of our most intimate aspects can shift perceptions and norms
          around sharing and privacy within communities, and how these
          perceptions might vary across different societal groups. Through a
          participatory design approach, the provocation challenges participants
          to reimagine boundaries of privacy and ownership via a digital
          platform backed by a Large Language Model (LLM) trained on a real-time
          aggregation of participant data that crafts tuned scenarios relevant
          to participants in the exhibition space. These scenarios are designed
          to prompt reflection on the willingness to share one's most personal
          spaces and relationships, thereby contributing to a collective
          narrative that is visualized in a physical art installation. This
          installation, a womb-like structure filled with color-coded liquids,
          represents the diverse experiences and exchanges shared by
          participants, accompanied by an AI-generated narrative soundscape that
          evolves in real time based on participant input.
        </p>
        <p>
          Intimate Commons aims to create a dialogue around the evolving
          meanings of commons in the digital age. It seeks to uncover how
          digital technologies can both challenge and reinforce community bonds,
          exploring the potential for new forms of communal living and shared
          understanding. Through its speculative and transdisciplinary nature,
          *Intimate Commons* not only contributes to academic discussions around
          the dynamics of sharing, privacy, and community in the digital era but
          also offers tangible insights into the practice of commoning as a
          participatory, collective process that transcends traditional
          boundaries of personal and communal spaces.
        </p>
      </div>
      <div className="fixed flex items-center justify-center bottom-8 right-0 font-sans text-base font-extralight w-full"></div>
    </div>
  );
};
