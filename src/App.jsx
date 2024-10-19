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
    const [koordinaattiLista, setKoordinaatit] = useState([]);  // listan alkiot tyyppiä {longitude, latitude, countrycode}
    const [hakusyote, setHaku] = useState('');
    const [maat, setMaat] = useState([]);
    const [vuosi, setVuosi] = useState('1993');
    const [suggestions, setSuggestions] = useState([]);

    const maaTaulukko = country_codes.map(i => i.country_name); //hakee datasta löytyvät maiden nimet taulukkoon ["Aruba","Afghanistan", ...]

    const countryCodeMap = country_codes.reduce((accumulator, { country_name, country }) => {  // [ {"country": "Finland", "countrycode": "FIN"}, ...]
      accumulator[country_name] = country;
      return accumulator;
    }, {});


    /**
     * Kartan päivitys.
     * Tapahtuu AINA kun valitut maat tai vuosi muuttuu.
     */
    useEffect(() => {
      if (maat.length > 0) {
        const hyokkaykset = haeHyokkayksetVuodella();   //kaikki hyökkäykset jotka vastaa valittua vuotta
        const maakoodit = maat.map(maa => countryCodeMap[maa]);
        const maidenHyokkaykset = suodataMaidenHyokkaykset(hyokkaykset, maakoodit);
        console.log(`Maiden ${maakoodit} hyokkäykset vuonna ${vuosi}:`, maidenHyokkaykset);
        console.log('Kaikki suodatettavat maat:', maat);

        //Hyökkäysten koordinaatit, jotta "piirto"funktio on selvempi
        const hyokkaystenKoordinaatit = maidenHyokkaykset.map(hyokkays => ({
          longitude: hyokkays.longitude,
          latitude: hyokkays.latitude,
          countrycode: hyokkays.country
        }));

        setKoordinaatit(hyokkaystenKoordinaatit); //parametri : ([{longitude:15.25125, latitude:65.2315}, ...])
      }
    }, [maat, vuosi]); //kun maat TAI vuosi muuttuu


    /**
     * Hakee hyökkäysdatasta kaikki hyökkäykset,
     * jotka on tapahtunut samana vuonna kuin käyttäjän
     * valitsema sliderin arvo.
     * @returns Taulukon hyökkäyksistä, jotka tapahtuneet valittuna vuonna
     */
    const haeHyokkayksetVuodella = () => {
      const hyokkaykset = pirate_attacks.filter(hyokkays => {
        const hyokkaysVuosi = hyokkays.date.split('-')[0];
        return vuosi === hyokkaysVuosi.toString();
      });
      console.log(`Kaikki vuonna ${vuosi} tapahtuneet hyökkäykset:`, hyokkaykset)
      return hyokkaykset;
    };


    /**
     * Suodattaa hyökkäykset maakoodien perusteella.
     * Valitsee siis hyökkäykset, jotka ovat tapahtuneet
     * valituissa maissa. Valinta tapahuu maakoodien avulla.
     * @param {*} hyokkaykset Taulukko hyökkäyksistä
     * @param {*} maakoodit Taulukko maakoodeista
     * @returns Taulukon valittujen maiden hyökkäyksistä ja hyökkäysten tiedoista
     */
    const suodataMaidenHyokkaykset = (hyokkaykset, maakoodit) => {
      const maidenHyokkaykset = hyokkaykset.filter(hyokkays => {
        return maakoodit.includes(hyokkays.nearest_country); 
      });
      return maidenHyokkaykset;
    };
  

    /**
     * Käsittelee hakusanan ja hakupalkin logiikkaa.
     * Kutsuu ehdotuksien luontia ja lisää datasta
     * löytyvät haetut maat valituiksi.
     * @param {*} hakusana Hakuun syötetty merkkijono
     */
    const handleHaku = (hakusana) => {
      setHaku(hakusana);
  
      const maaList = hakusana.split(',').map(maa => maa.trim()); // "suomi, ruotsi,   norja" --> ["suomi", "ruotsi", "norja"]
      
      const uniqMaat = new Set(maat);     //poistaa duplikaatit maaListasta

      const maaSet = new Set(maaTaulukko);

      const realMaat = maaList.filter(maa => maaSet.has(maa))   //syötetyt maat suodatetaan datasta löytyvistä maista
  
      const newMaat = realMaat.filter(maa => !uniqMaat.has(maa));   //varmistetaan ettei näissä duplikaatteja
  
      setMaat((maatEnnenLisaysta => [...maatEnnenLisaysta, ...newMaat]));   //mahdollisiin ennalta valittuihin lisätään newMaat

      if (hakusana.trim().length > 0) {  //Käsitellään hakuehdotukset -> hakusanalla alkava maa löytyy datasta
        const filteredSuggestions = maaTaulukko.filter(maa => 
          maa.toLowerCase().startsWith(hakusana.trim().toLowerCase())
        );
        setSuggestions(filteredSuggestions);
      } else {
        setSuggestions([]);
      }
  
      console.log('Syötetyt maat:', newMaat);
    }
  

    /**
     * Sliderin arvo talteen ja asetetaan se käytettäväksi vuodeksi
     * @param {*} newVuosi Sliderista valittava vuosi
     */
    const handleSlider = (newVuosi) => {
      setVuosi(newVuosi);
      console.log('Valittu vuosi:', newVuosi);
    }
  

    /**
     * Maan poistaminen valituista maista
     * @param {*} poistettavaMaa poistettava maa-objekti  
     */
    const handleMaaPoisto = (poistettavaMaa) => {
      console.log('Maat ennen poistoa:', maat);
      setMaat(maatEnnenPoistoa => {   //Valituiksi maiksi asetetaan alla tapahtuvan return
        const uudetMaat = maatEnnenPoistoa.filter(maa => maa !== poistettavaMaa); //luodaan uusi taulukko, joka ei sisällä poistettavaa maata
        console.log('Maat poiston jälkeen:', uudetMaat);

        // poistettujen maiden koordinaattien poisto kartalta
        const hyokkaykset = haeHyokkayksetVuodella();
        const maaKoodi = uudetMaat.map(maa => countryCodeMap[maa]);
        const maanHyokkaykset = suodataMaidenHyokkaykset(hyokkaykset, maaKoodi);

        const hyokkaystenKoordinaatit = maanHyokkaykset.map(hyokkays => ({
          longitude: hyokkays.longitude,
          latitude: hyokkays.latitude,
          countrycode: hyokkays.nearest_country
        }));

        setKoordinaatit(hyokkaystenKoordinaatit); //koordinaattien päivitys kartalle (eli suomeksi tässä funktiossa koordinaattien poisto)

        return uudetMaat; //periaatteessa setMaat(uudetMaat)
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
  
