import { useState, useEffect } from 'react'
import phoneBookService from './phoneBookService'

const Filter = ({ value, onChange }) => {
  return (
    <div>
      filter shown with:
      <input
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

const PersonForm = ({ onSubmit, newName, setNewName, newNumber, setNewNumber }) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
        />
      </div>
      <div>number: <input
        value={newNumber}
        onChange={(event) => setNewNumber(event.target.value)}
      /></div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Person = ({ per, onClick }) => {
  return (
    <p>{per.name} - {per.number ?? 'No number'} <button onClick={onClick} >Delete</button></p>
  )
}

const Persons = ({ toShow, onClick }) => {
  return (
    <div>
      {
        toShow.length === 0 ? (
          <p>No names for now</p>
        ) : (
          toShow.map((per) => (
            <Person key={per.id} per={per} onClick={() => onClick(per.id)} />
          ))
        )
      }
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilters, setNewFilters] = useState('')

  useEffect(() => {
    phoneBookService
      .getAll()
      .then(response => {
        setPersons(response)
      })
  }, [])

  const addName = (event) => {
    event.preventDefault()
    if (newName.trim() === '') return
    const exist = persons.find(p => p.name.toLowerCase() === newName.toLowerCase())
    if (exist) {
      if (confirm(`${newName} is already in the phonebook, replace the old number with a new one?`)) {
        const personObject = { ...exist, number: newNumber }
        phoneBookService.update(exist.id, personObject)
          .then(response => {
            setPersons(prev => prev.map(p => p.id === response.id ? response : p))
            setNewName('')
            setNewNumber('')
          })
      }
    } else {
      const personObject = { name: newName, number: newNumber }
      phoneBookService.create(personObject)
        .then(response => {
          setPersons(prev => prev.concat(response))
          setNewName('')
          setNewNumber('')
        })
    }
  }

  const handleFilterChange = (event) => {
    setNewFilters(event.target.value)
  }

  const toShow = persons.filter(p =>
    p.name.toLowerCase().includes(newFilters.toLowerCase())
  )

  const removeUser = (id) => {
    if (confirm(`Delete ${persons.find(p => p.id === id).name}`)) {
      phoneBookService.remove(id)
        .then(response => {
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={newFilters} onChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm onSubmit={addName} newName={newName} setNewName={setNewName} newNumber={newNumber} setNewNumber={setNewNumber} />
      <h2>Numbers</h2>
      <Persons toShow={toShow} onClick={removeUser} />
    </div>
  )
}

export default App
