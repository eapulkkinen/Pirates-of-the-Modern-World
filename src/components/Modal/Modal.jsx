import {useState} from 'react';
import country_codes from '../../data/country_codes';
import country_indicators from '../../data/country_indicators';
import './Modal.css';
import '../Country_Chart';
import Country_Chart from '../Country_Chart';
import Dropdown from '../Dropdown';

const Modal = (props) => {

    const [auki, setAuki] = useState(false);

    const toggleAuki = () => {
        setAuki(!auki);             // vaihtaa auki arvoa true/false
    }

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
    console.log(props.maat);

    

    return (
        <>
        <button 
        onClick={toggleAuki}
        className='modalNappi'>Click for more info on chosen country</button>

        
        {auki && (                      // jos auki = true, niin näytetään modal komponentti
            <div className='modal'>
            <div 
            onClick={toggleAuki}
            className='overlay'></div>  

            <div className='modalSisalto'>
                <Dropdown content={props.maat}/>
                <p> {palautaNimeaVastaavaKoodi('Somalia')} </p>
                <>
                <Country_Chart indikaattorit={testiData}/>
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