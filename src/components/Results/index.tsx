"use client";

export const Results = async ({ userId }) => {
  const results = await fetch(`/api/v1/results/${userId}`, {
    method: "GET",
  });

  return <div>{JSON.stringify(results)}</div>;
};
