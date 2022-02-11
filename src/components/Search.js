import React from "react";
import { useGlobalContext } from "../context";

const Search = () => {
  const { setSearchTerm } = useGlobalContext();
  const searchValue = React.useRef("");

  React.useEffect(() => {
    searchValue.current.focus();
  }, []);

  const searchClient = () => {
    setSearchTerm(searchValue.current.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div className="search">
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="form-container">
          <label htmlFor="name">search</label>
          <input
            type="text"
            name="name"
            id="name"
            ref={searchValue}
            onChange={searchClient}
          />
        </div>
      </form>
    </div>
  );
};

export default Search;
