import axios from "axios";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

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

const useAziendaData = (auth) => {
  const [data, setData] = useState([]);
  const [loadingAziendaData, setLoadingAziendaData] = useState(false);

  const fetchAziendas = async () => {
    const token = Cookies.get("token");

    if (token) {
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            query: GET_AZIENDAS,
          },
        });
        if (data) {
          setData(data);
          setLoadingAziendaData(false);
        } else {
          setData([]);
          setLoadingAziendaData(false);
        }
        setLoadingAziendaData(false);
      } catch (error) {
        console.log(error);
        setLoadingAziendaData(false);
      }
    }
  };
  useEffect(() => {
    if (auth) {
      console.log("fetchAziendas");
      fetchAziendas();
    }
  }, [auth]);

  return { data, loadingAziendaData };
};

export default useAziendaData;
