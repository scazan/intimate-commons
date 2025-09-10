import { Header2 } from "..";
import { AudioPlayer } from "../AudioPlayer";
import { Button } from "../base/ui/button";
import { ChoiceResults } from "./ChoiceResult";
import Link from "next/link";

export const Results = async ({ results }) => {
  const storyId = results.story.id;

  return (
    <div className="flex flex-col gap-12">
      <AudioPlayer
        src={`https://pub-58753b13db894b5ea3d9730f9a15a537.r2.dev/${storyId}.mp3`}
        usePlaylist={true}
        regeneratePlaylist={true}
      />
      <Header2>Results</Header2>
      <ChoiceResults choices={results.user} />

      <div className="flex items-center justify-between">
        <Header2>Global</Header2>
      </div>

      <ChoiceResults choices={results.global} global />
    </div>
  );
};
