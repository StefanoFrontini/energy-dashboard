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

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const getPodId = (id) => {
    setPodId(id);
  };

  const getPdrId = (id) => {
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
