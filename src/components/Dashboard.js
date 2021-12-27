import { useGlobalContext } from "../context";
import Loading from "./Loading";
import LineChart from "./LineChart";
import BarChart from "./BarChart";
import React from "react";

const svgWidth = 900;
const svgHeight = svgWidth / 2;

const Dashboard = React.forwardRef((props, ref) => {
  const {
    podData,
    loadingPodData,
    loadingPdrData,
    loadingAziendaData,
    pdrData,
  } = useGlobalContext();

  if (loadingPodData || loadingAziendaData || loadingPdrData) {
    return <Loading />;
  }

  return (
    <main className="main" ref={ref}>
      <h2>dashboard page</h2>
      {podData.d3Data && (
        <LineChart {...podData} svgWidth={svgWidth} svgHeight={svgHeight} />
      )}
      <h4>Comment</h4>
      {podData.d3Data && (
        <BarChart {...podData} svgWidth={svgWidth} svgHeight={svgHeight} />
      )}
      <h4>Comment</h4>
    </main>
  );
});

export default Dashboard;
