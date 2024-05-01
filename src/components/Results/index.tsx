"use client";

export const Results = async ({ userId }) => {
  const results = await fetch(`/api/v1/results/${userId}`, {
    method: "GET",
  });

  const data = await results.json();
  console.log("DATA", data);

  return <div>{JSON.stringify(data)}</div>;
};
