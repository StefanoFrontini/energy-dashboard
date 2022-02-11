import { useState } from "react";
import Modal from "./Modal";
import { useGlobalContext } from "../context";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const { REACT_APP_LOGIN_URL } = process.env;

const LoginForm = () => {
  const { state, dispatch } = useGlobalContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let navigate = useNavigate();

  const fetchLoginData = async () => {
    try {
      const { data } = await axios.post(REACT_APP_LOGIN_URL, {
        identifier: email,
        password,
      });
      if (data) {
        Cookies.set("token", data.jwt);
        dispatch({ type: "LOGIN", payload: data.user });
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: "ERROR", payload: error.response.data.error.message });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      fetchLoginData();

      setEmail("");
      setPassword("");
    } else {
      dispatch({ type: "NO_VALUE" });
      setEmail("");
      setPassword("");
    }
  };
  const closeModal = () => {
    dispatch({ type: "CLOSE_MODAL" });
  };
  return (
    <>
      {state.isModalOpen && (
        <Modal closeModal={closeModal} modalContent={state.modalContent} />
      )}
      <form onSubmit={handleSubmit} className="form">
        <div className="form-input">
          <label htmlFor="email">Email o nome utente</label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-input">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">accedi </button>
      </form>
    </>
  );
};

export default LoginForm;
