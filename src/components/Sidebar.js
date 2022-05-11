import { useEffect, useState, useCallback } from "react";
import Search from "./Search";
import Azienda from "./Azienda";
import { useGlobalContext } from "../context";
import { FaTimes } from "react-icons/fa";

const Sidebar = () => {
  const {
    isSidebarOpen,
    closeSidebar,
    testAziendas,
    state,
    searchTerm,
    aziendas,
  } = useGlobalContext();
  const [filtered, setFiltered] = useState([]);
  const [filteredTest, setFilteredTest] = useState([]);

  const filteredAziendas = useCallback(() => {
    if (aziendas) {
      const data = aziendas.filter((item) =>
        item.attributes.ragioneSociale.toLowerCase().includes(searchTerm)
      );
      setFiltered(data);
    }
  }, [searchTerm, aziendas]);

  const filteredTestAziendas = useCallback(() => {
    if (testAziendas) {
      const data = testAziendas.filter((item) =>
        item.attributes.ragioneSociale.toLowerCase().includes(searchTerm)
      );
      setFilteredTest(data);
    }
  }, [searchTerm, testAziendas]);

  useEffect(() => {
    if (state.isAuthenticated) {
      filteredAziendas();
    } else {
      filteredTestAziendas();
    }
  }, [
    searchTerm,
    filteredAziendas,
    filteredTestAziendas,
    state.isAuthenticated,
  ]);

  return (
    <aside className={`${isSidebarOpen ? "sidebar show-sidebar" : "sidebar"}`}>
      <div className="sidebar-header">
        <button className="close-btn" onClick={closeSidebar}>
          <FaTimes />
        </button>
      </div>
      <Search />
      <div className="aziendas-list">
        {state.isAuthenticated &&
          filtered.length > 0 &&
          filtered.map((item) => {
            return <Azienda key={item.id} {...item} />;
          })}
        {state.isAuthenticated && filtered.length < 1 && (
          <h3 className="no-result">no results</h3>
        )}

        {!state.isAuthenticated &&
          filteredTest.length > 0 &&
          filteredTest.map((item) => {
            return <Azienda key={item.id} {...item} />;
          })}
        {!state.isAuthenticated && filteredTest.length < 1 && (
          <h3 className="no-result">no results</h3>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
