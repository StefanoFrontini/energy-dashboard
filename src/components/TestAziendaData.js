import axios from "axios";
import { useState, useEffect } from "react";

const { REACT_APP_URL } = process.env;

const GET_TEST_AZIENDAS = `query {
  testAziendas(pagination: { limit: -1 }, sort:"ragioneSociale:asc"){
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

const useTestAziendaData = (auth) => {
  const [data, setData] = useState([]);
  const [loadingAziendaData, setLoadingAziendaData] = useState(false);

  const fetchAziendas = async () => {
    setLoadingAziendaData(true);

    try {
      const {
        data: {
          data: {
            testAziendas: { data },
          },
        },
      } = await axios({
        url: REACT_APP_URL,
        method: "POST",
        data: {
          query: GET_TEST_AZIENDAS,
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
    if (!auth) {
      console.log("testFetchAziendas");
      fetchAziendas();
    }
  }, [auth]);
  return { data, loadingAziendaData };
};

export default useTestAziendaData;
