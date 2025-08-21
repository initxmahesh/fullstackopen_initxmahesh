import { useEffect, useState } from "react";
import Persons from "./components/Persons";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Service from './services/server'


const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [addPhone, setPhone] = useState("");
  const [contactSearch, setSearch] = useState("");

  const filterPerson = persons.filter((person) =>
    person.name.toLowerCase().includes(contactSearch.toLowerCase())
  );

  useEffect(() => {
    Service.getAll().then(response => {
      console.log(response)
      setPersons(response.data)
    })
  }, [])

  const addPerson = (event) => {
    event.preventDefault();
    const nameFound = persons.find(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    );

    if (nameFound) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const updatedPerson = { ...nameFound, number: addPhone };
        Service.update(nameFound.id, updatedPerson).then(returnedPerson => {
          setPersons(persons.map(p => p.id !== nameFound.id ? p : returnedPerson));
          setNewName("");
          setPhone("");
        });
      }
      return;
    }

    const newPerson = { name: newName, number: addPhone };
    Service.create(newPerson).then(returnedPerson => {
      setPersons(persons.concat(returnedPerson));
      setNewName("");
      setPhone("");
    });
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      Service.removePerson(id).then(() => {
        setPersons(persons.filter(p => p.id !== id));
      });
    }
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
        <Persons persons={filterPerson} onDelete={handleDelete} />
      </div>
    );
  };


export default App;
