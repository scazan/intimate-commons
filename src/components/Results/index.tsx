"use client";

import { ResultsData } from "@/app/api/v1/results/[userId]/route";

export const Results = async ({ userId }) => {
  const results = await fetch(`/api/v1/results/${userId}`, {
    method: "GET",
  });

  const data: ResultsData = await results.json();
  console.log("DATA", data);

  return (
    <div>
      {data.map((choice) => (
        <div>
          I would share my {choice.obj.title} in exchange for {choice.sub.title}
        </div>
      ))}
    </div>
  );
};
