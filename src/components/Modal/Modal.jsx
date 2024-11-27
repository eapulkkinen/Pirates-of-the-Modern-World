import {useState, useEffect} from 'react';
import country_codes from '../../data/country_codes';
import country_indicators from '../../data/country_indicators';
import './Modal.css';
import '../Country_Chart';
import Country_Chart from '../Country_Chart';

/**
 * tekee dropdown valikon ja muuttaa modalin tilaa parametrina tuodulla funktiolla
 * @param {function} param0 modalin tilaa vaihtava funktio
 * @returns dropdown valikon
 */
const IndicatorDropdown = ({onIndicatorChange}) =>  {

    return (

            <select onChange={e => onIndicatorChange(e.target.value)}>
                <option value="all_attacks">All attacks</option>
                <option value="corruption_index">Corruption Index</option>
                <option value="homicide_rate">Homicide Rate</option>
                <option value="GDP">GDP</option>
                <option value="total_fisheries_per_ton">Fisheries Production Per Ton</option>
                <option value="total_military">Total Military</option>
                <option value="population">Population</option>
                <option value="unemployment_rate">Unemployment Rate</option>
                <option value="totalgr">Total Government Revenue</option>
                <option value="industryofgdp">Industry of GDP</option>
            </select>

    );
}

/**
 * The base idea for this component was learned from this video:
 * https://www.youtube.com/watch?v=9DwGahSqcEc At 0:24 in the video the author states: "You can find the 
 * source code in the description (of the video) and reuse it as you want." Video seen on 14.11.2025.
 * @param {*} props maat = taulukko valituista maista
 * @returns Modaali ikkunan
 */
const Modal = (props) => {

    const [valittuIndikaattori, setValittuIndikaattori] = useState("");
    const [valittuMaa, setValittuMaa] = useState("");
    const [auki, setAuki] = useState(false);

    const handleCountryChange = (e) => {
        setValittuMaa(e.target.value);
    }

    const handleIndicatorChange = (selectedIndicator) => {
        setValittuIndikaattori(selectedIndicator);
    }

    const toggleAuki = () => {
        if (props.maat.length > 0){   // jos väh. 1 valittu maa, vaihtaa auki arvoa true/false
            setAuki(!auki);
            //samalla tarkastetaan, jos on valittu vain 1 maa ja tällöin
            //se asetetaan automaattisesti tarkasteltavaksi
            if (props.maat.length === 1) {
                setValittuMaa(props.maat[0]);
            }
            else {
                setValittuMaa("");
            }
        } else {
            alert("Please select a country");
        }
    }

    //country_codes tiedostosta filtteröity taulukko valituista maista
    const valitutMaat = country_codes.filter(maa => {
        return props.maat.includes(maa.country_name);
    })

    /**
    * Hakee maan nimeä vastaavan maakoodin
    * @param {string}  nimi maan nimi
    * @returns maan nimeä vastaavan maatunnisteen "Finland" ==> "FIN"
    */
    const palautaNimeaVastaavaKoodi = (nimi) => {
          const potentialCountryCode = country_codes.find(koodi => koodi.country_name === nimi);   
          //find palauttaa undefined => 'unknown' tai löydetyn koodin 'FIN'
          const countryCode = potentialCountryCode ? potentialCountryCode.country : 'Unknown';
          return countryCode;
        
        };

    /**
     * Hakee maakoodia vastaavan maan indikaattorit country_indikators tiedostosta
     * @param {string} maakoodi valitun maan maakoodi
     * @returns halutun maan indikaattorit
     */
    const haeMaanIndikaattorit = (maakoodi) => {
        const maanIndikaattorit = country_indicators.filter(indikaattori => {
            return maakoodi.includes(indikaattori.country);
        })
        return maanIndikaattorit;
    }


    return (
        <>
        <button 
        onClick={toggleAuki}
        className='modalNappi'>Click for more info on chosen countries</button>

        
        {auki && (                      // jos auki = true, niin näytetään modal komponentti
            <div className='modal'>
            <div 
            onClick={toggleAuki}
            className='overlay'></div>  

            <div className='modalSisalto'>
                <select onChange={handleCountryChange} value={valittuMaa} >
                    <option id="valittuoption" value="">Select a country</option>
                    {props.maat.map((option, index) => (
                        <option key={index} value={option}>
                         {option}
                        </option>
                    ))}
                </select>
                <IndicatorDropdown onIndicatorChange={handleIndicatorChange}/>
                <p> {valittuMaa} </p>
                <>
                <Country_Chart indikaattorit={haeMaanIndikaattorit(palautaNimeaVastaavaKoodi(valittuMaa))} valittuIndikaattori={valittuIndikaattori}/>
                </>
                <button
                className='modalSulkuNappi'
                onClick={toggleAuki}
                >CLOSE</button>
            </div>

        </div>

        )}
        
        </>
    );
}

export default Modal;