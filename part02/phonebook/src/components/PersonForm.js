import React, {useState} from 'react'
import phonebookService from '../services/phonebook'

const PersonForm = ({ persons, setPersons, setMessage }) => {
	const [newName, setNewName] = useState('')
	const [newNumber, setNewNumber] = useState('')
  
	const handleNewName = (event) => setNewName(event.target.value)
	
	const handleNewNumber = (event) => setNewNumber(event.target.value)
  
	const addNewName = (event) => {
	  event.preventDefault()
	  const nameExists = persons.find((person) => person['name'] === newName)
	  const numExists = persons.find((person) => person['number'] === newNumber)
  
	  if (!nameExists && !numExists) {
		const personObject = {
		  name: newName,
		  number: newNumber
		}
		phonebookService
			.add(personObject)
			.then(returnedPerson => {
				setPersons(persons.concat(returnedPerson))
				setNewName('')
				setNewNumber('')
				setMessage( () => ({
					"message": `Added ${newName} to phonebook`,
					"type": "message"
				}));
				setTimeout(() => {
					setMessage(null)
				}, 5000)
			})
			.catch(error => {
				setMessage( () => ({
					"message": `Failed to add ${newName} to phonebook`,
					"type": "error"
				}));
				setTimeout(() => {
					setMessage(null)
				}, 5000)
			})
	  }
	  else if (nameExists && window.confirm(`${newName} is already added to phonebook, replace the old number with the new one?`)) {
		const person = persons.find(p => p.name === newName)
		const id = person.id
		const updatedPerson = { ...person, number: newNumber }
		
		phonebookService
			  .update(id, updatedPerson)
			  .then(returnedPerson => {
				setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
				setNewName('')
				setNewNumber('')
				setMessage( () => ({
					"message": `Updated phone number of ${newName}`,
					"type": "message"
				}));
				setTimeout(() => {
					setMessage(null)
				}, 5000)
			  })
			  .catch(error => {
				setMessage( () => ({
					"message": `Failed to update number of ${newName}`,
					"type": "error"
				}));
				setTimeout(() => {
					setMessage(null)
				}, 5000)
			  })
	  }
	  else
	  	setMessage( () => ({
			"message": `${newName} is already added to the phone book`,
			"type": "message"
		}));
	}
  
	return (
	  <form>
		<div>name: <input value={newName} onChange={handleNewName} /></div>
		<div>number: <input value={newNumber} onChange={handleNewNumber} /></div>
		<div><button type="submit" onClick={addNewName}>add</button></div>
	  </form>
	)
}

export default PersonForm