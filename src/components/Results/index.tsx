import { Header2 } from "..";
import { AudioPlayer } from "../AudioPlayer";
import { ChoiceResults } from "./ChoiceResult";
import { ResultsViz } from "./ResultsViz";

export const Results = async ({ results }) => {
  const storyId = results.story.id;

  return (
    <div className="flex flex-col gap-12">
      <AudioPlayer
        src={`https://pub-58753b13db894b5ea3d9730f9a15a537.r2.dev/${storyId}.mp3`}
      />
      <ChoiceResults choices={results.user} />

      <Header2>Global</Header2>
      <ResultsViz data={results.global} />
      {results.global.map((choice) => (
        <div>
          {choice.count} people would share their {choice.obj.title} in exchange
          for {choice.sub.title}
        </div>
      ))}
    </div>
  );
};
