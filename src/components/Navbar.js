import { Link } from "react-router-dom";
import { useGlobalContext } from "../context";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Navbar = () => {
  let navigate = useNavigate();
  const { state, dispatch } = useGlobalContext();
  const logout = () => {
    dispatch({ type: "LOGOUT" });
    Cookies.remove("token");
    navigate("/");
  };
  return (
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
  );
};

export default Navbar;
