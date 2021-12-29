import { extent, scaleLinear, format, timeFormat, groups } from "d3";

import { useState } from "react";

const xValue = (d) => d.kWh;
const yValue = (d) => d.picco;
const yearValue = (d) => d.year;
const monthValue = (d) => d.month;

const margin = { top: 40, right: 100, bottom: 80, left: 80 };

const fadeOpacity = 0.1;

const formatNumber = format(",d");
const formatTime = timeFormat("%b");

const PiccoConsumi = ({ svgWidth, svgHeight, d3Data }) => {
  const innerWidth = svgWidth - margin.left - margin.right;
  const innerHeight = svgHeight - margin.top - margin.bottom;
  const [hoveredValue, setHoveredValue] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  console.log("hoveredPoint", hoveredPoint);
  console.log("d3Data", d3Data);
  const xScale = scaleLinear()
    .domain(extent(d3Data, xValue))
    .range([0, innerWidth]);
  const yScale = scaleLinear()
    .domain(extent(d3Data, yValue))
    .range([innerHeight, 0])
    .nice();

  const groupByYear = groups(d3Data, yearValue);
  const filteredData = hoveredPoint
    ? d3Data.filter((d) => formatTime(d.month) === formatTime(hoveredPoint[2]))
    : d3Data;
  const sumstat = groups(filteredData, yearValue);
  return (
    <>
      {groupByYear.map((item, i) => {
        return (
          <svg width={svgWidth} height={svgHeight} key={item[0]}>
            <g
              transform={`translate(${margin.left},${margin.top})`}
              className="tick"
            >
              {xScale.ticks().map((tickValue, index) => {
                return (
                  <g
                    transform={`translate(${xScale(tickValue)},${innerHeight})`}
                    key={index}
                  >
                    <text textAnchor="middle" alignmentBaseline="hanging">
                      {formatNumber(tickValue)}
                    </text>
                  </g>
                );
              })}
              {yScale.ticks().map((tickValue, index) => {
                return (
                  <g
                    transform={`translate(0,${yScale(tickValue)})`}
                    key={index}
                  >
                    <line x1={10} x2={innerWidth} stroke="black"></line>
                    <text textAnchor="end" alignmentBaseline="middle">
                      {formatNumber(tickValue)}
                    </text>
                  </g>
                );
              })}
              {groupByYear[i][1].map((d) => {
                return (
                  <g key={xValue(d)} opacity={hoveredValue ? fadeOpacity : 1}>
                    <circle
                      cx={xScale(xValue(d))}
                      cy={yScale(yValue(d))}
                      r={4}
                      onMouseEnter={() => {
                        setHoveredPoint([xValue(d), yValue(d), monthValue(d)]);
                        setHoveredValue(true);
                      }}
                      onMouseOut={() => {
                        setHoveredPoint(null);
                        setHoveredValue(false);
                      }}
                    ></circle>
                    <text dx={xScale(xValue(d)) + 5} dy={yScale(yValue(d))}>
                      {formatTime(monthValue(d))}
                    </text>

                    <text
                      transform={`translate(${innerWidth / 2},-20)`}
                      textAnchor="middle"
                    >
                      Picco vs Consumi - anno {item[0]}
                    </text>
                    <text
                      transform={`translate(-60,${
                        innerHeight / 2
                      }) rotate(-90)`}
                      textAnchor="middle"
                      className="axis-label"
                    >
                      Picco - kW
                    </text>
                    <text
                      transform={`translate(${innerWidth / 2},${
                        innerHeight + 40
                      })`}
                      textAnchor="middle"
                      alignmentBaseline="hanging"
                      className="axis-label"
                    >
                      Consumi mensili kWh
                    </text>
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
                        dy={yScale(yValue(d)) - 30}
                        fill="black"
                        textAnchor="middle"
                        className="tooltip"
                      >
                        {d.kWh} kWh
                      </text>
                      <text
                        dx={xScale(xValue(d))}
                        dy={yScale(yValue(d)) - 50}
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
    </>
  );
};

export default PiccoConsumi;
