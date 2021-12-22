import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import Modal from "./components/Modal";

const App = () => {
  return (
    <>
      <Navbar />
      <Dashboard />
      <Modal />
      <Sidebar />
    </>
  );
};

export default App;
