"use client";
import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import { VoteStatsPanel } from "./VoteStatsPanel";

type ChoiceCount = { count: number; sub: { title: string } };

const colors = [
  "hsla(198, 59%, 52%, 1)",
  "hsla(162, 44%, 49%, 1)",
  "hsla(331, 90%, 51%, 1)",
  "hsla(306, 45%, 48%, 1)",
  "hsla(216, 45%, 48%, 1)",
];
let colorIndex = 0;

const getCirclePackedData = (
  data: {
    name: string;
    children: ChoiceCount[];
  },
  onCircleClick: (choice: ChoiceCount) => void,
) => {
  // Specify the chart’s dimensions.
  const width = window.innerWidth;
  const height = width;

  // Create the color scale.
  const color = d3
    .scaleLinear()
    .domain([0, 5])
    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
    .interpolate(d3.interpolateHcl);

  // Compute the layout.
  const pack = (data) =>
    d3.pack().size([width, height]).padding(3)(
      d3
        .hierarchy(data)
        .sum((d) => d.count)
        .sort((a, b) => b.count - a.count),
    );
  const root = pack(data);

  // Create the SVG container.
  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
    .attr("width", width)
    .attr("height", height)
    .attr(
      "style",
      `max-width: 100%; height: auto; display: block; margin: 0 -14px; background: transparent; cursor: pointer;`,
    );

  // Append the nodes.
  const node = svg
    .append("g")
    .selectAll("circle")
    .data(root.descendants().slice(1))
    .join("circle")
    .style("box-shadow", "0px 0px 48px 0px hsla(198, 74%, 63%, 0.24)")
    .attr("fill", (d) =>
      d.children ? color(d.depth) : colors[colorIndex++ % colors.length],
    )
    .attr("pointer-events", "auto")
    .on("mouseover", function () {
      d3.select(this).attr("stroke", "#000");
    })
    .on("mouseout", function () {
      d3.select(this).attr("stroke", null);
    })
    .on(
      "click",
      (event, d) => {
        // If this is a leaf node (actual choice), trigger the side panel
        if (!d.children && d.data.sub) {
          console.log("Clicked on choice:", d.data);
          onCircleClick(d.data);
          event.stopPropagation();
        } else if (focus !== d) {
          // Only zoom if it's not a leaf node
          zoom(event, d);
          event.stopPropagation();
        }
      },
    );

  // Append the text labels.
  const label = svg
    .append("g")
    .style("font-size", "0.75rem")
    .style("font-weight", "200")
    .attr("pointer-events", "none")
    .attr("text-anchor", "middle")
    .selectAll("text")
    .data(root.descendants())
    .join("text")
    .style("fill-opacity", (d) => (d.parent === root ? 1 : 0))
    .style("fill", "white")
    .style("text-transform", "uppercase")
    .style("display", (d) => (d.parent === root ? "inline" : "none"))
    .text((d) => d.data.sub?.title);

  const subLabel = svg
    .append("g")
    .style("font-size", "0.5rem")
    .style("font-weight", "200")
    .attr("pointer-events", "none")
    .attr("text-anchor", "middle")
    .selectAll("text")
    .data(root.descendants())
    .join("text")
    .style("fill-opacity", (d) => (d.parent === root ? 1 : 0))
    .style("fill", "white")
    .style("text-transform", "uppercase")
    .style("display", (d) => (d.parent === root ? "inline" : "none"))
    .text((d) =>
      d.data.count > 1 ? `${d.data.count} people` : `${d.data.count} person`,
    );

  // Create the zoom behavior and zoom immediately in to the initial focus node.
  svg.on("click", (event) => zoom(event, root));
  let focus = root;
  let view;
  zoomTo([focus.x, focus.y, focus.r * 2]);

  function zoomTo(v) {
    const k = width / v[2];

    view = v;

    label.attr(
      "transform",
      (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`,
    );
    subLabel.attr(
      "transform",
      (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k + 15})`,
    );
    node.attr(
      "transform",
      (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`,
    );
    node.attr("r", (d) => d.r * k);
  }

  function zoom(event, d) {
    const focus0 = focus;

    focus = d;

    const transition = svg
      .transition()
      .duration(event.altKey ? 7500 : 750)
      .tween("zoom", (d) => {
        const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
        return (t) => zoomTo(i(t));
      });

    label
      .filter(function (d) {
        return d.parent === focus || this.style.display === "inline";
      })
      .transition(transition)
      .style("fill-opacity", (d) => (d.parent === focus ? 1 : 0))
      .on("start", function (d) {
        if (d.parent === focus) this.style.display = "inline";
      })
      .on("end", function (d) {
        if (d.parent !== focus) this.style.display = "none";
      });
  }

  return svg.node();
};

export const ResultsViz = ({
  data,
  className,
}: {
  data: ChoiceCount[];
  className?: string;
}) => {
  const [selectedChoice, setSelectedChoice] = useState<ChoiceCount | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const totalVotes = data.reduce((sum, choice) => sum + choice.count, 0);

  const handleCircleClick = (choice: ChoiceCount) => {
    setSelectedChoice(choice);
    setIsPanelOpen(true);
  };

  const handlePanelClose = () => {
    setIsPanelOpen(false);
  };

  useEffect(() => {
    d3.select("#chart").select("svg").remove();

    // append the svg object to the body of the page
    getCirclePackedData(
      {
        name: "global",
        children: data,
      },
      handleCircleClick,
    );
  }, [data]);

  return (
    <>
      <div id="chart" className={className}></div>
      <VoteStatsPanel
        isOpen={isPanelOpen}
        onClose={handlePanelClose}
        selectedChoice={selectedChoice}
        totalVotes={totalVotes}
      />
    </>
  );
};
