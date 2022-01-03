import {
  mean,
  rollups,
  scaleLinear,
  extent,
  line,
  format,
  timeFormat,
} from "d3";
import { useState } from "react";
const margin = { top: 40, right: 10, bottom: 20, left: 30 };

const fadeOpacity = 0.1;

const formatNumber = format(",d");
const formatTime = timeFormat("%B");

const yearValue = (d) => d.year;
const monthValue = (d) => d.month;
const giornoTipoValue = (d) => d.giornoTipo;
const hourValue = (d) => d.ora;
const kWhValue = (d) => d.kWh;

const ConsumiOrari = ({ svgWidth, svgHeight, d3DataOrari }) => {
  const svgWidthOrari = 300;
  const svgHeightOrari = 300;
  const innerWidth = svgWidthOrari - margin.left - margin.right;
  const innerHeight = svgHeightOrari - margin.top - margin.bottom;
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [hoveredValue, setHoveredValue] = useState(false);

  const rollupData = rollups(
    d3DataOrari,
    (v) => Math.round(mean(v, kWhValue)),
    monthValue,
    giornoTipoValue,
    hourValue
  );

  const orderedRollupData = rollupData.map((el) => {
    if (el[1][0][0] === "saturday") {
      let newArray = [];
      let newElement = [];
      newArray = [el[1][2], el[1][0], el[1][1]];
      newElement = [el[0], newArray];

      return newElement;
    } else if (el[1][0][0] === "sunday") {
      let newArray = [];
      let newElement = [];
      newArray = [el[1][2], el[1][1], el[1][0]];
      newElement = [el[0], newArray];
      return newElement;
    } else return el;
  });

  const xScale = scaleLinear()
    .domain(extent(d3DataOrari, hourValue))
    .range([0, innerWidth])
    .nice();
  const yScale = scaleLinear()
    .domain(extent(d3DataOrari, kWhValue))
    .range([innerHeight, 0])
    .nice();

  const lineGenerator = line()
    .x((d) => xScale(d[0]))
    .y((d) => yScale(d[1]));

  const filteredData = hoveredPoint
    ? d3DataOrari.filter((d) => d.ora === hoveredPoint[0])
    : d3DataOrari;

  const sumstat = rollups(
    filteredData,
    (v) => Math.round(mean(v, kWhValue)),
    monthValue,
    giornoTipoValue,
    hourValue
  );

  const orderedSumstat = sumstat.map((el) => {
    if (el[1][0][0] === "saturday") {
      let newArray = [];
      let newElement = [];
      newArray = [el[1][2], el[1][0], el[1][1]];
      newElement = [el[0], newArray];

      return newElement;
    } else if (el[1][0][0] === "sunday") {
      let newArray = [];
      let newElement = [];
      newArray = [el[1][2], el[1][1], el[1][0]];
      newElement = [el[0], newArray];
      return newElement;
    } else return el;
  });

  return (
    <>
      <div className="cocktails-center">
        {orderedRollupData.map((m, ind) => {
          return (
            <div key={ind} className="cocktail">
              {orderedRollupData[ind][1].map((item, indice) => {
                return (
                  <svg
                    width={svgWidthOrari}
                    height={svgHeightOrari}
                    key={indice}
                  >
                    <g
                      transform={`translate(${margin.left},${margin.top})`}
                      className="tick"
                    >
                      {xScale.ticks().map((tickValue, index) => {
                        return (
                          <g
                            transform={`translate(${xScale(
                              tickValue
                            )},${innerHeight})`}
                            key={index}
                            className="tick-text"
                          >
                            <text
                              textAnchor="middle"
                              alignmentBaseline="hanging"
                            >
                              {formatNumber(tickValue)}
                            </text>
                          </g>
                        );
                      })}
                      {yScale.ticks().map((tickValue, index) => {
                        return (
                          <g
                            transform={`translate(-10,${yScale(tickValue)})`}
                            key={index}
                            className="tick-text"
                          >
                            <line x1={10} x2={innerWidth} stroke="black"></line>
                            <text textAnchor="end" alignmentBaseline="middle">
                              {formatNumber(tickValue)}
                            </text>
                          </g>
                        );
                      })}
                      <path
                        opacity={hoveredValue ? fadeOpacity : 1}
                        stroke="black"
                        d={lineGenerator(item[1])}
                      />
                      {item[1].map((d, index) => {
                        return (
                          <g
                            key={index}
                            opacity={hoveredValue ? fadeOpacity : 1}
                          >
                            <circle
                              cx={xScale(d[0])}
                              cy={yScale(d[1])}
                              r={4}
                              fill="black"
                              onMouseEnter={() => {
                                setHoveredPoint([d[0], d[1]]);
                                setHoveredValue(true);
                              }}
                              onMouseOut={() => {
                                setHoveredPoint(null);
                                setHoveredValue(false);
                              }}
                            ></circle>
                            {/* <Tooltip
                        hoveredPoint={hoveredPoint}
                        xScale={xScale}
                        yScale={yScale}
                        colorScale={colorScale}
                        unit="kWh"
                      /> */}
                          </g>
                        );
                      })}

                      {/* <path d={lineGenerator(d3Data)} /> */}
                      <text
                        transform={`translate(${innerWidth / 2},-20)`}
                        textAnchor="middle"
                      >
                        {formatTime(rollupData[ind][0])}
                        {" - "}
                        {item[0]}
                      </text>

                      {orderedSumstat[ind] &&
                        hoveredPoint &&
                        orderedSumstat[ind][1][indice][1].map((x, i) => {
                          return (
                            <g key={i}>
                              <text
                                dx={xScale(x[0])}
                                dy={yScale(x[1]) - 10}
                                fill="black"
                                textAnchor="middle"
                                className="tooltip"
                              >
                                {x[1]} kWh
                              </text>
                              <text
                                dx={xScale(x[0])}
                                dy={yScale(x[1]) - 20}
                                fill="black"
                                textAnchor="middle"
                                className="tooltip"
                              >
                                ora {x[0]}
                              </text>
                              <circle
                                cx={xScale(x[0])}
                                cy={yScale(x[1])}
                                r={4}
                                onMouseEnter={() => {
                                  setHoveredPoint([x[0], x[1]]);
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
        })}
      </div>
    </>
  );
};

export default ConsumiOrari;
