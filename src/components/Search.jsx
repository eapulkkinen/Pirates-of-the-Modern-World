import { useState } from 'react';

const Search = ({ onSearch }) => {
    const [hakusana, setHakusana] = useState('');

    const handleChange = (e) => {
        setHakusana(e.target.value);
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
            </div>
    )
}


export default Search;