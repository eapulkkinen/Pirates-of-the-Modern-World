import {useState} from 'react';
import country_codes from '../../data/country_codes';
import country_indicators from '../../data/country_indicators';
import './Modal.css';
import '../Country_Chart';
import Country_Chart from '../Country_Chart';
import Dropdown from '../Dropdown';

const IndicatorDropdown = ({onIndicatorChange}) =>  {

    return (
        <label>
            Pick a country Indicator: 
            <select onChange={e => onIndicatorChange(e.target.value)}>
                <option value={"corruption_index"}>Corruption Index</option>
                <option value="homicide_rate">Homicide Rate</option>
                <option value="GDP">GDP</option>
                <option value="total_fisheries_per_ton">Fisheries Production Per Ton</option>
                <option value="total_military">Total Military</option>
                <option value="population">Population</option>
                <option value="unemployment_rate">Unemployment Rate</option>
                <option value="totalgr">Total Government Revenue</option>
                <option value="industryofgdp">INdustry of GDP</option>
            </select>
        </label>
    );
}

const Modal = (props) => {


    const [valittuIndikaattori, setValittuIndikaattori] = useState("corruption_index");
    const [auki, setAuki] = useState(false);

    const handleIndicatorChange = (selectedIndicator) => {
        setValittuIndikaattori(selectedIndicator);
    }

    const toggleAuki = () => {
        setAuki(!auki);             // vaihtaa auki arvoa true/false
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

    const haeMaanIndikaattorit = (maakoodi) => {
        const maanIndikaattorit = country_indicators.filter(indikaattori => {
            return maakoodi.includes(indikaattori.country);
        })
        return maanIndikaattorit;
    }

    const testiData = haeMaanIndikaattorit('SOM');
    

    

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
                <IndicatorDropdown onIndicatorChange={handleIndicatorChange}/>
                <p> {palautaNimeaVastaavaKoodi('Somalia')} </p>
                <>
                <Country_Chart indikaattorit={testiData} valittuIndikaattori={valittuIndikaattori}/>
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