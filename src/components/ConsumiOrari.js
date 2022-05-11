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

import ColorLegendOrari from "./ColorLegendOrari";
import locale from "./locale";

timeFormatDefaultLocale(locale);

const margin = { top: 50, right: 10, bottom: 20, left: 30 };

const formatNumber = format(",d");
const formatTime = timeFormat("%B");
const formatGiornoTipo = (g) => {
  if (g === "saturday") return "saturday";
  else if (g === "sunday") return "sunday";
  else if (g === "lavorativo") return "weekday";
  else return g;
};

const yearValue = (d) => d.year;
const monthValue = (d) => d.month;
const giornoTipoValue = (d) => d.giornoTipo;
const hourValue = (d) => d.ora;
const kWhValue = (d) => d.kWh;

const ConsumiOrari = ({ d3DataOrari }) => {
  const svgWidthOrari = 250;
  const svgHeightOrari = 250;
  const innerWidth = svgWidthOrari - margin.left - margin.right;
  const innerHeight = svgHeightOrari - margin.top - margin.bottom;

  const rollupData = rollups(
    d3DataOrari,
    (v) => Math.round(mean(v, kWhValue)),
    yearValue,
    monthValue,
    giornoTipoValue,
    hourValue
  );

  // In order for the data to be rendered properly, the groups must follow this order: lavorativo, saturday, sunday. If the month starts with a saturday for instance, d3.rollups generate 3 groups in this order: saturday, sunday, lavorativo.
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
    .domain(rollupData.map((el) => el[0]))
    .range(["#e41a1c", "#377eb8", "#4daf4a"]);

  let z = 0;

  const findIndexYear = (mese, annoIndex) => {
    return orderedRollupData[annoIndex][1].findIndex(
      (m) => formatTime(m[0]) === mese
    );
  };

  return (
    <>
      {orderedRollupData.map((year) => {
        return year[1].map((month, ind) => {
          z = z + 1;
          return (
            // Charts should be at most 12 (January to December). The variable z takes care of that. For the charts to be printed in PDF nicely, it is necessary to put a page break div when z is equal to 5 or 12.
            z < 13 &&
            (((z === 5) | (z === 9) && (
              <div key={ind}>
                <div id="pageFooter"></div>
                <div className="page-break"></div>
                <div className="month-charts">
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
                        </g>
                      </svg>
                    );
                  })}
                </div>
              </div>
            )) || (
              <div key={ind} className="month-charts">
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
