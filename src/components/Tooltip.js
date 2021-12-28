import { timeFormat } from "d3";

const formatTime = timeFormat("%B");

const Tooltip = ({ hoveredPoint, xScale, yScale, colorScale, unit }) => {
  return (
    <>
      {hoveredPoint && (
        <text
          dx={xScale(hoveredPoint[0]) + 20}
          dy={yScale(hoveredPoint[1])}
          fill={colorScale ? colorScale(hoveredPoint[2]) : "black"}
        >
          {formatTime(hoveredPoint[0])}
        </text>
      )}
      {hoveredPoint && (
        <text
          dx={xScale(hoveredPoint[0]) + 20}
          dy={yScale(hoveredPoint[1]) + 20}
          fill={colorScale ? colorScale(hoveredPoint[2]) : "black"}
        >
          {hoveredPoint[1]} {unit}
        </text>
      )}
    </>
  );
};

export default Tooltip;
