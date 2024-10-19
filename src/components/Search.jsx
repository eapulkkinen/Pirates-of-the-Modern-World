import { useState } from 'react';


// TODO: korjaa -> haku lisää automaattisesti esim Finland, kun sen kirjoittaa ilman enterin painamista, tai muuta lisäämistä
const Search = ({ onSearch, suggestions, setSuggestions }) => {
    const [hakusana, setHakusana] = useState('');


    const handleChange = (e) => {
        const value = e.target.value
        setHakusana(value);
        onSearch(value);
    };

    const handleSuggestionClick = (suggestion) => {
        onSearch(suggestion);
        setHakusana('');
        setSuggestions([]);
      };
    

    const handleSearch = () => {
        onSearch(hakusana);
        setHakusana('');
    }


    return (
            <div>
                <input 
                    type="text" 
                    value = {hakusana}
                    placeholder="Search for a country" 
                    onChange={handleChange}>
                </input>
                <button onClick={handleSearch} type="submit">Search</button>
                {suggestions.length > 0 && (
                <ul>
                {suggestions.map((suggestion, index) => (
                    <li 
                    key={index}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleSuggestionClick(suggestion);
                    }}
                    style={{ cursor: 'pointer' }}
                    >
                    {suggestion}
                    </li>
                ))}
                </ul>
                )}
                
            </div>
    )
}


export default Search;