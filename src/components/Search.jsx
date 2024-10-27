import { useState } from 'react';


// TODO: korjaa -> haku lisää automaattisesti esim Finland, kun sen kirjoittaa ilman enterin painamista, tai muuta lisäämistä
const Search = ({ onSearch, suggestions, setSuggestions }) => {
    const [hakusana, setHakusana] = useState('');
    const [showAll, setShowAll] = useState(false);

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
    };


    const handleCheckboxChange = (e) => {
        const isChecked = e.target.checked;
        setShowAll(isChecked);

        if (isChecked) {
            onSearch("all");
            setSuggestions([]);
        }
        
    }


    return (
            <div>
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
                        onClick={() => {
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
                <label>
                    <input                  
                        type="checkbox"
                        onChange={handleCheckboxChange}
                        checked={showAll}
                    />
                    Show every country
              </label>
                
            </div>
            
    )
}


export default Search;