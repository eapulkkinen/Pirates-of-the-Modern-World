import {useState, useEffect} from 'react';
import country_codes from '../../data/country_codes';
import country_indicators from '../../data/country_indicators';
import './Modal.css';
import '../Country_Chart';
import Country_Chart from '../Country_Chart';
import Question_Mark from '../Question_Mark';


/**
 * tekee dropdown valikon ja muuttaa modalin tilaa parametrina tuodulla funktiolla
 * @param {function} param0 modalin tilaa vaihtava funktio
 * @returns dropdown valikon
 */
const IndicatorDropdown = ({onIndicatorChange}) =>  {

    return (

            <select onChange={e => onIndicatorChange(e.target.value)}>
                <option value="">Select an indicator</option>
                <option value="corruption_index">Corruption Index</option>
                <option value="homicide_rate">Homicide Rate</option>
                <option value="GDP">GDP Per Capita</option>
                <option value="total_fisheries_per_ton">Fisheries Production</option>
                <option value="total_military">Armed Forces Personnel</option>
                <option value="population">Population</option>
                <option value="unemployment_rate">Unemployment Rate</option>
                <option value="totalgr">Total Government Revenue</option>
                <option value="industryofgdp">Industry of GDP</option>
                <option value="all_attacks">All Attacks</option>
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
    const [huomautus, setHuomautus] = useState(false);

    const handleCountryChange = (e) => {
        setValittuMaa(e.target.value);
    }

    const handleIndicatorChange = (selectedIndicator) => {
        setValittuIndikaattori(selectedIndicator);
    }

    const toggleAuki = () => {
        if (props.maat.length > 0){   // jos väh. 1 valittu maa, vaihtaa auki arvoa true/false
            setAuki(!auki);           
            setValittuIndikaattori("");        // asetetaan myös valittu indikaattori tyhjäksi
            setValittuMaa(props.maat[0]);      // asetetaan ensimmäinen valittu maa automaattisesti valituksi
            
        }
        else {
            setAuki(!auki);             //jos ei valittu yhtään maata, vaihtaa auki ja huomautus 
            setHuomautus(!huomautus);   // arvoja true/false
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

    /**
     * Valitsee valittuIndikaattoria vastaavan selitys tekstin kysymysmerkkiin
     * @returns haluttu teksti kysymysmerkille
     */
    const valitseKysymysmerkkiTeksti = () => {

        let kysymysmerkkiTeksti;
  
        switch (valittuIndikaattori) {
          case "":
            kysymysmerkkiTeksti = "Here you can choose country specific indicators to compare with attacks that have happened nearest to, or in the country.";
            break;
          case "all_attacks":
            kysymysmerkkiTeksti = 'All Attacks shows the amount of attacks in every country combined.';
            break;
          case "corruption_index": 
            kysymysmerkkiTeksti = 'Corruption Index shows the Corruption Perceptions Index scores of the country. The scale of the scores changed in 2012 and the scores before that are not comparable.';
            break;
          case "homicide_rate":
            kysymysmerkkiTeksti = 'Homicide Rate shows the amount of intentional homicides per 100,000 people.';
            break;
          case "GDP":
            kysymysmerkkiTeksti = 'GDP Per Capita shows the gross domestic product per capita of the country in US dollars.';
            break;
          case "total_fisheries_per_ton":
            kysymysmerkkiTeksti = 'Fisheries Production shows the total volume (metric tons) of aquatic species caught/harvested by a country.';
            break;
          case "total_military":
            kysymysmerkkiTeksti = 'Armed Forces Personnel shows the amount of active duty military personnel in the country.';
            break;
          case "population":
            kysymysmerkkiTeksti = 'Population shows the total population of the country.';
            break;
          case "unemployment_rate":
            kysymysmerkkiTeksti = 'Unemployment Rate shows the percentage of total labor force of the country that is without work.';
            break;
          case "totalgr":
            kysymysmerkkiTeksti = 'Total Government Revenue shows the proportion of GDP that goes to the government of the country.';
            break;
          case "industryofgdp":
            kysymysmerkkiTeksti = 'Industry of GDP shows the proportion of GDP that is generated by industry including construction.';
            break;
        }
  
        return kysymysmerkkiTeksti;
      }


    return (
        <>
        <button 
        onClick={toggleAuki}
        className='modalNappi'>Click here for more info on chosen countries</button>

        
        {auki && !huomautus && (                      // jos auki = true ja huomautus false, niin näytetään modal
            <div className='modal'>                   
            <div 
            onClick={toggleAuki}
            className='overlay'></div>  

            <div className='modalSisalto'>
                <select onChange={handleCountryChange} value={valittuMaa} >
                    {props.maat.map((option, index) => (
                        <option key={index} value={option}>
                         {option}
                        </option>
                    ))}
                </select>
                <IndicatorDropdown onIndicatorChange={handleIndicatorChange}/>
                <Question_Mark ikoni={'?'}teksti={valitseKysymysmerkkiTeksti()}/>
                <p> {valittuMaa} </p>
                <>
                <Country_Chart maa={valittuMaa} indikaattorit={haeMaanIndikaattorit(palautaNimeaVastaavaKoodi(valittuMaa))} valittuIndikaattori={valittuIndikaattori}/>
                </>
                <button
                className='modalSulkuNappi'
                onClick={toggleAuki}
                >CLOSE</button>
            </div>

        </div>

        )}

        {auki && huomautus &&(      // jos auki ja huomautus true, näytetään huomautus
            <div className='modal'>
            <div 
            onClick={toggleAuki}
            className='overlay'></div>  

            <div className='huomSisalto'>
                
                <p className='huomTeksti'>Please select a country!</p>
                
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