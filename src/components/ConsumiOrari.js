import {
  mean,
  rollups,
  scaleLinear,
  extent,
  line,
  format,
  timeFormat,
} from "d3";

const margin = { top: 40, right: 10, bottom: 20, left: 30 };

const formatNumber = format(",d");
const formatTime = timeFormat("%B");

const yearValue = (d) => d.year;
const monthValue = (d) => d.month;
const giornoTipoValue = (d) => d.giornoTipo;
const hourValue = (d) => d.ora;
const kWhValue = (d) => d.kWh;

const ConsumiOrari = ({ svgWidth, svgHeight, d3DataOrari }) => {
  const svgWidthOrari = 200;
  const svgHeightOrari = 200;
  const innerWidth = svgWidthOrari - margin.left - margin.right;
  const innerHeight = svgHeightOrari - margin.top - margin.bottom;

  console.log("d3DataOrari", d3DataOrari);

  const rollupData = rollups(
    d3DataOrari,
    (v) => Math.round(mean(v, kWhValue)),
    monthValue,
    giornoTipoValue,
    hourValue
  );
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

  console.log("rollupData:", rollupData);
  return (
    <>
      {rollupData.map((m, ind) => {
        return (
          <div key={ind} className="cocktails-center">
            {rollupData[ind][1].map((item, indice) => {
              return (
                <svg
                  width={svgWidthOrari}
                  height={svgHeightOrari}
                  key={indice}
                  className="cocktail"
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
                          <text textAnchor="middle" alignmentBaseline="hanging">
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
                    <path stroke="black" d={lineGenerator(item[1])} />
                    {item[1].map((d, index) => {
                      return (
                        <g key={index}>
                          <circle
                            cx={xScale(d[0])}
                            cy={yScale(d[1])}
                            r={4}
                            fill="black"
                            /* onMouseEnter={() =>
                          setHoveredPoint([xValue(d), yValue(d), colorValue(d)])
                        }
                        onMouseOut={() => setHoveredPoint(null)} */
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

                    {/*         {sumstat.map((item) => {
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
        })} */}
                    {/* <path d={lineGenerator(d3Data)} /> */}
                    <text
                      transform={`translate(${innerWidth / 2},-20)`}
                      textAnchor="middle"
                    >
                      {formatTime(rollupData[ind][0])}
                      {" - "}
                      {item[0]}
                    </text>
                  </g>
                </svg>
              );
            })}
          </div>
        );
      })}
    </>
  );
};

export default ConsumiOrari;
