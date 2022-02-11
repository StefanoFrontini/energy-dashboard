import { DashboardPage, Login, Error } from "./pages";
import Navbar from "./components/Navbar";
// import Modal from "./components/Modal";
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </>
  );
};

export default App;
