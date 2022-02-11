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
      <div className="nav-header">
        <Link className="btn" to="/">
          Home
        </Link>
        {!state.isAuthenticated && (
          <Link className="btn" to="login">
            login
          </Link>
        )}
        {state.isAuthenticated && (
          <button className="btn" onClick={logout}>
            logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
