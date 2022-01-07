import {
  scaleTime,
  extent,
  scaleLinear,
  max,
  line,
  format,
  timeFormat,
  scaleOrdinal,
  groups,
} from "d3";
import { useState } from "react";
import Tooltip from "./Tooltip";
import ColorLegend from "./ColorLegend";

const xValue = (d) => d.month;
const yValue = (d) => d.picco;
const piccoValue = (d) => d.potenzaDisponibile;
const colorValue = (d) => d.year;

const fadeOpacity = 0.1;

const margin = { top: 40, right: 100, bottom: 80, left: 80 };

const formatNumber = format(",d");
const formatTime = timeFormat("%b");

const Picco = ({ svgWidth, svgHeight, d3Data }) => {
  const [hoveredValue, setHoveredValue] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const innerWidth = svgWidth - margin.left - margin.right;
  const innerHeight = svgHeight - margin.top - margin.bottom;

  const maxY = max(d3Data, yValue);
  const maxPicco = max(d3Data, piccoValue);

  const maxValue = Math.max(maxY, maxPicco);
  const xScale = scaleTime()
    .domain(extent(d3Data, xValue))
    .range([0, innerWidth]);
  const yScale = scaleLinear().domain([0, maxValue]).range([innerHeight, 0]);
  const lineGenerator = line()
    .x((d) => xScale(xValue(d)))
    .y((d) => yScale(yValue(d)));
  const piccoLineGenerator = line()
    .x((d) => xScale(xValue(d)))
    .y((d) => yScale(piccoValue(d)));

  const colorScale = scaleOrdinal()
    .domain(d3Data.map(colorValue))
    .range(["#e41a1c", "#377eb8", "#4daf4a"]);

  const filteredData = d3Data.filter((d) => hoveredValue === colorValue(d));

  const groupData = groups(d3Data, (d) => d.year);

  const sumstat = groups(filteredData, (d) => d.year);
  return (
    <>
      <svg width={svgWidth} height={svgHeight}>
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
                  textAnchor="end"
                  className="axis-label"
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
          <path stroke="black" d={piccoLineGenerator(d3Data)} />

          <g opacity={hoveredValue ? fadeOpacity : 1}>
            {groupData.map((item) => {
              return (
                <g key={item[0]}>
                  <path
                    stroke={colorScale(item[0])}
                    d={lineGenerator(item[1])}
                  />
                  {item[1].map((d, index) => {
                    return (
                      <g key={index}>
                        <circle
                          cx={xScale(xValue(d))}
                          cy={yScale(yValue(d))}
                          r={4}
                          fill={colorScale(item[0])}
                          onMouseEnter={() =>
                            setHoveredPoint([
                              xValue(d),
                              yValue(d),
                              colorValue(d),
                            ])
                          }
                          onMouseOut={() => setHoveredPoint(null)}
                        ></circle>
                        <Tooltip
                          hoveredPoint={hoveredPoint}
                          xScale={xScale}
                          yScale={yScale}
                          colorScale={colorScale}
                          unit="kW"
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
          {/* <text
            transform={`translate(${innerWidth / 2},-20)`}
            textAnchor="middle"
          >
            Andamento picco di potenza (kW) vs potenza disponibile (linea nera)
          </text> */}
          {/* <text
            transform={`translate(-60,${innerHeight / 2}) rotate(-90)`}
            textAnchor="middle"
            className="axis-label"
          >
            kW
          </text> */}
          {/* <text
            transform={`translate(${innerWidth / 2},${innerHeight + 40})`}
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
      </svg>
    </>
  );
};

export default Picco;
