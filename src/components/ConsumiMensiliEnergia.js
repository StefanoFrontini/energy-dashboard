import {
  scaleTime,
  extent,
  scaleLinear,
  max,
  line,
  groups,
  scaleOrdinal,
} from "d3";
import XAxis from "./XAxis";
import YAxis from "./YAxis";
import ColorLegend from "./ColorLegend";
import { useState } from "react";
import Tooltip from "./Tooltip";

const xValue = (d) => d.month;
const yValue = (d) => d.kWh;
const colorValue = (d) => d.year;

const fadeOpacity = 0.1;

const margin = { top: 40, right: 100, bottom: 80, left: 80 };

const ConsumiMensiliEnergia = ({
  ragioneSociale,
  pod,
  d3Data,
  indirizzo,
  commento,
  svgWidth,
  svgHeight,
}) => {
  const [hoveredValue, setHoveredValue] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // console.log("d3Data", d3Data);
  const innerWidth = svgWidth - margin.left - margin.right;
  const innerHeight = svgHeight - margin.top - margin.bottom;
  const xScale = scaleTime()
    .domain(extent(d3Data, xValue))
    .range([0, innerWidth]);

  const yScale = scaleLinear()
    .domain([10000, max(d3Data, yValue)])
    .range([innerHeight, 0]);

  const lineGenerator = line()
    .x((d) => xScale(xValue(d)))
    .y((d) => yScale(yValue(d)));

  const colorScale = scaleOrdinal()
    .domain(d3Data.map(colorValue))
    .range(["#e41a1c", "#377eb8", "#4daf4a"]);

  const filteredData = d3Data.filter((d) => hoveredValue === colorValue(d));

  const groupData = groups(d3Data, (d) => d.year);

  const sumstat = groups(filteredData, (d) => d.year);

  return (
    <svg width={svgWidth} height={svgHeight}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        <XAxis xScale={xScale} innerHeight={innerHeight} />
        <YAxis yScale={yScale} innerWidth={innerWidth} />
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

        {/* <path d={lineGenerator(d3Data)} /> */}
        <text
          transform={`translate(${innerWidth / 2},-20)`}
          textAnchor="middle"
        >
          Andamento consumi
        </text>
        <text
          transform={`translate(-60,${innerHeight / 2}) rotate(-90)`}
          textAnchor="middle"
          className="axis-label"
        >
          kWh
        </text>
        <text
          transform={`translate(${innerWidth / 2},${innerHeight + 40})`}
          textAnchor="middle"
          alignmentBaseline="hanging"
          className="axis-label"
        >
          Time
        </text>
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