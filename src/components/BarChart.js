import { scaleBand, scaleLinear, max, groups, timeFormat } from "d3";

const format = timeFormat("%b");

const xValue = (d) => d.month;
// const yValue = (d) => d.kWh;
const yearValue = (d) => d.year;
const F1Value = (d) => d.F1;
const F2Value = (d) => d.F2;
const F3Value = (d) => d.F3;

const margin = { top: 40, right: 100, bottom: 80, left: 80 };

const BarChart = ({ d3Data, svgWidth, svgHeight }) => {
  const innerWidth = svgWidth - margin.left - margin.right;
  const innerHeight = svgHeight - margin.top - margin.bottom;

  // console.log("D3Data", d3Data);

  const xScale = scaleBand()
    .domain(d3Data.map(xValue))
    .range([0, innerWidth])
    .padding(0.5);

  const maxF1 = max(d3Data, F1Value);
  const maxF2 = max(d3Data, F2Value);
  const maxF3 = max(d3Data, F3Value);

  const maxValue = Math.max(maxF1, maxF2, maxF3);

  const yScale = scaleLinear().domain([0, maxValue]).range([innerHeight, 0]);

  const groupByYear = groups(d3Data, yearValue);
  console.log("groupByYear", groupByYear);

  const subgroups = ["F1", "F2", "F3"];

  const xSubgroup = scaleBand()
    .domain(subgroups)
    .range([0, xScale.bandwidth()]);

  return (
    <svg width={svgWidth} height={svgHeight}>
      <g transform={`translate(${margin.left},${margin.top})`} className="tick">
        {yScale.ticks().map((tickValue, index) => {
          return (
            <g transform={`translate(0,${yScale(tickValue)})`} key={index}>
              <line x1={10} x2={innerWidth} stroke="black"></line>
              <text textAnchor="end" alignmentBaseline="middle">
                {tickValue}
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
            >
              {format(tickValue)}
            </text>
          );
        })}
        {groupByYear[0][1].map((d) => {
          return (
            // <rect
            //   x={xScale(xValue(d))} //month
            //   y={innerHeight - yScale(yValue(d))} //kWh
            //   width={xScale.bandwidth()}
            //   height={yScale(yValue(d))} //kWh
            //   key={xValue(d)}
            // />
            <g key={xValue(d)}>
              <rect
                x={xScale(xValue(d))}
                y={yScale(F1Value(d))}
                width={xSubgroup.bandwidth()}
                height={innerHeight - yScale(F1Value(d))}
              />
              <rect
                x={xScale(xValue(d)) + xSubgroup.bandwidth() + 2}
                y={yScale(F2Value(d))}
                width={xSubgroup.bandwidth()}
                height={innerHeight - yScale(F2Value(d))}
                fill="red"
              />
              <rect
                x={xScale(xValue(d)) + 2 * (xSubgroup.bandwidth() + 2)}
                y={yScale(F3Value(d))}
                width={xSubgroup.bandwidth()}
                height={innerHeight - yScale(F3Value(d))}
                fill="green"
              />
              <text
                transform={`translate(${innerWidth / 2},-20)`}
                textAnchor="middle"
              >
                Andamento consumi per fasce
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
            </g>
          );
        })}
      </g>
    </svg>
  );
};

export default BarChart;
