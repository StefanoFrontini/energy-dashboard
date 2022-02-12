import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { timeParse, extent, timeFormat, timeFormatDefaultLocale } from "d3";
// import locale from "./locale";

// timeFormatDefaultLocale(locale);

const { REACT_APP_URL } = process.env;

const GET_TEST_PDR_DATA = `query ($id: ID!){
  testPdr(id: $id){
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

const useTestPdrData = (auth) => {
  const [data, setData] = useState([]);
  const [pdrId, setPdrId] = useState(1);
  const [loadingPdrData, setLoadingPdrData] = useState(false);
  const fetchPdr = useCallback(async () => {
    let variables = {};
    variables.id = pdrId;
    setLoadingPdrData(true);
    try {
      const {
        data: {
          data: {
            testPdr: { data },
          },
        },
      } = await axios({
        url: REACT_APP_URL,
        method: "POST",
        data: {
          query: GET_TEST_PDR_DATA,
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
        setLoadingPdrData(false);
      }
      setLoadingPdrData(false);
    } catch (error) {
      console.log(error);
      setLoadingPdrData(false);
    }
  }, [pdrId]);
  useEffect(() => {
    if (!auth) {
      fetchPdr();
    }
  }, [pdrId, fetchPdr, auth]);
  return { data, pdrId, setPdrId, loadingPdrData };
};

export default useTestPdrData;
