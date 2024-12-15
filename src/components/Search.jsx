import { useState } from 'react';

/** 
 * This project is licensed under the CC BY-NC-SA 4.0 license. https://creativecommons.org/licenses/by-nc-sa/4.0/
 * See https://github.com/eapulkkinen/Pirates-of-the-Modern-World?tab=License-1-ov-file#readme
 * 
 * Luo hakupalkin, kaikkien maiden valinta checkboxin ja ehdotukset. Käsittelee haun- ja ehdotusten
 * toiminnan.
 */
const Search = ({ hae, ehdotukset, setEhdotukset, kaikkiMaatValittuna, asetaHakuKoko }) => {
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
        hae(syote);
    };


    /**
     * Hakuehdotuksen valinnan käsittely
     * @param {*} ehdotus klikattu hakuehdotus 
     */
    const ehdotuksenValinta = (ehdotus) => {
        hae(ehdotus);
        setHakusana('');    //hakusana kenttä tyhjennetään
        setEhdotukset([]); //ehdotukset pois
        asetaHakuKoko([]); //asetetaan hakuboxin koko defaulttiin
    };


    /**
     * Checkboxin käsittely
     * @param {*} e checkbox tilanvaihdos-tapahtuma 
     */
    const muutaCheckbox = (e) => {
        const valittu = e.target.checked;
        setNaytaKaikki(valittu);
        kaikkiMaatValittuna(valittu);

        if (valittu) {
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
                        onChange={muutaCheckbox}
                        checked={naytaKaikki}
                    />
                    Select all countries
              </label>
              {ehdotukset.length > 0 && (
                <ul className='suggestions'>
                {ehdotukset.map((ehdotus, index) => (
                    <li 
                    key={index}
                    onClick={() => {
                        ehdotuksenValinta(ehdotus);
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