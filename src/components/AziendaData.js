import axios from "axios";
import { useState, useEffect } from "react";

const graphQlUrl = "http://localhost:1337/graphql";

const GET_AZIENDAS = `query {
  aziendas(pagination: { limit: -1 }){
    data{
      id
      attributes{
        ragioneSociale
        partitaIva
        pods{
          data{
            id
            attributes{
              indirizzo
              podId
            }
          }
        }
        pdrs{
          data{
            id
            attributes{
              indirizzo
              pdrId
            }
          }
        }
      }
    }
  }
}`;

const useAziendaData = () => {
  const [data, setData] = useState([]);
  const [loadingAziendaData, setLoadingAziendaData] = useState(false);
  const fetchAziendas = async () => {
    setLoadingAziendaData(true);
    try {
      const {
        data: {
          data: {
            aziendas: { data },
          },
        },
      } = await axios({
        url: graphQlUrl,
        method: "POST",
        data: {
          query: GET_AZIENDAS,
        },
      });
      if (data) {
        setData(data);
        setLoadingAziendaData(false);
      } else {
        setData([]);
      }
      setLoadingAziendaData(false);
    } catch (error) {
      console.log(error);
      setLoadingAziendaData(false);
    }
  };
  useEffect(() => {
    fetchAziendas();
  }, []);
  return { data, loadingAziendaData };
};

export default useAziendaData;
