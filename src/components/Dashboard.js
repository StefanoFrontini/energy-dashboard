import { useGlobalContext } from "../context";
import Loading from "./Loading";
import ConsumiMensiliEnergia from "./ConsumiMensiliEnergia";
import ConsumiMensiliGas from "./ConsumiMensiliGas";
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
    showGas,
    showPower,
  } = useGlobalContext();

  if (loadingPodData || loadingAziendaData || loadingPdrData) {
    return <Loading />;
  }

  return (
    <div ref={ref}>
      <Header />
      <main className="main">
        {showPower && (
          <>
            <section>
              <p>
                {podData.ragioneSociale}
                <br></br>
                {podData.pod && `pod: ${podData.pod}`}
                <br></br>
                {podData.indirizzo && `indirizzo pod: ${podData.indirizzo}`}
                <br></br>
                Periodo: {podData.inizioPeriodo} - {podData.finePeriodo}{" "}
                <br></br>Report del {formattedDate}
              </p>
            </section>
            <section>
              <h3>Andamento consumi mensili (kWh)</h3>
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
              <div id="pageFooter"></div>
              <div className="page-break"></div>
            </section>

            <section>
              <h3>Andamento consumi mensili per fasce (kWh)</h3>

              {podData.d3Data && (
                <ConsumiFasce
                  {...podData}
                  svgWidth={svgWidth}
                  svgHeight={svgHeight}
                />
              )}
              <article className="ok">
                <ReactMarkdown>{podData.fasceCommento}</ReactMarkdown>
              </article>

              <img
                src="https://res.cloudinary.com/stefano75/image/upload/v1641728180/fasce-orarie-arera-min_vrc0o8.png"
                alt="fasce orarie arera"
                width="600"
                height="127"
              />
              <div id="pageFooter"></div>
              <div className="page-break"></div>
            </section>

            <section>
              <h3>Picco di potenza (kW) e Potenza disponibile (linea nera)</h3>

              {podData.d3Data && (
                <Picco {...podData} svgWidth={svgWidth} svgHeight={svgHeight} />
              )}

              <article className="ok">
                <ReactMarkdown>{podData.piccoCommento}</ReactMarkdown>
              </article>
            </section>
            <section>
              <h3>Picco di potenza (kW) e Consumi mensili (kWh)</h3>

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
              <div id="pageFooter"></div>
              <div className="page-break"></div>
            </section>
            <section>
              {podData.d3DataOrari && (
                <>
                  <h3>Consumi orari (kWh)</h3>
                  <ConsumiOrari
                    {...podData}
                    svgWidth={svgWidth}
                    svgHeight={svgHeight}
                  />
                </>
              )}

              <article className="ok">
                <ReactMarkdown>{podData.orariCommento}</ReactMarkdown>
              </article>
              <div id="pageFooter"></div>
              <div className="page-break"></div>
            </section>
          </>
        )}
        {showGas && (
          <>
            <section>
              {pdrData.d3Data && (
                <p>
                  {pdrData.ragioneSociale}
                  <br></br>
                  {pdrData.pdr && `pdr: ${pdrData.pdr}`}
                  <br></br>
                  {pdrData.indirizzo && `indirizzo pdr: ${pdrData.indirizzo}`}
                  <br></br>
                  Periodo: {pdrData.inizioPeriodo} - {pdrData.finePeriodo}
                  <br></br>Report del {formattedDate}
                </p>
              )}
            </section>
            <section>
              {pdrData.d3Data && (
                <>
                  <h3>Andamento consumi mensili gas (Smc)</h3>
                  <ConsumiMensiliGas
                    {...pdrData}
                    svgWidth={svgWidth}
                    svgHeight={svgHeight}
                  />
                  <article className="ok">
                    <ReactMarkdown>{pdrData.mensiliCommento}</ReactMarkdown>
                  </article>
                  <div id="pageFooter"></div>
                  <div className="page-break"></div>
                </>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
});

export default Dashboard;
