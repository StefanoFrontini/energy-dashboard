import axios from "axios";
import { useState, useEffect } from "react";

const { REACT_APP_URL } = process.env;

const GET_TEST_AZIENDAS = `query($searchTerm: String) {
  testAziendas(pagination: { limit: -1 }, sort:"ragioneSociale:asc", filters: { ragioneSociale: { containsi: $searchTerm }}){
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

const useTestAziendaData = (auth, searchTerm) => {
  const [data, setData] = useState([]);
  const [loadingAziendaData, setLoadingAziendaData] = useState(false);

  const fetchAziendas = async (searchTerm) => {
    setLoadingAziendaData(true);
    const variables = { searchTerm };

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
          variables,
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
  }, [auth, searchTerm]);
  return { data, loadingAziendaData };
};

export default useTestAziendaData;
