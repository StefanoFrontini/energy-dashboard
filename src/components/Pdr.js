import { IoIosFlame } from "react-icons/io";
import { BsArrowReturnRight } from "react-icons/bs";
import { useGlobalContext } from "../context";

const Pdr = ({ id, attributes }) => {
  const { getPdrId, getTestPdrId, state } = useGlobalContext();

  return (
    <div className="sidebar-azienda">
      <BsArrowReturnRight />
      <IoIosFlame style={{ color: "var(--clr-primary-4)" }} />
      {state.isAuthenticated && (
        <h6 className="sidebar-address" onClick={() => getPdrId(id)}>
          {attributes.indirizzo}
        </h6>
      )}
      {!state.isAuthenticated && (
        <h6 className="sidebar-address" onClick={() => getTestPdrId(id)}>
          {attributes.indirizzo}
        </h6>
      )}
    </div>
  );
};

export default Pdr;
