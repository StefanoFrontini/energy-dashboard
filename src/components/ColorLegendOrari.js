const ColorLegendOrari = ({
  colorScale,
  tickSpacing,
  tickSize,
  tickTextOffset,
}) => {
  return colorScale.domain().map((domainValue, i) => {
    return (
      <g transform={`translate(${i * tickSpacing},0)`} key={i}>
        <circle fill={colorScale(domainValue)} r={tickSize} />
        <text x={tickTextOffset} dy=".32em" className="legendTextOrari">
          {domainValue}
        </text>
      </g>
    );
  });
};

export default ColorLegendOrari;
