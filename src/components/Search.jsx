import { useState } from 'react';


// TODO: korjaa -> haku lisää automaattisesti esim Finland, kun sen kirjoittaa ilman enterin painamista, tai muuta lisäämistä
const Search = ({ onSearch, suggestions, setSuggestions, onToggleAllCountries }) => {
    const [hakusana, setHakusana] = useState('');       //hakusana ja sen muuttamisfunktio
    const [showAll, setShowAll] = useState(false);      //apumuuttuja kaikkien maiden näyttämiselle

    /**
     * Hakupalkin muutos otetaan talteen valueen ja
     * se asetetaan hakusanaksi. 
     * @param {*} e tapahtuma 
     */
    const handleChange = (e) => {
        const value = e.target.value
        setHakusana(value);
        onSearch(value);
    };


    /**
     * Hakuehdotuksen valinnan käsittely
     * @param {*} suggestion klikattu hakuehdotus 
     */
    const handleSuggestionClick = (suggestion) => {
        onSearch(suggestion);
        setHakusana('');    //hakusana kenttä tyhjennetään
        setSuggestions([]); //ehdotukset pois
    };
    

    /**
     * Haun käsittely, kun painetaan Search.
     */
    const handleSearch = () => {
        onSearch(hakusana);
        setHakusana('');
    };


    /**
     * Checkboxin käsittely
     * @param {*} e checkbox tilanvaihdos-tapahtuma 
     */
    const handleCheckboxChange = (e) => {
        const isChecked = e.target.checked;
        setShowAll(isChecked);
        onToggleAllCountries(isChecked);    //Pääohjelmaan tieto tilasta

        //Jos checkbox chekattu
        if (isChecked) {
            setSuggestions([]); 
        }  
    };


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