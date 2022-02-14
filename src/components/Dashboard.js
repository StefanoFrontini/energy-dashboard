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
    state,
    testLoadingPodData,
    testLoadingPdrData,
    testPodData,
    testPdrData,
    testLoadingAziendaData,
  } = useGlobalContext();

  if (
    loadingPodData ||
    loadingAziendaData ||
    loadingPdrData ||
    testLoadingPodData ||
    testLoadingPdrData ||
    testLoadingAziendaData
  ) {
    return <Loading />;
  }

  return (
    <div ref={ref}>
      <Header />
      <main className="main">
        {state.isAuthenticated && showPower && (
          <>
            <section>
              <p>
                {podData.ragioneSociale}
                <br></br>
                {podData.pod && `pod: ${podData.pod}`}
                <br></br>
                {podData.indirizzo && `pod address: ${podData.indirizzo}`}
                <br></br>
                Period: {podData.inizioPeriodo} - {podData.finePeriodo}{" "}
                <br></br>Report dated {formattedDate}
              </p>
            </section>
            <section>
              <h3>Andamento consumi mensili (kWh)</h3>
              {/* <h3>Monthly consumptions (kWh)</h3> */}
              {podData.d3Data && (
                <ConsumiMensiliEnergia
                  {...podData}
                  svgWidth={svgWidth}
                  svgHeight={svgHeight}
                />
              )}

              <article className="warning">
                <ReactMarkdown>{podData.mensiliCommento}</ReactMarkdown>
              </article>
              <div id="pageFooter"></div>
              <div className="page-break"></div>
            </section>

            <section>
              <h3>Andamento consumi mensili per fasce (kWh)</h3>
              {/* <h3>Monthly consumptions by bands (kWh)</h3> */}

              {podData.d3Data && (
                <ConsumiFasce
                  {...podData}
                  svgWidth={svgWidth}
                  svgHeight={svgHeight}
                />
              )}
              <article className="warning">
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
              {/* <h3>Peak power (kW) and Available power (black line)</h3> */}

              {podData.d3Data && (
                <Picco {...podData} svgWidth={svgWidth} svgHeight={svgHeight} />
              )}

              <article className="warning">
                <ReactMarkdown>{podData.piccoCommento}</ReactMarkdown>
              </article>
            </section>
            <section>
              <h3>Picco di potenza (kW) e Consumi mensili (kWh)</h3>
              {/* <h3>Peak power (kW) and monthly consumption (kWh)</h3> */}

              {podData.d3Data && (
                <PiccoConsumi
                  {...podData}
                  svgWidth={svgWidth}
                  svgHeight={svgHeight}
                />
              )}

              <article className="warning">
                <ReactMarkdown>{podData.piccoConsumiCommento}</ReactMarkdown>
              </article>
              <div id="pageFooter"></div>
              <div className="page-break"></div>
            </section>
            <section>
              {podData.d3DataOrari && (
                <>
                  <h3>Consumi orari (kWh)</h3>
                  {/* <h3>Hourly consumptions (kWh)</h3> */}
                  <ConsumiOrari
                    {...podData}
                    svgWidth={svgWidth}
                    svgHeight={svgHeight}
                  />
                </>
              )}

              <article className="warning">
                <ReactMarkdown>{podData.orariCommento}</ReactMarkdown>
              </article>
              <div id="pageFooter"></div>
              <div className="page-break"></div>
            </section>
          </>
        )}
        {state.isAuthenticated && showGas && (
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
                  {/* <h3>Monthly consumptions (Smc)</h3> */}
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
        {!state.isAuthenticated && showPower && (
          <>
            <section>
              <p>
                {testPodData.ragioneSociale}
                <br></br>
                {testPodData.pod && `pod: ${testPodData.pod}`}
                <br></br>
                {testPodData.indirizzo &&
                  `indirizzo pod: ${testPodData.indirizzo}`}
                <br></br>
                Periodo: {testPodData.inizioPeriodo} - {testPodData.finePeriodo}{" "}
                <br></br>Report del {formattedDate}
              </p>
            </section>
            <section>
              <h3>Andamento consumi mensili (kWh)</h3>
              {/* <h3>Monthly consumptions (kWh)</h3> */}
              {testPodData.d3Data && (
                <ConsumiMensiliEnergia
                  {...testPodData}
                  svgWidth={svgWidth}
                  svgHeight={svgHeight}
                />
              )}

              <article className="warning">
                <ReactMarkdown>{testPodData.mensiliCommento}</ReactMarkdown>
              </article>
              <div id="pageFooter"></div>
              <div className="page-break"></div>
            </section>

            <section>
              <h3>Andamento consumi mensili per fasce (kWh)</h3>
              {/* <h3>Monthly consumptions by bands(kWh)</h3> */}

              {testPodData.d3Data && (
                <ConsumiFasce
                  {...testPodData}
                  svgWidth={svgWidth}
                  svgHeight={svgHeight}
                />
              )}
              <article className="warning">
                <ReactMarkdown>{testPodData.fasceCommento}</ReactMarkdown>
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
              {/* <h3>Peak power (kW) and Available powwer (black line)</h3> */}

              {testPodData.d3Data && (
                <Picco
                  {...testPodData}
                  svgWidth={svgWidth}
                  svgHeight={svgHeight}
                />
              )}

              <article className="warning">
                <ReactMarkdown>{testPodData.piccoCommento}</ReactMarkdown>
              </article>
            </section>
            <section>
              <h3>Picco di potenza (kW) e Consumi mensili (kWh)</h3>
              {/* <h3>Peak power (kW) and monthly consumptions (kWh)</h3> */}

              {testPodData.d3Data && (
                <PiccoConsumi
                  {...testPodData}
                  svgWidth={svgWidth}
                  svgHeight={svgHeight}
                />
              )}

              <article className="warning">
                <ReactMarkdown>
                  {testPodData.piccoConsumiCommento}
                </ReactMarkdown>
              </article>
              <div id="pageFooter"></div>
              <div className="page-break"></div>
            </section>
            <section>
              {testPodData.d3DataOrari && (
                <>
                  <h3>Consumi orari (kWh)</h3>
                  {/* <h3>Hourly consumptions (kWh)</h3> */}
                  <ConsumiOrari
                    {...testPodData}
                    svgWidth={svgWidth}
                    svgHeight={svgHeight}
                  />
                </>
              )}

              <article className="warning">
                <ReactMarkdown>{testPodData.orariCommento}</ReactMarkdown>
              </article>
              <div id="pageFooter"></div>
              <div className="page-break"></div>
            </section>
          </>
        )}
        {!state.isAuthenticated && showGas && (
          <>
            <section>
              {testPdrData.d3Data && (
                <p>
                  {testPdrData.ragioneSociale}
                  <br></br>
                  {testPdrData.pdr && `pdr: ${testPdrData.pdr}`}
                  <br></br>
                  {testPdrData.indirizzo &&
                    `pdr address: ${testPdrData.indirizzo}`}
                  <br></br>
                  Periodo: {testPdrData.inizioPeriodo} -{" "}
                  {testPdrData.finePeriodo}
                  <br></br>Report del {formattedDate}
                </p>
              )}
            </section>
            <section>
              {testPdrData.d3Data && (
                <>
                  <h3>Andamento consumi mensili gas (Smc)</h3>
                  {/* <h3>Monthly consumptions gas (Smc)</h3> */}
                  <ConsumiMensiliGas
                    {...testPdrData}
                    svgWidth={svgWidth}
                    svgHeight={svgHeight}
                  />
                  <article className="ok">
                    <ReactMarkdown>{testPdrData.mensiliCommento}</ReactMarkdown>
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
