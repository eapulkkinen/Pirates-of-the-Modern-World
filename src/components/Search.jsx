import { useState } from 'react';



// TODO: korjaa -> haku lisää automaattisesti esim Finland, kun sen kirjoittaa ilman enterin painamista, tai muuta lisäämistä
const Search = ({ onSearch, ehdotukset, setEhdotukset, kaikkiMaatValittuna, asetaHakuKoko }) => {
    const [hakusana, setHakusana] = useState('');       //hakusana ja sen muuttamisfunktio
    const [naytaKaikki, setNaytaKaikki] = useState(false);      //apumuuttuja kaikkien maiden näyttämiselle

    /**
     * Hakupalkin muutos otetaan talteen valueen ja
     * se asetetaan hakusanaksi. 
     * @param {*} e tapahtuma 
     */
    const kasitteleMuutos = (e) => {
        const syote = e.target.value
        setHakusana(syote);
        onSearch(syote);
    };


    /**
     * Hakuehdotuksen valinnan käsittely
     * @param {*} suggestion klikattu hakuehdotus 
     */
    const handleSuggestionClick = (suggestion) => {
        onSearch(suggestion);
        setHakusana('');    //hakusana kenttä tyhjennetään
        setEhdotukset([]); //ehdotukset pois
        asetaHakuKoko([]); //asetetaan hakuboxin koko defaulttiin
    };


    /**
     * Checkboxin käsittely
     * @param {*} e checkbox tilanvaihdos-tapahtuma 
     */
    const handleCheckboxChange = (e) => {
        const isChecked = e.target.checked;
        setNaytaKaikki(isChecked);
        kaikkiMaatValittuna(isChecked);    //Pääohjelmaan tieto tilasta

        //Jos checkbox chekattu
        if (isChecked) {
            setEhdotukset([]); 
            asetaHakuKoko([]); //asetetaan hakuboxin koko defaulttiin
        }  
    };


    return (
            <div id="searchdiv">
                <div id="searchinputjabutton">
                    <input 
                        type="text" 
                        value = {hakusana}
                        placeholder="Search for a country" 
                        onChange={kasitteleMuutos}>
                    </input>
                </div>
                <label id='showEveryCountry'>
                    <input                  
                        type="checkbox"
                        onChange={handleCheckboxChange}
                        checked={naytaKaikki}
                    />
                    Show every country
              </label>
              {ehdotukset.length > 0 && (
                <ul className='suggestions'>
                {ehdotukset.map((ehdotus, index) => (
                    <li 
                    key={index}
                    onClick={() => {
                        handleSuggestionClick(ehdotus);
                    }}
                    style={{ cursor: 'pointer' }}
                    >
                    {ehdotus}
                    </li>
                ))}
                </ul>
                )}
                
            </div>
            
    )
}


export default Search;