import { Header2 } from "@/components";
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

        <Header2>Credits</Header2>
        <p>
          Raphael Arar works at the nexus of complex systems, transdisciplinary
          design, and arts-based research. He currently leads Alternatives at
          One Project, an operating non-profit and foundation working to design,
          implement, and scale new equitable, ecological, and effective forms of
          economics and governance. He also serves as a Board Member at
          Leonardo, the International Society for the Arts, Sciences, and
          Technology. Previously, he led design for learners at Khan Academy,
          tackled ethical platforms of AI at IBM Research, taught media theory
          at the USC School of Cinematic Arts, and designed over a hundred iOS
          apps with Apple. His artwork has been shown at museums, conferences,
          festivals, and galleries internationally including the ZKM | Center
          for Art and Media, Moscow Museum of Applied Art, SLAC National
          Accelerator Laboratory, International Symposium on Electronic Art
          (ISEA), Gamble House Museum, ACM CHI Conference on Human Factors in
          Computing Systems, Science Gallery, Boston Cyberarts Gallery, and
          Athens Video Art Festival. Notable commissions include Noema Magazine,
          Goethe Institut, Gray Area Foundation for the Arts, Intel Labs, and
          IBM Research. His design work has been featured in publications
          including Forbes, Inc. Magazine, FastCompany, Wired, and others.
        </p>
        <p>
          SCOTT CAZAN Scott Cazan is a Stockholm-based creative coder, sound
          artists, performer, and composer from Los Angeles working in fields
          such as experimental electronic music, sound installation, chamber
          music, and software art, where he explores cybernetics, aesthetic
          computing, and emergent forms resulting from human interactions with
          technology. Scott has performed and received numerous commissions with
          international organizations such as The LA County Museum of Art, MOCA
          (Los Angeles), Issue Project Room (NY), Feldstarke International (with
          CENTQUATRE, PACT Zollverein, and Calarts), Ausland (Berlin), Art
          Cologne, Ensemble Zwischentöne, The University of Art in Berlin,
          Toomai String Quintet, Southern Exposure (San Francisco),
          Guapamacátaro (MX), Umbral (MX), the Media Mix Festival (Monterrey),
          the BEAM Festival (UK), REDCAT (Los Angeles), Machine Project and many
          others. As an active educator, he has taught at institutions such as
          the University of California, Santa Barbara, Art Center College of
          Design, the California Institute of the Arts, and Universität der
          Künste Berlin, where he has taught on the intersection between art and
          computation. He is also an active Software Developer working for
          various music and art-related organizations. His music can be heard on
          A Wave Press, CareOf Editions, Edition Wandelweiser, and Superpang.
        </p>
      </div>
      <div className="fixed flex items-center justify-center bottom-8 right-0 font-sans text-base font-extralight w-full"></div>
    </div>
  );
};
