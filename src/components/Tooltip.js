import { timeFormat } from "d3";

const format = timeFormat("%B");

const Tooltip = ({ hoveredPoint, xScale, yScale, colorScale }) => {
  return (
    <>
      {hoveredPoint && (
        <text
          dx={xScale(hoveredPoint[0]) + 20}
          dy={yScale(hoveredPoint[1])}
          fill={colorScale(hoveredPoint[2])}
        >
          {format(hoveredPoint[0])}
        </text>
      )}
      {hoveredPoint && (
        <text
          dx={xScale(hoveredPoint[0]) + 20}
          dy={yScale(hoveredPoint[1]) + 20}
          fill={colorScale(hoveredPoint[2])}
        >
          {hoveredPoint[1]} kWh
        </text>
      )}
    </>
  );
};

export default Tooltip;
