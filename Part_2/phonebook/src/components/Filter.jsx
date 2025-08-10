const Filter = ({ contactSearch, handleSearch }) => {
  return (
    <>
      <label id="search">filter shown with</label>
      <input value={contactSearch} onChange={handleSearch} />
    </>
  );
};

export default Filter;
