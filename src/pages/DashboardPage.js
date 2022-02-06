import Dashboard from "../components/Dashboard";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import Sidebar from "../components/Sidebar";

const DashboardPage = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <>
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
