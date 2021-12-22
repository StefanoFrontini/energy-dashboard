import { IoIosFlame } from "react-icons/io";
import { BsArrowReturnRight } from "react-icons/bs";
import { useGlobalContext } from "../context";

const Pdr = ({ id, attributes }) => {
  const { getPdrId } = useGlobalContext();

  return (
    <div className="sidebar-azienda">
      <BsArrowReturnRight />
      <IoIosFlame />
      <h6 className="sidebar-address" onClick={() => getPdrId(id)}>
        {attributes.indirizzo}
      </h6>
    </div>
  );
};

export default Pdr;
