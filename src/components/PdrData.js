import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { timeParse, extent, timeFormat, timeFormatDefaultLocale } from "d3";
import locale from "./locale";

timeFormatDefaultLocale(locale);

const graphQlUrl = "http://localhost:1337/graphql";

const GET_PDR_DATA = `query ($id: ID!){
  pdr(id: $id){
    data{
      id
      attributes{
        pdrId
        indirizzo
        consumiMensili
        mensiliCommento
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

const transform = (x) => {
  const transformedData = x.map((item) => {
    return {
      smc: Math.round(item.smc),
      //date: parseTime(`${item.anno.toString()}, ${item.Mese.toString()}`),
      date: parseDate(item.date),
      year: item.anno.toString(),
      month: parseTime(item.mese.toString()),
    };
  });
  return transformedData;
};

const usePdrData = () => {
  const [data, setData] = useState([]);
  const [pdrId, setPdrId] = useState(2);
  const [loadingPdrData, setLoadingPdrData] = useState(false);
  const fetchPdr = useCallback(async () => {
    let variables = {};
    variables.id = pdrId;
    setLoadingPdrData(true);
    try {
      const {
        data: {
          data: {
            pdr: { data },
          },
        },
      } = await axios({
        url: graphQlUrl,
        method: "POST",
        data: {
          query: GET_PDR_DATA,
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
          pdr: data.attributes.pdrId,
          indirizzo: data.attributes.indirizzo,
          mensiliCommento: data.attributes.mensiliCommento,
          d3Data: transform(data.attributes.consumiMensili.data),
          inizioPeriodo: start,
          finePeriodo: end,
        };

        setData(rawData);
        setLoadingPdrData(false);
      } else {
        setData([]);
      }
      setLoadingPdrData(false);
    } catch (error) {
      console.log(error);
      setLoadingPdrData(false);
    }
  }, [pdrId]);
  useEffect(() => {
    fetchPdr();
  }, [pdrId, fetchPdr]);
  return { data, pdrId, setPdrId, loadingPdrData };
};

export default usePdrData;
