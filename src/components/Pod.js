import { GiElectric } from "react-icons/gi";
import { BsArrowReturnRight } from "react-icons/bs";
import { useGlobalContext } from "../context";

const Pod = ({ id, attributes }) => {
  const { getPodId } = useGlobalContext();

  return (
    <div className="sidebar-azienda">
      <BsArrowReturnRight />
      <GiElectric />

      <h6 className="sidebar-address" onClick={() => getPodId(id)}>
        {attributes.indirizzo}
      </h6>
    </div>
  );
};

export default Pod;
