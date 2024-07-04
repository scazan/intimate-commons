"use client";
import * as d3 from "d3";

import { useEffect, useRef } from "react";

export const ChoiceResults = ({ choices }) => {
  return (
    <div className="flex flex-col gap-12">
      {choices.map((choice) => (
        <ChoiceResult choice={choice} />
      ))}
    </div>
  );
};

export const ChoiceResult = ({ choice }) => {
  const chart1 = useRef();
  const data = [
    { label: "A", value: 30 },
    { label: "", value: 70 },
  ];

  useEffect(() => {
    const ref = chart1;
    const width = 18;
    const height = 18;
    const radius = Math.min(width, height) / 2;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const svg = d3
      .select(ref.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const pie = d3.pie().value((d) => d.value);

    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const arcs = svg
      .selectAll("arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => {
        console.log("D", i);
        return `rgba(242, 61, 124, ${i ? 0.27 : 1})`;
      });

    arcs
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .text((d) => d.data.label);
  }, [data]);

  return (
    <div className="flex flex-col gap-3">
      <div className="text-[2rem] font-extralight font-serif">
        I would share my{" "}
        <span className="font-sans font-extralight uppercase">
          {choice.obj.title}
        </span>{" "}
        in exchange for{" "}
        <span className="font-sans font-extralight uppercase">
          {choice.sub.title}
        </span>
      </div>
      <div id="charts" className="flex flex-row">
        <div>
          <svg ref={chart1}></svg>
        </div>
      </div>
    </div>
  );
};
