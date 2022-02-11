import React, { useState, useReducer, useEffect } from "react";
import useAziendaData from "./components/AziendaData";

import useTestAziendaData from "./components/TestAziendaData";
import usePodData from "./components/PodData";
import useTestPodData from "./components/TestPodData";
import useTestPdrData from "./components/TestPdrData";
import usePdrData from "./components/PdrData";
// reducer function
import { reducer } from "./components/reducer";
import axios from "axios";
import Cookies from "js-cookie";

const defaultState = {
  user: {},
  isAuthenticated: false,
  isModalOpen: false,
  modalContent: "",
};

const STRAPI_URL = "http://localhost:1337/api/users/me";

// const url = "http://localhost:1337/api/aziendas?populate=*";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const { data: aziendas, loadingAziendaData } = useAziendaData(
    state.isAuthenticated
  );
  // const [aziendas, setData] = useState([]);
  // const [loadingAziendaData, setLoadingAziendaData] = useState(false);

  const { data: testAziendas, loadingAziendaData: testLoadingAziendaData } =
    useTestAziendaData(state.isAuthenticated);
  const {
    data: podData,
    setPodId,
    loadingPodData,
  } = usePodData(state.isAuthenticated);
  const {
    data: testPodData,
    setPodId: testSetPodId,
    loadingPodData: testLoadingPodData,
  } = useTestPodData(state.isAuthenticated);
  const {
    data: pdrData,
    setPdrId,
    loadingPdrData,
  } = usePdrData(state.isAuthenticated);
  const {
    data: testPdrData,
    setPdrId: testSetPdrId,
    loadingPdrData: testLoadingPdrData,
  } = useTestPdrData(state.isAuthenticated);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showPower, setShowPower] = useState(true);
  const [showGas, setShowGas] = useState(true);

  const fetchUser = async () => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const { data } = await axios.get(STRAPI_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (data) {
          dispatch({ type: "LOGIN", payload: data });
        }
      } catch (error) {
        console.log(error);
        dispatch({ type: "ERROR", payload: error.response.data.error.message });
      }
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const getPodId = (id) => {
    setShowPower(true);
    setShowGas(false);
    setPodId(id);
  };
  const getTestPodId = (id) => {
    setShowPower(true);
    setShowGas(false);
    testSetPodId(id);
  };

  const getPdrId = (id) => {
    setShowPower(false);
    setShowGas(true);
    setPdrId(id);
  };
  const getTestPdrId = (id) => {
    setShowPower(false);
    setShowGas(true);
    testSetPdrId(id);
  };

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        aziendas,
        loadingPodData,
        loadingPdrData,
        loadingAziendaData,
        isSidebarOpen,
        closeSidebar,
        openSidebar,
        getPodId,
        podData,
        pdrData,
        getPdrId,
        showPower,
        showGas,
        testPodData,
        testSetPodId,
        testLoadingPodData,
        testAziendas,
        testLoadingAziendaData,
        getTestPodId,
        testPdrData,
        testSetPdrId,
        testLoadingPdrData,
        getTestPdrId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

//custom hook
const useGlobalContext = () => {
  return React.useContext(AppContext);
};

export { useGlobalContext, AppProvider };
