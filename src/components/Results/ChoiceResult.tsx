"use client";
import { cn } from "@/lib/utils";
import * as d3 from "d3";

import { useEffect, useRef } from "react";

export const ChoiceResults = ({ choices, className = null, ...props }) => {
  return (
    <div className={cn("flex flex-col gap-12 max-w-2xl", className)}>
      {choices.map((choice) => (
        <ChoiceResult key={choice.id} choice={choice} {...props} />
      ))}
    </div>
  );
};

export const ChoiceResult = ({ choice, global = false }) => {
  const percentage = Math.floor(choice.percentage * 100);
  const wouldData = [{ value: percentage }, { value: 100 - percentage }];
  const wouldNotData = [{ value: 100 - percentage }, { value: percentage }];

  const isNever = !global && choice.obj.id === "never";

  let text;

  if (isNever) {
    text = !global ? (
      <div className="text-[2rem] font-extralight font-serif">
        I would{" "}
        <span className="font-sans font-extralight uppercase">
          {choice.obj.title}
        </span>{" "}
        share my{" "}
        <span className="font-sans font-extralight uppercase">
          {choice.sub.title}
        </span>
      </div>
    ) : (
      <div className="text-[2rem] font-extralight font-serif">
        Others that would{" "}
        <span className="font-sans font-extralight uppercase">
          {choice.obj.title}
        </span>{" "}
        share their{" "}
        <span className="font-sans font-extralight uppercase">
          {choice.sub.title}
        </span>
      </div>
    );
  } else {
    text = !global ? (
      <div className="text-[2rem] font-extralight font-serif">
        I would share my{" "}
        <span className="font-sans font-extralight uppercase">
          {choice.sub.title}
        </span>{" "}
        in exchange for{" "}
        <span className="font-sans font-extralight uppercase">
          {choice.obj.title}
        </span>
      </div>
    ) : (
      <div className="text-[2rem] font-extralight font-serif">
        Others that would share their{" "}
        <span className="font-sans font-extralight uppercase">
          {choice.sub.title}
        </span>{" "}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {text}

      <div id="charts" className="flex flex-row gap-12">
        <Chart data={wouldData} label="Would exchange" />
        <Chart data={wouldNotData} label="Would not exchange" color="blue" />
      </div>
    </div>
  );
};

const Chart = ({
  data,
  label,
  color,
}: {
  data: any;
  label: string;
  color?: "pink" | "blue";
}) => {
  const chartRef = useRef();

  useEffect(() => {
    const ref = chartRef;
    const width = 18;
    const height = 18;
    const radius = Math.min(width, height) / 2;

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
      .attr("fill", (_, i) => {
        const value =
          color === "blue"
            ? `hsla(198, 59%, 52%, ${i ? 0.27 : 1})`
            : `rgba(242, 61, 124, ${i ? 0.27 : 1})`;
        return value;
      });
  }, [data]);

  return (
    <div className="flex flex-col min-w-14 gap-2">
      <div className="flex flex-row items-center gap-2">
        <svg ref={chartRef}></svg>
        <span className="font-sans font-extralight text-[18px]">
          {data[0].value}%
        </span>
      </div>
      <div className="flex flex-row text-[0.625rem] font-extralight uppercase">
        {label}
      </div>
    </div>
  );
};
