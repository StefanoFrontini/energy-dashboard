import { useGlobalContext } from "../context";
const Navbar = () => {
  const { openSidebar } = useGlobalContext();
  return (
    <nav>
      <button className="btn" onClick={openSidebar}>
        show aziendas
      </button>
    </nav>
  );
};

export default Navbar;
