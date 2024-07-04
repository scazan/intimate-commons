import { Header2 } from "..";
import { ChoiceResult, ChoiceResults } from "./ChoiceResult";
import { ResultsViz } from "./ResultsViz";

export const Results = async ({ results }) => {
  return (
    <div className="flex flex-col gap-12">
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
