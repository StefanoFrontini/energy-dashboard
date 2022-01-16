import React, { useState } from "react";
import useAziendaData from "./components/AziendaData";
import usePodData from "./components/PodData";
import usePdrData from "./components/PdrData";

// const url = "http://localhost:1337/api/aziendas?populate=*";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const { data: aziendas, loadingAziendaData } = useAziendaData();
  const { data: podData, setPodId, loadingPodData } = usePodData();
  const { data: pdrData, setPdrId, loadingPdrData } = usePdrData();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showPower, setShowPower] = useState(true);
  const [showGas, setShowGas] = useState(true);

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

  const getPdrId = (id) => {
    setShowPower(false);
    setShowGas(true);
    setPdrId(id);
  };

  return (
    <AppContext.Provider
      value={{
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
