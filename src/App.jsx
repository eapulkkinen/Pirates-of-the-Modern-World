/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import './App.css';
import Map from './components/Map';
import Slider from './components/Slider';
import Footer from './components/Footer';
import Search from './components/Search';
import country_codes from './data/country_codes';
import pirate_attacks from './data/pirate_attacks';


  function App() {
    const [koordinaattiLista, setKoordinaatit] = useState([]);
    const [hakusyote, setHaku] = useState('');
    const [maat, setMaat] = useState([]);
    const [vuosi, setVuosi] = useState('1993');
    const [suggestions, setSuggestions] = useState([]);

    const maaTaulukko = country_codes.map(i => i.country_name);

    const countryCodeMap = country_codes.reduce((accumulator, { country_name, country }) => {  // [ {"country": "Finland", "countrycode": "FIN"}, ...]
      accumulator[country_name] = country;
      return accumulator;
    }, {});


    useEffect(() => {
      if (maat.length > 0) {
        const tapahtumat = haeTapahtumatVuodella();   //kaikki hyökkäykset jotka vastaa valittua vuotta
        const maakoodit = maat.map(maa => countryCodeMap[maa]);
        const maidenTapahtumat = suodataMaidenTapahtumat(tapahtumat, maakoodit);
        console.log(`Maiden ${maakoodit} tapahtumat vuonna ${vuosi}:`, maidenTapahtumat);
        console.log('Kaikki suodatettavat maat:', maat);
      }
    }, [maat]); //kun maat muuttuu tehdään tämä useEffect


    const haeKoordinaatit = () => {
      //Oikeasti tässä kohtaa haettaisi databasesta tmv. koordinaatit

      //setKoordinaatit(koordinaatit); //Map.jsx "kutsu"
    };


    const haeTapahtumatVuodella = () => {
      const tapahtumat = pirate_attacks.filter(hyokkays => {
        const hyokkaysVuosi = hyokkays.date.split('-')[0];
        return vuosi === hyokkaysVuosi.toString();
      });
      console.log(`Kaikki vuonna ${vuosi} tapahtuneet hyökkäykset:`, tapahtumat)
      return tapahtumat;
    };

    
    const suodataMaidenTapahtumat = (tapahtumat, maakoodit) => {
      const maidenTapahtumat = tapahtumat.filter(hyokkays => {
        return maakoodit.includes(hyokkays.nearest_country); 
      });
      return maidenTapahtumat;
    };
  

    const handleHaku = (hakusana) => {
      setHaku(hakusana);
  
      const maaList = hakusana.split(',').map(maa => maa.trim());
      
      const uniqMaat = new Set(maat);

      const maaSet = new Set(maaTaulukko);

      const realMaat = maaList.filter(maa => maaSet.has(maa))
  
      const newMaat = realMaat.filter(maa => !uniqMaat.has(maa));
  
      setMaat((maatEnnenLisaysta => [...maatEnnenLisaysta, ...newMaat]));

      if (hakusana.length > 0) {
        const filteredSuggestions = maaTaulukko.filter(maa => 
          maa.toLowerCase().startsWith(hakusana.toLowerCase())
        );
        setSuggestions(filteredSuggestions);
      } else {
        setSuggestions([]);
      }
  
      console.log('Syötetyt maat:', newMaat);
    }
  

    const handleSlider = (newVuosi) => {
      setVuosi(newVuosi);
      console.log('Valittu vuosi:', newVuosi);
    }
  

    const handleMaaPoisto = (poistettavaMaa) => {
      console.log('Maat ennen poistoa:', maat);
      setMaat(maatEnnenPoistoa => {
        const uudetMaat = maatEnnenPoistoa.filter(maa => maa !== poistettavaMaa);
        console.log('Maat poiston jälkeen:', uudetMaat);
        return uudetMaat;
      });
    }
  

    return (
      <>
        <div id="header">Main view</div>
        <div id="maindiv">
          <div id="vasendiv" className="sivudiv">
            <Search onSearch={handleHaku} suggestions={suggestions} />
            
            {maat.length > 0 && (
              <ul>
                {
                  maat.map((maa, index) => (
                    <li key={index}>
                      {maa}
                      <button 
                        onClick={() => handleMaaPoisto(maa)}
                        style={{ marginLeft: '10px', cursor: 'pointer'}}> &#x2716;
                      </button>
                    </li>
                  ))
                }
              </ul>
            )}
          </div>
          <div id="karttadiv">
            <Map koordinaattiLista={koordinaattiLista} />
          </div>
          <div id="oikeadiv" className="sivudiv">
            <p>Event information</p>
          </div>
        </div>
        <Slider onChange={handleSlider} vuosi={vuosi}/>
        <Footer />
      </>
    );
  }
  
  export default App;
  
