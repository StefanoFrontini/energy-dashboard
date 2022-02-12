import React from "react";
import Pod from "./Pod";
import Pdr from "./Pdr";
import { FaWarehouse } from "react-icons/fa";
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";

const Azienda = ({ attributes, id }) => {
  const [showPod, setShowPod] = React.useState(false);

  return (
    <>
      <div className="sidebar-azienda">
        {showPod ? (
          <AiOutlineMinusCircle
            className="sidebar-circle"
            onClick={() => (showPod ? setShowPod(false) : setShowPod(true))}
          />
        ) : (
          <AiOutlinePlusCircle
            className="sidebar-circle"
            onClick={() => (showPod ? setShowPod(false) : setShowPod(true))}
          />
        )}

        <FaWarehouse />
        <h4>{attributes.ragioneSociale}</h4>
      </div>
      {attributes.pods &&
        attributes.pods.data.map((item) => {
          return showPod && <Pod key={item.id} {...item} />;
        })}
      {attributes.pdrs &&
        attributes.pdrs.data.map((item) => {
          return showPod && <Pdr key={item.id} {...item} />;
        })}
    </>
  );
};

export default Azienda;
