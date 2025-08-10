const PersonForm = ({
  addPerson,
  newName,
  handleName,
  addPhone,
  handlePhone,
}) => {
  return (
    <>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleName} />
        </div>
        <div>
          number: <input value={addPhone} onChange={handlePhone} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  );
};
export default PersonForm;
