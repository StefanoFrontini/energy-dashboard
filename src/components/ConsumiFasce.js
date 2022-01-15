import {
  scaleBand,
  scaleLinear,
  max,
  groups,
  timeFormat,
  format,
  scaleOrdinal,
  timeFormatDefaultLocale,
} from "d3";

import ColorLegend from "./ColorLegend";

import { useState } from "react";

timeFormatDefaultLocale({
  dateTime: "%A %e %B %Y, %X",
  date: "%d/%m/%Y",
  time: "%H:%M:%S",
  periods: ["AM", "PM"],
  days: [
    "Domenica",
    "Lunedì",
    "Martedì",
    "Mercoledì",
    "Giovedì",
    "Venerdì",
    "Sabato",
  ],
  shortDays: ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"],
  months: [
    "Gennaio",
    "Febbraio",
    "Marzo",
    "Aprile",
    "Maggio",
    "Giugno",
    "Luglio",
    "Agosto",
    "Settembre",
    "Ottobre",
    "Novembre",
    "Dicembre",
  ],
  shortMonths: [
    "Gen",
    "Feb",
    "Mar",
    "Apr",
    "Mag",
    "Giu",
    "Lug",
    "Ago",
    "Set",
    "Ott",
    "Nov",
    "Dic",
  ],
});

const formatTime = timeFormat("%b");

const formatNumber = format(",d");

const fadeOpacity = 0.1;

const xValue = (d) => d.month;
const yearValue = (d) => d.year;
const F1Value = (d) => d.F1;
const F2Value = (d) => d.F2;
const F3Value = (d) => d.F3;

const margin = { top: 40, right: 100, bottom: 80, left: 80 };

const ConsumiFasce = ({ d3Data, svgWidth, svgHeight }) => {
  const [hoveredValue, setHoveredValue] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState([]);
  const svgWidthFasce = 870;
  const svgHeightFasce = 220;

  const innerWidth = svgWidthFasce - margin.left - margin.right;
  const innerHeight = svgHeightFasce - margin.top - margin.bottom;

  const xScale = scaleBand()
    .domain(d3Data.map(xValue).sort((a, b) => a - b))
    .range([0, innerWidth])
    .padding(0.5);

  const maxF1 = max(d3Data, F1Value);
  const maxF2 = max(d3Data, F2Value);
  const maxF3 = max(d3Data, F3Value);

  const maxValue = Math.max(maxF1, maxF2, maxF3);

  const yScale = scaleLinear().domain([0, maxValue]).range([innerHeight, 0]);

  const groupByYear = groups(d3Data, yearValue);

  const subgroups = ["F1", "F2", "F3"];

  const xSubgroup = scaleBand()
    .domain(subgroups)
    .range([0, xScale.bandwidth()]);

  const colorScale = scaleOrdinal()
    .domain(subgroups)
    .range(["#e41a1c", "#9e9820", "#4daf4a"]);

  const filteredData = d3Data.filter(
    (d) => formatTime(d.month) === formatTime(hoveredPoint[0])
  );

  const sumstat = groups(filteredData, yearValue);

  return (
    <>
      {groupByYear.map((item, i) => {
        return (
          <svg width={svgWidthFasce} height={svgHeightFasce} key={item[0]}>
            <g
              transform={`translate(${margin.left},${margin.top})`}
              className="tick"
            >
              {yScale.ticks().map((tickValue, index) => {
                return (
                  <g
                    transform={`translate(0,${yScale(tickValue)})`}
                    key={index}
                  >
                    <line x1={10} x2={innerWidth} stroke="black"></line>
                    <text
                      textAnchor="end"
                      className="axis-label"
                      alignmentBaseline="middle"
                    >
                      {formatNumber(tickValue)}
                    </text>
                  </g>
                );
              })}
              {xScale.domain().map((tickValue, index) => {
                return (
                  <text
                    key={index}
                    x={xScale(tickValue) + xScale.bandwidth() / 2}
                    y={innerHeight + 4}
                    alignmentBaseline="hanging"
                    textAnchor="middle"
                    className="axis-label"
                  >
                    {formatTime(tickValue)}
                  </text>
                );
              })}
              {item[1].map((d) => {
                return (
                  <g key={xValue(d)}>
                    <rect
                      x={xScale(xValue(d))}
                      y={yScale(F1Value(d))}
                      width={xSubgroup.bandwidth()}
                      height={innerHeight - yScale(F1Value(d))}
                      fill={colorScale("F1")}
                      opacity={hoveredValue ? fadeOpacity : 1}
                    />
                    <rect
                      x={xScale(xValue(d)) + xSubgroup.bandwidth() + 2}
                      y={yScale(F2Value(d))}
                      width={xSubgroup.bandwidth()}
                      height={innerHeight - yScale(F2Value(d))}
                      fill={colorScale("F2")}
                      opacity={hoveredValue ? fadeOpacity : 1}
                    />
                    <rect
                      x={xScale(xValue(d)) + 2 * (xSubgroup.bandwidth() + 2)}
                      y={yScale(F3Value(d))}
                      width={xSubgroup.bandwidth()}
                      height={innerHeight - yScale(F3Value(d))}
                      fill={colorScale("F3")}
                      opacity={hoveredValue ? fadeOpacity : 1}
                    />
                    <rect
                      x={xScale(xValue(d))}
                      y={yScale(F1Value(d))}
                      width={xSubgroup.bandwidth()}
                      height={innerHeight - yScale(F1Value(d))}
                      fill={colorScale("F1")}
                      opacity={hoveredValue === "F1" ? 1 : fadeOpacity}
                      onMouseEnter={() =>
                        setHoveredPoint([
                          xValue(d),
                          F1Value(d),
                          colorScale("F1"),
                          "F1",
                        ])
                      }
                      onMouseOut={() => setHoveredPoint([])}
                    />

                    <rect
                      x={xScale(xValue(d)) + xSubgroup.bandwidth() + 2}
                      y={yScale(F2Value(d))}
                      width={xSubgroup.bandwidth()}
                      height={innerHeight - yScale(F2Value(d))}
                      fill={colorScale("F2")}
                      opacity={hoveredValue === "F2" ? 1 : fadeOpacity}
                      onMouseEnter={() =>
                        setHoveredPoint([
                          xValue(d),
                          F2Value(d),
                          colorScale("F2"),
                          "F2",
                        ])
                      }
                      onMouseOut={() => setHoveredPoint([])}
                    />
                    <rect
                      x={xScale(xValue(d)) + 2 * (xSubgroup.bandwidth() + 2)}
                      y={yScale(F3Value(d))}
                      width={xSubgroup.bandwidth()}
                      height={innerHeight - yScale(F3Value(d))}
                      fill={colorScale("F3")}
                      opacity={hoveredValue === "F3" ? 1 : fadeOpacity}
                      onMouseEnter={() =>
                        setHoveredPoint([
                          xValue(d),
                          F3Value(d),
                          colorScale("F3"),
                          "F3",
                        ])
                      }
                      onMouseOut={() => setHoveredPoint([])}
                    />
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
                      kWh
                    </text> */}
                    {/* <text
                      transform={`translate(${innerWidth / 2},${
                        innerHeight + 40
                      })`}
                      textAnchor="middle"
                      alignmentBaseline="hanging"
                      className="axis-label"
                    >
                      Time
                    </text> */}
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
                );
              })}

              {sumstat[i] &&
                sumstat[i][1].map((element, ind) => {
                  return (
                    <g key={ind}>
                      {hoveredPoint[3] === "F1" && (
                        <text
                          dx={xScale(element.month)}
                          dy={yScale(element.F1) - 10}
                          fill={hoveredPoint[2]}
                          textAnchor="middle"
                          className="tooltip"
                        >
                          {element.F1}
                        </text>
                      )}
                      {hoveredPoint[3] === "F2" && (
                        <text
                          dx={xScale(element.month) + xSubgroup.bandwidth() + 2}
                          dy={yScale(element.F2) - 10}
                          fill={hoveredPoint[2]}
                          textAnchor="middle"
                          className="tooltip"
                        >
                          {element.F2}
                        </text>
                      )}
                      {hoveredPoint[3] === "F3" && (
                        <text
                          dx={
                            xScale(element.month) +
                            2 * (xSubgroup.bandwidth() + 2)
                          }
                          dy={yScale(element.F3) - 10}
                          fill={hoveredPoint[2]}
                          textAnchor="middle"
                          className="tooltip"
                        >
                          {element.F3}
                        </text>
                      )}
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

export default ConsumiFasce;
