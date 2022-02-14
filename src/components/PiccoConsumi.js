import {
  extent,
  scaleLinear,
  format,
  timeFormat,
  groups,
  scaleOrdinal,
  timeFormatDefaultLocale,
} from "d3";

import { useState } from "react";
import locale from "./locale";

timeFormatDefaultLocale(locale);

const xValue = (d) => d.kWh;
const yValue = (d) => d.picco;
const yearValue = (d) => d.year;
const monthValue = (d) => d.month;

const margin = { top: 50, right: 20, bottom: 10, left: 30 };

const fadeOpacity = 0.1;

const formatNumber = format(",d");
const formatTime = timeFormat("%b");

const PiccoConsumi = ({ svgWidth, svgHeight, d3Data }) => {
  const svgWidthPiccoConsumi = 250;
  const svgHeightPiccoConsumi = 250;
  const innerWidth = svgWidthPiccoConsumi - margin.left - margin.right;
  const innerHeight = svgHeightPiccoConsumi - margin.top - margin.bottom;
  const [hoveredValue, setHoveredValue] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const xScale = scaleLinear()
    .domain(extent(d3Data, xValue))
    .range([0, innerWidth]);
  const yScale = scaleLinear()
    .domain(extent(d3Data, yValue))
    .range([innerHeight, 0])
    .nice();

  const colorScale = scaleOrdinal()
    .domain(d3Data.map(yearValue))
    .range(["#e41a1c", "#377eb8", "#4daf4a"]);

  const groupByYear = groups(d3Data, yearValue);

  // console.log("groupByYear", groupByYear);

  const filteredData = hoveredPoint
    ? d3Data.filter((d) => formatTime(d.month) === formatTime(hoveredPoint[2]))
    : d3Data;
  const sumstat = groups(filteredData, yearValue);
  return (
    <div className="cocktail">
      {groupByYear.map((item, i) => {
        return (
          <svg
            width={svgWidthPiccoConsumi}
            height={svgHeightPiccoConsumi}
            key={item[0]}
          >
            <g
              transform={`translate(${margin.left},${margin.top})`}
              className="tick"
            >
              {xScale.ticks(4).map((tickValue, index) => {
                return (
                  <g
                    transform={`translate(${xScale(tickValue)},${innerHeight})`}
                    key={index}
                  >
                    <text
                      textAnchor="middle"
                      alignmentBaseline="hanging"
                      className="axis-label"
                    >
                      {formatNumber(tickValue)}
                    </text>
                  </g>
                );
              })}
              {yScale.ticks().map((tickValue, index) => {
                return (
                  <g
                    transform={`translate(-15,${yScale(tickValue)})`}
                    key={index}
                  >
                    <line x1={10} x2={innerWidth} stroke="black"></line>
                    <text
                      textAnchor="end"
                      alignmentBaseline="middle"
                      className="axis-label"
                    >
                      {formatNumber(tickValue)}
                    </text>
                  </g>
                );
              })}
              {item[1].map((d, s) => {
                return (
                  <g key={s} opacity={hoveredValue ? fadeOpacity : 1}>
                    <circle
                      cx={xScale(xValue(d))}
                      cy={yScale(yValue(d))}
                      r={4}
                      fill={colorScale(item[0])}
                      onMouseEnter={() => {
                        setHoveredPoint([xValue(d), yValue(d), monthValue(d)]);
                        setHoveredValue(true);
                      }}
                      onMouseOut={() => {
                        setHoveredPoint(null);
                        setHoveredValue(false);
                      }}
                    ></circle>
                    <text
                      dx={xScale(xValue(d)) + 5}
                      dy={yScale(yValue(d))}
                      className="axis-label"
                    >
                      {formatTime(monthValue(d))}
                    </text>

                    <text
                      transform={`translate(${innerWidth / 2},-20)`}
                      textAnchor="middle"
                    >
                      {item[0]}
                    </text>
                    {/* <text
                      transform={`translate(-60,${
                        innerHeight / 2
                      }) rotate(-90)`}
                      textAnchor="middle"
                      className="axis-label"
                    >
                      Picco - kW
                    </text> */}
                    {/* <text
                      transform={`translate(${innerWidth / 2},${
                        innerHeight + 40
                      })`}
                      textAnchor="middle"
                      alignmentBaseline="hanging"
                      className="axis-label"
                    >
                      Consumi mensili kWh
                    </text> */}
                  </g>
                );
              })}
              {sumstat[i] &&
                hoveredPoint &&
                sumstat[i][1].map((d, ind) => {
                  return (
                    <g key={ind}>
                      <text
                        dx={xScale(xValue(d))}
                        dy={yScale(yValue(d)) - 10}
                        fill="black"
                        textAnchor="middle"
                        className="tooltip"
                      >
                        {d.picco} kW
                      </text>
                      <text
                        dx={xScale(xValue(d))}
                        dy={yScale(yValue(d)) - 20}
                        fill="black"
                        textAnchor="middle"
                        className="tooltip"
                      >
                        {d.kWh} kWh
                      </text>
                      <text
                        dx={xScale(xValue(d))}
                        dy={yScale(yValue(d)) - 30}
                        fill="black"
                        textAnchor="middle"
                        className="tooltip"
                      >
                        {formatTime(monthValue(d))}
                      </text>
                      <circle
                        cx={xScale(xValue(d))}
                        cy={yScale(yValue(d))}
                        r={4}
                        onMouseEnter={() => {
                          setHoveredPoint([
                            xValue(d),
                            yValue(d),
                            monthValue(d),
                          ]);
                          setHoveredValue(true);
                        }}
                        onMouseOut={() => {
                          setHoveredPoint(null);
                          setHoveredValue(false);
                        }}
                      ></circle>
                    </g>
                  );
                })}
            </g>
          </svg>
        );
      })}
    </div>
  );
};

export default PiccoConsumi;
