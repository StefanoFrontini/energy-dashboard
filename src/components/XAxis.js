import { useRef, useEffect } from "react";
import { select, axisBottom, timeFormat } from "d3";

const format = timeFormat("%b");

const XAxis = ({ xScale, innerHeight }) => {
  const ref = useRef();
  useEffect(() => {
    const xAxisG = select(ref.current);
    const xAxis = axisBottom(xScale)
      // .tickSize(-innerHeight)
      .tickPadding(18)
      .tickFormat((x) => format(x));
    xAxisG.call(xAxis);
  }, [xScale, innerHeight]);
  return <g transform={`translate(0,${innerHeight})`} ref={ref} />;
};

export default XAxis;
