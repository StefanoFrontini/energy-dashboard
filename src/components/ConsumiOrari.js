import { mean, rollups } from "d3";

const margin = { top: 40, right: 100, bottom: 80, left: 80 };

const yearValue = (d) => d.year;
const monthValue = (d) => d.month;
const giornoTipoValue = (d) => d.giornoTipo;
const hourValue = (d) => d.ora;
const kWhValue = (d) => d.kWh;

const ConsumiOrari = ({ svgWidth, svgHeight, d3DataOrari }) => {
  const innerWidth = svgWidth - margin.left - margin.right;
  const innerHeight = svgHeight - margin.top - margin.bottom;
  console.log("d3DataOrari", d3DataOrari);
  /*   const groupsData = groups(
    d3DataOrari,
    yearValue,
    monthValue,
    giornoTipoValue
  ); */
  const rollupData = rollups(
    d3DataOrari,
    (v) => Math.round(mean(v, kWhValue)),
    monthValue,
    giornoTipoValue,
    hourValue
  );

  console.log("rollupData:", rollupData);
  return <div></div>;
};

export default ConsumiOrari;
