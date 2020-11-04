import React from 'react'

const useFilter = (persons, filter) => {
	const filtered = persons.filter(person => person['name'].toLowerCase().includes(filter.toLowerCase()))
	return filtered
}

const Name = ({ person, deletePerson }) => {
	return (
	  <div>{person.name} {person.number} <button onClick={deletePerson}>delete</button></div>
	)
}
  
const Persons = ({ persons, filter, deletePerson }) => {
	return (
	  <>
		{useFilter(persons, filter).map(person =>
		  <Name key={person.name} person={person} deletePerson={() => deletePerson(person.id)} />
		)}
	  </>
	)
}

export default Persons