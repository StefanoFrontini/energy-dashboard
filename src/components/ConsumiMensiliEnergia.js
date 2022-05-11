import {
  scaleTime,
  extent,
  scaleLinear,
  max,
  line,
  groups,
  scaleOrdinal,
  format,
  timeFormat,
  timeFormatDefaultLocale,
} from "d3";

import ColorLegend from "./ColorLegend";
import { useState } from "react";
import Tooltip from "./Tooltip";
import locale from "./locale";

timeFormatDefaultLocale(locale);

const xValue = (d) => d.month;
const yValue = (d) => d.kWh;
const colorValue = (d) => d.year;

const fadeOpacity = 0.1;

const formatNumber = format(",d");
const formatTime = timeFormat("%b");

const margin = { top: 40, right: 100, bottom: 80, left: 80 };

const ConsumiMensiliEnergia = ({ d3Data, svgWidth, svgHeight }) => {
  const [hoveredValue, setHoveredValue] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const innerWidth = svgWidth - margin.left - margin.right;
  const innerHeight = svgHeight - margin.top - margin.bottom;
  const xScale = scaleTime()
    .domain(extent(d3Data, xValue))
    .range([0, innerWidth]);

  const yScale = scaleLinear()
    .domain([0, max(d3Data, yValue)])
    .range([innerHeight, 0]);

  const lineGenerator = line()
    .x((d) => xScale(xValue(d)))
    .y((d) => yScale(yValue(d)));

  const groupData = groups(d3Data, (d) => d.year);

  const colorScale = scaleOrdinal()
    .domain(groupData.map((el) => el[0]))
    .range(["#e41a1c", "#377eb8", "#4daf4a"]);

  const filteredData = d3Data.filter((d) => hoveredValue === colorValue(d));

  // data rendered when user clicks on a legend item
  const sumstat = groups(filteredData, (d) => d.year);

  return (
    // the viewbox is necessary to make the charts responsive
    <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {yScale.ticks().map((tickValue, index) => {
          return (
            <g
              transform={`translate(-15,${yScale(tickValue)})`}
              key={index}
              className="tick"
            >
              <line x1={10} x2={innerWidth} stroke="black"></line>
              <text
                className="axis-label"
                textAnchor="end"
                alignmentBaseline="middle"
              >
                {formatNumber(tickValue)}
              </text>
            </g>
          );
        })}
        {xScale.ticks().map((tickValue, index) => {
          return (
            <text
              x={xScale(tickValue)}
              y={innerHeight + 24}
              alignmentBaseline="hanging"
              textAnchor="middle"
              key={index}
              className="axis-label"
            >
              {formatTime(tickValue)}
            </text>
          );
        })}

        <g opacity={hoveredValue ? fadeOpacity : 1}>
          {groupData.map((item) => {
            return (
              <g key={item[0]}>
                <path stroke={colorScale(item[0])} d={lineGenerator(item[1])} />
                {item[1].map((d, index) => {
                  return (
                    <g key={index}>
                      <circle
                        cx={xScale(xValue(d))}
                        cy={yScale(yValue(d))}
                        r={4}
                        fill={colorScale(item[0])}
                        onMouseEnter={() =>
                          setHoveredPoint([xValue(d), yValue(d), colorValue(d)])
                        }
                        onMouseOut={() => setHoveredPoint(null)}
                      ></circle>
                      <Tooltip
                        hoveredPoint={hoveredPoint}
                        xScale={xScale}
                        yScale={yScale}
                        colorScale={colorScale}
                        unit="kWh"
                      />
                    </g>
                  );
                })}
              </g>
            );
          })}
        </g>
        {sumstat.map((item) => {
          return (
            <g key={item[0]}>
              <path stroke={colorScale(item[0])} d={lineGenerator(item[1])} />
              {item[1].map((d, index) => {
                return (
                  <g key={index}>
                    <circle
                      cx={xScale(xValue(d))}
                      cy={yScale(yValue(d))}
                      r={4}
                      fill={colorScale(item[0])}
                    ></circle>
                  </g>
                );
              })}
            </g>
          );
        })}

        <g transform={`translate(${innerWidth + 20})`}>
          <ColorLegend
            colorScale={colorScale}
            tickSpacing={25}
            tickTextOffset={16}
            tickSize={8}
            onHover={setHoveredValue}
            hoveredValue={hoveredValue}
            fadeOpacity={fadeOpacity}
          />
        </g>
      </g>
    </svg>
  );
};

export default ConsumiMensiliEnergia;
