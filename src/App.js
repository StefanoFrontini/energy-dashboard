import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import Modal from "./components/Modal";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";

const App = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <>
      <Navbar />
      <Dashboard ref={componentRef} />
      <button onClick={handlePrint}>Print this out!</button>
      <Modal />
      <Sidebar />
    </>
  );
};

export default App;
