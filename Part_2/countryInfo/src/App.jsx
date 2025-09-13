import React, { useState, useEffect } from "react";
import axios from "axios";

const api_key = import.meta.env.VITE_WEATHER_API_KEY;

function App() {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [showCountry, setShowCountry] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        console.log(response.data);
        setCountries(response.data);
      });
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
    if (event.target.value === "") {
      setShowCountry(null);
      setWeather(null);
    }
  };

  const filtered = countries.filter((country) =>
    country.name.common.toLowerCase().includes(search.trim().toLowerCase())
  );

  const handleShow = (country) => {
    setShowCountry(country);
    setWeather(null);
  };

  const countryToShow =
    showCountry || (filtered.length === 1 ? filtered[0] : null);

  useEffect(() => {
    if (!countryToShow || !countryToShow.capital || !api_key) {
      setWeather(null);
      return;
    }

    const capital = countryToShow.capital[0];

    if (capital) {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`
        )
        .then((response) => {
          console.log(response.data);
          setWeather(response.data);
        })
        .catch(() => setWeather(null));
    } else {
      setWeather(null);
    }
  }, [countryToShow]);

  return (
    <>
      <div>
        find countries <input value={search} onChange={handleSearch} />
      </div>
      <div>
        {search === "" ? null : filtered.length > 10 ? (
          <p>Too many matches, specify another filter</p>
        ) : countryToShow ? (
          <div>
            <h2>{countryToShow.name.common}</h2>
            <div>Capital {countryToShow.capital}</div>
            <div>Area {countryToShow.area}</div>
            <h2>Languages</h2>
            <ul>
              {Object.values(countryToShow.languages || {}).map(
                (lang, index) => (
                  <li key={index}>{lang}</li>
                )
              )}
            </ul>
            <img src={countryToShow.flags.png} alt="flag" width="200" />
            <h2>Weather in {countryToShow.capital}</h2>
            {weather ? (
              <>
                <div>Temperature {weather.main.temp} Celsius</div>
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].description}
                />
                <div>Wind {weather.wind.speed} m/s</div>
              </>
            ) : (
              <div>Weather data not available</div>
            )}
          </div>
        ) : (
          <>
            {filtered.map((country, index) => (
              <div key={index}>
                {country.name.common}
                <button onClick={() => handleShow(country)}>show</button>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}

export default App;
