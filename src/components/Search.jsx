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
                    placeholder="Hae maata" 
                    onChange={handleChange}>
                </input>
                <button onClick={handleSearch} type="submit">Hae</button>
            </div>
    )
}


export default Search;