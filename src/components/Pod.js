import { GiElectric } from "react-icons/gi";
import { BsArrowReturnRight } from "react-icons/bs";
import { useGlobalContext } from "../context";

const Pod = ({ id, attributes }) => {
  const { getPodId, getTestPodId, state } = useGlobalContext();

  return (
    <div className="sidebar-azienda">
      <BsArrowReturnRight />
      <GiElectric style={{ color: "var(--clr-red-dark)" }} />
      {state.isAuthenticated && (
        <h6 className="sidebar-address" onClick={() => getPodId(id)}>
          {attributes.indirizzo}
        </h6>
      )}
      {!state.isAuthenticated && (
        <h6 className="sidebar-address" onClick={() => getTestPodId(id)}>
          {attributes.indirizzo}
        </h6>
      )}
    </div>
  );
};

export default Pod;
