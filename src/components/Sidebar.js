import Search from "./Search";
import Azienda from "./Azienda";
import { useGlobalContext } from "../context";
import { FaTimes } from "react-icons/fa";

const Sidebar = () => {
  const { aziendas, isSidebarOpen, closeSidebar } = useGlobalContext();

  // if (loading) {
  //   return <Loading />;
  // }
  // if (aziendas.length < 1) {
  //   return <h2 className="section-title">no aziendas</h2>;
  // }
  return (
    <aside className={`${isSidebarOpen ? "sidebar show-sidebar" : "sidebar"}`}>
      <div className="sidebar-header">
        <button className="close-btn" onClick={closeSidebar}>
          <FaTimes />
        </button>
      </div>
      <Search />
      {aziendas.map((item) => {
        return <Azienda key={item.id} {...item} />;
      })}
    </aside>
  );
};

export default Sidebar;
