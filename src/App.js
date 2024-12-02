import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [search, setSearch] = useState('');
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [error, setError] = useState('');

  // Fetch initial Pokémon list
  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=50');
        const results = response.data.results;

        // Fetch details for each Pokémon
        const detailedPokemon = await Promise.all(
          results.map((pokemon) => axios.get(pokemon.url).then((res) => res.data))
        );

        setPokemonList(detailedPokemon);
        setFilteredPokemon(detailedPokemon); // Initially display all Pokémon
      } catch (err) {
        console.error(err);
      }
    };

    fetchPokemonList();
  }, []);

  // Handle Search
  const handleSearch = (e) => {
    setSearch(e.target.value);

    if (e.target.value === '') {
      setFilteredPokemon(pokemonList); // Reset to all Pokémon
    } else {
      const filtered = pokemonList.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilteredPokemon(filtered);
    }
  };

  return (
    <div className="App">
      <h1>Pokémon Search</h1>

      {/* Search Input */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search Pokémon by name"
          value={search}
          onChange={handleSearch}
        />
      </div>

      {/* Error Message */}
      {error && <p className="error">{error}</p>}

      {/* Pokémon Cards */}
      <div className="card-container">
        {filteredPokemon.map((pokemon) => (
          <div className="card" key={pokemon.id}>
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
            />
            <h2>{pokemon.name.toUpperCase()}</h2>
            <p><strong>Height:</strong> {pokemon.height}</p>
            <p><strong>Weight:</strong> {pokemon.weight}</p>
            <p><strong>Abilities:</strong></p>
            <ul>
              {pokemon.abilities.map((ability) => (
                <li key={ability.ability.name}>{ability.ability.name}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
