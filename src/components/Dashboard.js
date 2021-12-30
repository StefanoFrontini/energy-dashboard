import { useGlobalContext } from "../context";
import Loading from "./Loading";
import ConsumiMensiliEnergia from "./ConsumiMensiliEnergia";
import ConsumiFasce from "./ConsumiFasce";
import Picco from "./Picco";
import PiccoConsumi from "./PiccoConsumi";
import ConsumiOrari from "./ConsumiOrari";
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
        <ConsumiMensiliEnergia
          {...podData}
          svgWidth={svgWidth}
          svgHeight={svgHeight}
        />
      )}
      <h4>Comment</h4>
      {podData.d3Data && (
        <ConsumiFasce {...podData} svgWidth={svgWidth} svgHeight={svgHeight} />
      )}
      <h4>Comment</h4>
      {podData.d3Data && (
        <Picco {...podData} svgWidth={svgWidth} svgHeight={svgHeight} />
      )}
      <h4>Comment</h4>
      {podData.d3Data && (
        <PiccoConsumi {...podData} svgWidth={svgWidth} svgHeight={svgHeight} />
      )}
      <h4>Comment</h4>
      {podData.d3DataOrari && (
        <ConsumiOrari {...podData} svgWidth={svgWidth} svgHeight={svgHeight} />
      )}
      <h4>Comment</h4>
    </main>
  );
});

export default Dashboard;
