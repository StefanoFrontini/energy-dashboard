import Dashboard from "../components/Dashboard";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import Sidebar from "../components/Sidebar";
import { useGlobalContext } from "../context";

const DashboardPage = () => {
  const { openSidebar } = useGlobalContext();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <>
      <button className="btn" onClick={openSidebar}>
        Show Clients
      </button>
      <Sidebar />
      <Dashboard ref={componentRef} />
      <section>
        <button className="btn" onClick={handlePrint}>
          Print this out!
        </button>
      </section>
    </>
  );
};

export default DashboardPage;
