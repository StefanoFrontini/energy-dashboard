const ColorLegend = ({
  colorScale,
  tickSpacing,
  tickSize,
  tickTextOffset,
  onHover,
  hoveredValue,
  fadeOpacity,
}) => {
  return colorScale.domain().map((domainValue, i) => {
    return (
      <g
        onMouseEnter={() => onHover(domainValue)}
        onMouseOut={() => onHover(null)}
        opacity={hoveredValue && domainValue !== hoveredValue ? fadeOpacity : 1}
        transform={`translate(0,${i * tickSpacing})`}
        key={i}
      >
        <circle fill={colorScale(domainValue)} r={tickSize} />
        <text x={tickTextOffset} dy=".32em" className="legendText">
          {domainValue}
        </text>
      </g>
    );
  });
};

export default ColorLegend;
