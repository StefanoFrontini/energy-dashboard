import { Link } from "react-router-dom";
import { useGlobalContext } from "../context";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Modal from "./Modal";

const Navbar = () => {
  let navigate = useNavigate();
  const { state, dispatch } = useGlobalContext();

  const closeModal = () => {
    dispatch({ type: "CLOSE_MODAL" });
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    Cookies.remove("token");
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };
  return (
    <>
      {state.isModalOpen && (
        <Modal closeModal={closeModal} modalContent={state.modalContent} />
      )}
      <nav>
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            {!state.isAuthenticated && <Link to="login">login</Link>}
            {state.isAuthenticated && (
              <button className="btn" onClick={logout}>
                logout
              </button>
            )}
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
