import axios from "axios";
import { useState, useEffect, useCallback } from "react";

const graphQlUrl = "http://localhost:1337/graphql";

const GET_PDR_DATA = `query ($id: ID!){
  pdr(id: $id){
    data{
      id
      attributes{
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

const usePdrData = () => {
  const [data, setData] = useState([]);
  const [pdrId, setPdrId] = useState("1");
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
        setData(data);
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
