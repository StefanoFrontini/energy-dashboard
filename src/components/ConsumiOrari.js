import {
  mean,
  rollups,
  scaleLinear,
  extent,
  line,
  format,
  timeFormat,
  scaleOrdinal,
  timeFormatDefaultLocale,
} from "d3";
import { useState } from "react";
import locale from "./locale";
import ColorLegendOrari from "./ColorLegendOrari";

timeFormatDefaultLocale(locale);

const margin = { top: 50, right: 10, bottom: 20, left: 30 };

const fadeOpacity = 0.1;

const formatNumber = format(",d");
const formatTime = timeFormat("%B");
const formatGiornoTipo = (g) => {
  if (g === "saturday") return "sabato";
  else if (g === "sunday") return "domenica";
  else return g;
};

const yearValue = (d) => d.year;
const monthValue = (d) => d.month;
const giornoTipoValue = (d) => d.giornoTipo;
const hourValue = (d) => d.ora;
const kWhValue = (d) => d.kWh;

const ConsumiOrari = ({ svgWidth, svgHeight, d3DataOrari }) => {
  const svgWidthOrari = 250;
  const svgHeightOrari = 250;
  const innerWidth = svgWidthOrari - margin.left - margin.right;
  const innerHeight = svgHeightOrari - margin.top - margin.bottom;
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [hoveredValue, setHoveredValue] = useState(false);

  const rollupData = rollups(
    d3DataOrari,
    (v) => Math.round(mean(v, kWhValue)),
    yearValue,
    monthValue,
    giornoTipoValue,
    hourValue
  );

  const orderedRollupData = rollupData.map((year) => {
    let newArr = year[1].map((el) => {
      if (el[1][0][0] === "saturday") {
        let newArray = [];
        let newElement = [];
        newArray = [el[1][2], el[1][0], el[1][1]];
        newElement = [el[0], newArray];
        return newElement;
      } else if (el[1][0][0] === "sunday") {
        let newArray = [];
        let newElement = [];
        newArray = [el[1][1], el[1][2], el[1][0]];
        newElement = [el[0], newArray];
        return newElement;
      } else return el;
    });

    return [year[0], newArr];
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

  const colorScale = scaleOrdinal()
    .domain(["2019", "2020", "2021"])
    // .domain(d3DataOrari.map(yearValue))
    .range(["#e41a1c", "#377eb8", "#4daf4a"]);

  const filteredData = hoveredPoint
    ? d3DataOrari.filter((d) => d.ora === hoveredPoint[0])
    : d3DataOrari;

  const sumstat = rollups(
    filteredData,
    (v) => Math.round(mean(v, kWhValue)),
    yearValue,
    monthValue,
    giornoTipoValue,
    hourValue
  );

  const orderedSumstat = sumstat.map((year) => {
    let newArr = year[1].map((el) => {
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
    return [year[0], newArr];
  });

  let z = 0;

  const findIndexYear = (mese, annoIndex) => {
    return orderedRollupData[annoIndex][1].findIndex(
      (m) => formatTime(m[0]) === mese
    );
  };

  return (
    <>
      {orderedRollupData.map((year, k) => {
        return year[1].map((month, ind) => {
          z = z + 1;
          return (
            z < 13 &&
            (((z === 5) | (z === 9) && (
              <div key={ind}>
                <div id="pageFooter"></div>
                <div className="page-break"></div>
                <div className="cocktail">
                  {month[1].map((giornoTipo, j) => {
                    return (
                      <svg
                        width={svgWidthOrari}
                        height={svgHeightOrari}
                        key={j}
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
                                transform={`translate(-10,${yScale(
                                  tickValue
                                )})`}
                                key={index}
                                className="tick-text"
                              >
                                <line
                                  x1={10}
                                  x2={innerWidth}
                                  stroke="black"
                                ></line>
                                <text
                                  textAnchor="end"
                                  alignmentBaseline="middle"
                                >
                                  {formatNumber(tickValue)}
                                </text>
                              </g>
                            );
                          })}
                          {orderedRollupData.map((anno, a) => {
                            return (
                              anno[1][
                                findIndexYear(formatTime(month[0]), a)
                              ] && (
                                <path
                                  key={a}
                                  stroke={colorScale(anno[0])}
                                  d={lineGenerator(
                                    anno[1][
                                      findIndexYear(formatTime(month[0]), a)
                                    ][1][j][1]
                                  )}
                                />
                              )
                            );
                          })}

                          {/* {orderedRollupData.map((anno, a) => {
                            return (
                              anno[1][ind] && (
                                <path
                                  key={a}
                                  stroke={colorScale(anno[0])}
                                  d={lineGenerator(anno[1][ind][1][j][1])}
                                />
                              )
                            );
                          })} */}

                          {/* <path
                        opacity={hoveredValue ? fadeOpacity : 1}
                        stroke="black"
                        d={lineGenerator(giornoTipo[1])}
                      />
                      {giornoTipo[1].map((d, index) => {
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
                          </g>
                        );
                      })} */}

                          <text
                            transform={`translate(${innerWidth / 2},-30)`}
                            textAnchor="middle"
                          >
                            {formatTime(month[0])}
                            {" - "}
                            {formatGiornoTipo(giornoTipo[0])}
                          </text>

                          <g transform={`translate(50,-15)`}>
                            <ColorLegendOrari
                              colorScale={colorScale}
                              tickSpacing={45}
                              tickTextOffset={8}
                              tickSize={4}
                            />
                          </g>

                          {/* {orderedSumstat[ind] &&
                        hoveredPoint &&
                        orderedSumstat[ind][1][j][1].map((x, i) => {
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
                        })} */}
                        </g>
                      </svg>
                    );
                  })}
                </div>
              </div>
            )) || (
              <div key={ind} className="cocktail">
                {month[1].map((giornoTipo, j) => {
                  return (
                    <svg width={svgWidthOrari} height={svgHeightOrari} key={j}>
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
                              <line
                                x1={10}
                                x2={innerWidth}
                                stroke="black"
                              ></line>
                              <text textAnchor="end" alignmentBaseline="middle">
                                {formatNumber(tickValue)}
                              </text>
                            </g>
                          );
                        })}

                        {orderedRollupData.map((anno, a) => {
                          return (
                            anno[1][findIndexYear(formatTime(month[0]), a)] && (
                              <path
                                key={a}
                                stroke={colorScale(anno[0])}
                                d={lineGenerator(
                                  anno[1][
                                    findIndexYear(formatTime(month[0]), a)
                                  ][1][j][1]
                                )}
                              />
                            )
                          );
                        })}

                        {/* <path
                        opacity={hoveredValue ? fadeOpacity : 1}
                        stroke="black"
                        d={lineGenerator(giornoTipo[1])}
                      />
                      {giornoTipo[1].map((d, index) => {
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
                          </g>
                        );
                      })} */}

                        <text
                          transform={`translate(${innerWidth / 2},-30)`}
                          textAnchor="middle"
                        >
                          {formatTime(month[0])}
                          {" - "}
                          {formatGiornoTipo(giornoTipo[0])}
                        </text>

                        <g transform={`translate(50,-15)`}>
                          <ColorLegendOrari
                            colorScale={colorScale}
                            tickSpacing={45}
                            tickTextOffset={8}
                            tickSize={4}
                          />
                        </g>

                        {/* {orderedSumstat[ind] &&
                        hoveredPoint &&
                        orderedSumstat[ind][1][j][1].map((x, i) => {
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
                        })} */}
                      </g>
                    </svg>
                  );
                })}
              </div>
            ))
          );
        });
      })}
    </>
  );
};

export default ConsumiOrari;
