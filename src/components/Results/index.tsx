import { Header2 } from "..";

export const Results = async ({ results }) => {
  return (
    <div>
      {results.user.map((choice) => (
        <div>
          I would share my {choice.obj.title} in exchange for {choice.sub.title}
        </div>
      ))}

      <Header2>Global</Header2>
      {results.global.map((choice) => (
        <div>
          {choice.count} people would share their {choice.obj.title} in exchange
          for {choice.sub.title}
        </div>
      ))}
    </div>
  );
};
