import { useState } from "react";
import Persons from "./components/Persons";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);
  const [newName, setNewName] = useState("");
  const [addPhone, setPhone] = useState("");
  const [contactSearch, setSearch] = useState("");

  const filterPerson = persons.filter((person) =>
    person.name.toLowerCase().includes(contactSearch.toLowerCase())
  );

  const addPerson = (event) => {
    event.preventDefault();
    const nameFound = persons.some(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    );

    if (nameFound) {
      alert(`${newName} is already added to phonebook`);
      return;
    }

    setPersons([...persons, { name: newName, number: addPhone }]);
    console.log("form has changed", event.target.value);
    setNewName("");
    setPhone("");
  };

  return (
    <div>
      <div>
        <h2>Phonebook</h2>
        <Filter
          contactSearch={contactSearch}
          handleSearch={(event) => setSearch(event.target.value)}
        />
      </div>
      <h3>add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        addPhone={addPhone}
        handleName={(event) => setNewName(event.target.value)}
        handlePhone={(event) => setPhone(event.target.value)}
      />
      <h3>Numbers</h3>
      <Persons persons={filterPerson} />
    </div>
  );
};

export default App;
