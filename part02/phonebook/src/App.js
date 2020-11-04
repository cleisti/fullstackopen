import React, { useEffect, useState } from 'react'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Filter from './components/Filter'
import Notification from './components/Notification'
import phonebookService from './services/phonebook'

const Header = ({ text }) => <><h1>{text}</h1></>

const App = () => {
  const [persons, setPersons] = useState([])
  const [filter, setNewFilter] = useState('')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    phonebookService
      .getAll()
      .then(persons => {
        setPersons(persons)
      })
  }, [])

  const handleFilter = (event) => setNewFilter(event.target.value)

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)
    
    if (window.confirm(`Delete ${person.name} ?`)) {
      phonebookService
      .remove(id)
      .then(returnedPerson => {
        setPersons(persons.filter(p => p.id !== id))        
        setMessage( () => ({
          "message": `${person.name} deleted from phone book`,
          "type": "message"
        }));
				setTimeout(() => {
					setMessage(null)
				}, 5000)
      })
      .catch(error => {
        setMessage( () => ({
          "message": `Failed to delete ${person.name} from phone book`,
          "type": "error"
        }));
      })
    }
  }

  return (
    <div>
      <Header text='Phonebook' />
      <Notification message={message} />
      <Filter filter={filter} handleFilter={handleFilter} />
      <Header text='add a new' />
      <PersonForm persons={persons} setPersons={setPersons} setMessage={setMessage} />
      <Header text='Numbers' />
      <Persons persons={persons} filter={filter} deletePerson={deletePerson} />
    </div>
  )
}

export default App