import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { timeParse, extent, timeFormat, timeFormatDefaultLocale } from "d3";
import locale from "./locale";

timeFormatDefaultLocale(locale);

const { REACT_APP_URL } = process.env;

const GET_TEST_POD_DATA = `query ($id: ID!){
  testPod(id: $id){
    data{
      id
      attributes{
        podId
        indirizzo
        consumiMensili
        consumiOrari
        fasceCommento
        mensiliCommento
        piccoCommento
        piccoConsumiCommento
        orariCommento
        azienda {
          data{
            id
            attributes{
              ragioneSociale
            }
          }
        }

      }
    }
  }
}`;

const parseTime = timeParse("%m");

const parseDate = timeParse("%Y-%m-%dT%H:%M:%S.%LZ");

const formatTime = timeFormat("%B %Y");

const transformOrari = (x) => {
  const transformedData = x.map((item) => {
    return {
      kWh: Math.round(item.kWh),
      date: parseDate(item.date),
      year: item.anno.toString(),
      month: parseTime(item.mese.toString()),
      ora: item.ora,
      giornoTipo: item.giornoTipo,
    };
  });
  return transformedData;
};

const transform = (x) => {
  const transformedData = x.map((item) => {
    return {
      kWh: Math.round(item.kWh),
      // date: parseTime(`${item.Anno.toString()}, ${item.Mese.toString()}`),
      date: parseDate(item.date),
      year: item.anno.toString(),
      month: parseTime(item.mese.toString()),
      F1: Math.round(item.F1),
      F2: Math.round(item.F2),
      F3: Math.round(item.F3),
      picco: item.piccoPotenza,
      potenzaDisponibile: item.potenzaDisponibile,
    };
  });
  return transformedData;
};

const useTestPodData = (auth) => {
  const [loadingPodData, setLoadingPodData] = useState(false);
  const [data, setData] = useState({});
  const [podId, setPodId] = useState("1");
  const fetchPod = useCallback(async () => {
    let variables = {};
    variables.id = podId;
    setLoadingPodData(true);
    try {
      const {
        data: {
          data: {
            testPod: { data },
          },
        },
      } = await axios({
        url: REACT_APP_URL,
        method: "POST",

        data: {
          query: GET_TEST_POD_DATA,
          variables,
        },
      });

      if (data) {
        const dataset = transform(data.attributes.consumiMensili.data);
        const domain = extent(dataset, (d) => d.date);
        const start = formatTime(domain[0]);
        const end = formatTime(domain[1]);

        const rawData = {
          ragioneSociale:
            data.attributes.azienda.data.attributes.ragioneSociale,
          pod: data.attributes.podId,
          indirizzo: data.attributes.indirizzo,
          mensiliCommento: data.attributes.mensiliCommento,
          fasceCommento: data.attributes.fasceCommento,
          piccoCommento: data.attributes.piccoCommento,
          piccoConsumiCommento: data.attributes.piccoConsumiCommento,
          orariCommento: data.attributes.orariCommento,
          d3Data: transform(data.attributes.consumiMensili.data),
          d3DataOrari:
            data.attributes.consumiOrari &&
            transformOrari(data.attributes.consumiOrari.data),
          inizioPeriodo: start,
          finePeriodo: end,
        };

        setData(rawData);
        setLoadingPodData(false);
      } else {
        setData([]);
        setLoadingPodData(false);
      }
      setLoadingPodData(false);
    } catch (error) {
      console.log(error);
      setLoadingPodData(false);
    }
  }, [podId]);
  useEffect(() => {
    if (!auth) {
      fetchPod();
    }
  }, [podId, fetchPod, auth]);
  return { data, podId, setPodId, loadingPodData };
};

export default useTestPodData;
