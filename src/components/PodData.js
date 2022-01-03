import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { timeParse } from "d3";

const graphQlUrl = "http://localhost:1337/graphql";

const GET_POD_DATA = `query ($id: ID!){
  pod(id: $id){
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

const usePodData = () => {
  const [loadingPodData, setLoadingPodData] = useState(false);
  const [data, setData] = useState({});
  const [podId, setPodId] = useState("3");
  const fetchPod = useCallback(async () => {
    let variables = {};
    variables.id = podId;
    setLoadingPodData(true);
    try {
      const {
        data: {
          data: {
            pod: { data },
          },
        },
      } = await axios({
        url: graphQlUrl,
        method: "POST",
        data: {
          query: GET_POD_DATA,
          variables,
        },
      });

      if (data) {
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
          d3DataOrari: transformOrari(data.attributes.consumiOrari.data),
        };

        setData(rawData);
        setLoadingPodData(false);
      } else {
        setData([]);
      }
      setLoadingPodData(false);
    } catch (error) {
      console.log(error);
      setLoadingPodData(false);
    }
  }, [podId]);
  useEffect(() => {
    fetchPod();
  }, [podId, fetchPod]);
  return { data, podId, setPodId, loadingPodData };
};

export default usePodData;
