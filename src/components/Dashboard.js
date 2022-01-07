import { useGlobalContext } from "../context";
import Loading from "./Loading";
import ConsumiMensiliEnergia from "./ConsumiMensiliEnergia";
import ConsumiFasce from "./ConsumiFasce";
import Picco from "./Picco";
import PiccoConsumi from "./PiccoConsumi";
import ConsumiOrari from "./ConsumiOrari";
import React from "react";
import ReactMarkdown from "react-markdown";
import Header from "./Header";

const svgWidth = 850;
const svgHeight = svgWidth / 2;

const date = new Date();
const options = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
};
const formattedDate = new Intl.DateTimeFormat("it-IT", options).format(date);

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
    <div ref={ref}>
      <Header />
      <section>
        <p>
          {podData.ragioneSociale}
          <br></br>
          {podData.pod && `pod: ${podData.pod}`}
          <br></br>
          {podData.indirizzo && `indirizzo pod: ${podData.indirizzo}`}
          <br></br>
          Periodo: Gennaio 2019 - Luglio 2021<br></br>Report del {formattedDate}
        </p>
      </section>
      <main className="main">
        <h4>Andamento consumi mensili (kWh)</h4>
        {podData.d3Data && (
          <ConsumiMensiliEnergia
            {...podData}
            svgWidth={svgWidth}
            svgHeight={svgHeight}
          />
        )}

        <article className="ok">
          <ReactMarkdown>{podData.mensiliCommento}</ReactMarkdown>
        </article>

        <div className="page-break-mensili"></div>

        {podData.d3Data && (
          <ConsumiFasce
            {...podData}
            svgWidth={svgWidth}
            svgHeight={svgHeight}
          />
        )}

        <img
          src="https://res.cloudinary.com/stefano75/image/upload/v1641320028/fasce-orarie-arera_bsyxam.png"
          alt="fasce orarie arera"
          width="657"
          height="215"
        />

        <article className="ok">
          <ReactMarkdown>{podData.fasceCommento}</ReactMarkdown>
        </article>

        <div className="page-break-fasce"></div>

        <h4>
          Andamento picco di potenza (kW) vs potenza disponibile (linea nera)
        </h4>

        {podData.d3Data && (
          <Picco {...podData} svgWidth={svgWidth} svgHeight={svgHeight} />
        )}

        <article className="ok">
          <ReactMarkdown>{podData.piccoCommento}</ReactMarkdown>
        </article>

        <h4>Picco di potenza (kW) e consumi mensili (kWh)</h4>

        {podData.d3Data && (
          <PiccoConsumi
            {...podData}
            svgWidth={svgWidth}
            svgHeight={svgHeight}
          />
        )}

        <article className="ok">
          <ReactMarkdown>{podData.piccoConsumiCommento}</ReactMarkdown>
        </article>

        <div className="page-break-picco"></div>

        <h4>Consumi orari (kWh)</h4>

        {podData.d3DataOrari && (
          <ConsumiOrari
            {...podData}
            svgWidth={svgWidth}
            svgHeight={svgHeight}
          />
        )}

        <article className="ok">
          <ReactMarkdown>{podData.orariCommento}</ReactMarkdown>
        </article>
      </main>
    </div>
  );
});

export default Dashboard;
