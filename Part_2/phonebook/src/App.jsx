import { useEffect, useState } from "react";
import Persons from "./components/Persons";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [addPhone, setPhone] = useState("");
  const [contactSearch, setSearch] = useState("");

  const filterPerson = persons.filter((person) =>
    person.name.toLowerCase().includes(contactSearch.toLowerCase())
  );

  useEffect(function () {
    axios.get('http://localhost:3001/persons').then(response => {
      setPersons(response.data)
    })
  },[])

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
