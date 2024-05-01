"use client";

import { ResultsData } from "@/app/api/v1/results/[userId]/route";
import { Header2 } from "..";

export const Results = async ({ userId }) => {
  const results = await fetch(`/api/v1/results/${userId}`, {
    method: "GET",
  });

  const data: ResultsData = await results.json();

  return (
    <div>
      {data.user.map((choice) => (
        <div>
          I would share my {choice.obj.title} in exchange for {choice.sub.title}
        </div>
      ))}

      <Header2>Global</Header2>
      {data.global.map((choice) => (
        <div>
          {choice.count} people would share their {choice.obj.title} in exchange
          for {choice.sub.title}
        </div>
      ))}
    </div>
  );
};
