import React, { useState, useEffect} from 'react'
import axios from 'axios'
import './App.css'
 
const Find = ({ filter, handleFilter }) => <div>filter shown with <input value={filter} onChange={handleFilter} /></div>

const useFilter = (data, filter) => {
	const filtered = data.filter(country => country['name'].toLowerCase().includes(filter.toLowerCase()))
  return filtered
}

const Weather = ({country}) => {
  const [weatherData, setWeatherData] = useState([])

  useEffect(() => {
    console.log('in weather data');
    axios
      .get(`http://api.weatherstack.com/current?access_key=${process.env.REACT_APP_WEATHER_API}&query=${country.capital}`)
      .then(response => {
        setWeatherData(response.data)
      })
  }, [country.capital])
  console.log('wd: ', weatherData)

  if (weatherData.current) {
    return (
      <div>
        <h3>Weather in {country.capital}</h3>
        <div><b>temperature:</b> {weatherData.current.temperature} Celcius</div>
        <img src={weatherData.current.weather_icons[0]} alt={weatherData.current.weather_descriptions[0]}></img>
        <div><b>wind:</b> {weatherData.current.wind_speed} mph direction {weatherData.current.wind_dir}</div>
      </div>
    )
  }
  return <div></div>
}

const Country = ({ country, setFilter }) => {
  const showCountryInfo = () => {
    console.log('here')
    setFilter(country.name)
  }

  return (
    <div>{country.name}<button onClick={showCountryInfo}>show</button></div>
  )
}

const Countryinfo = ({ country }) => {

  return (
    <div>
      <h1>{country.name}</h1>
      <div>capital {country.capital}</div>
      <div>population {country.population}</div>
      <h3>Spoken languages</h3>
      <ul>{country.languages.map((language, i) =>
        <li key={i}>{language.name}</li>)}
      </ul>
      <img src={country.flag} alt={country.name}></img>
      <Weather country={country} />
      </div>
  )
}

const Countries = ({ data, filter, setFilter }) => {
  const filtered = useFilter(data, filter)

  if (filtered.length > 10)
    return <div>Too many matches, specify another filter</div>
  else if (filtered.length === 1)
    return <Countryinfo country={filtered[0]} />
  else {
    return (
      <>
        {filtered.map(country =>
          <Country key={country.name} country={country} setFilter={setFilter} />
        )}
      </>
    )
  }
}

const App = () => {
  const [data, setData] = useState([])
  const [filter, setNewFilter] = useState('')

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setData(response.data)
      })
  }, [])

  const handleFilter = (event) => setNewFilter(event.target.value)

  return (
    <div>
      <Find filter={filter} handleFilter={handleFilter} />
      <Countries data={data} filter={filter} setFilter={setNewFilter} />
    </div>
  )
}

export default App;
