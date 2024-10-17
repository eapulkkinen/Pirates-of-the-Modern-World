import { useState } from 'react';

const Search = ({ onSearch, suggestions }) => {
    const [hakusana, setHakusana] = useState('');

    const handleChange = (e) => {
        const value = e.target.value
        setHakusana(value);
        onSearch(value);
    };

    const handleSuggestionClick = (suggestion) => {
        setHakusana(suggestion);
        onSearch(suggestion);
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
                {suggestions.length > 0 && (
                <ul>
                {suggestions.map((suggestion, index) => (
                    <li 
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    style={{ cursor: 'pointer' }}
                    >
                    {suggestion}
                    </li>
                ))}
                </ul>
                )}
                <button onClick={handleSearch} type="submit">Search</button>
            </div>
    )
}


export default Search;