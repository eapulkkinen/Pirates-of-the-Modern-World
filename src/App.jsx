/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from 'react';
import './App.css';
import Map from './components/Map';
import Slider from './components/Slider';
import Header from './components/Header';
import Footer from './components/Footer';
import Search from './components/Search';
import SelectedCountries from './components/SelectedCountries';
import country_codes from './data/country_codes';
import pirate_attacks from './data/pirate_attacks';
import country_indicators from './data/country_indicators';
import Modal from './components/Modal/Modal'


function App() {
  const [koordinaattiLista, setKoordinaatit] = useState([]);  // listan alkiot tyyppiä {longitude, latitude, countrycode}
  const [hakusyote, setHaku] = useState('');
  const [maat, setMaat] = useState([]);
  const [vuosi, setVuosi] = useState('1993');
  const [suggestions, setSuggestions] = useState([]);
  const [paivita, setPaivita] = useState(true); // boolean jolla estetään päivittyminen kesken haun

  let maaTaulukko = country_codes.map(i => i.country_name); //hakee datasta löytyvät maiden nimet taulukkoon ["Aruba","Afghanistan", ...]
  maaTaulukko = maaTaulukko.sort();
  let valitsemattomatMaat = maaTaulukko;
  const countryCodeMap = country_codes.reduce((accumulator, { country_name, country }) => {  // [ {"country": "Finland", "countrycode": "FIN"}, ...]
    accumulator[country_name] = country;
    return accumulator;
  }, {});

  /**
   * Kartan päivitys.
   * Tapahtuu AINA kun valitut maat tai vuosi muuttuu.
   */
  useEffect(() => {
    if (!paivita) { // Ei suoriteta jos paivita = false
      setPaivita(true);
      return;
    }

    if (maitaValittu()) {
      const sortatutMaakoodit = palautaMaidenKooditNimella();
      const maidenHyokkaykset = haeMaidenHyokkaykset(sortatutMaakoodit);  //kaikki valittujen maiden hyökkäykset

      const hyokkaykset = yksiVuosiValittu()
        ? suodataHyokkayksetVuodella(maidenHyokkaykset) //jos yksi vuosi valittu, valitaan hyökkäykset sen mukaan
        : maidenHyokkaykset;  //muuten voidaan käyttää jo kaikkia haettujen maiden hyökkäyksiä

      setKoordinaatit(
        hyokkaykset.map(hyokkays => ({
          ...hyokkays,
          countryname: palautaMaakoodiaVastaavaMaa(hyokkays.nearest_country),
          eezcountryname: palautaMaakoodiaVastaavaMaa(hyokkays.eez_country),
        }))
      );
    }
  }, [maat, vuosi]);


  /**
   * Palauttaa onko yhtäkään maata valittu.
   * @returns Maita valittu => true, muuten false
   */
  const maitaValittu = () => {
    return maat.length > 0;
  };

  /**
   * Palauttaa onko valittu jokin tietty vuosi.
   * @returns Yksittäinen vuosi valittu => true, muuten false
   */
  const yksiVuosiValittu = () => {
    return !(vuosi == 'all');
  };


  /**
   * Palauttaa taulukon maakoodeista maiden nimien perusteella
   * @returns Taulukon maakoodeista
   */
  const palautaMaidenKooditNimella = () => {
    const maakoodit = maat.map(maa => countryCodeMap[maa]);
    return maakoodit;
  };


  /**
   * Hakee countrycodea vastaavan maan nimen
   * @param {string} countrycode maatunniste esim "FIN" 
   * @returns maatunnistetta vastaavan maan nimen "FIN" ==> "Finland"
   */
  const palautaMaakoodiaVastaavaMaa = (countrycode) => {
    if (countrycode !== "NA") {
      const potentialCountryName = country_codes.find(maa => maa.country === countrycode);   
      //find palauttaa undefined => 'unknown' tai löydetyn maan 'Finland'
      const countryName = potentialCountryName ? potentialCountryName.country_name : 'Unknown';
      return countryName;
    }
    else {
      return countrycode;
    }
  };


  /**
   * Palauttaa maata vastaavan maakoodin.
   * @param {string} maanNimi Maan nimi 
   * @returns Maakoodin
   */
  const palautaMaataVastaavaMaakoodi = (maanNimi) => {
    const potentialCountryName = country_codes.find(maa => maa.country_name === maanNimi);   
    const countryName = potentialCountryName ? potentialCountryName.country : 'Unknown';
    return countryName;
  };


  /**
   * Hakee maakoodien mukaan kaikki hyökkäykset joissa nearest_country
   * vastaa maakoodia.
   * @param {*} maakoodit taulukko maakoodeista ["FIN","SWE",...]
   * @returns Taulukon hyökkäyksistä, jotka vastaa maakoodeja
   */
  const haeMaidenHyokkaykset = (maakoodit) => {
    const maidenHyokkaykset = pirate_attacks.filter(hyokkays => {
      return maakoodit.includes(hyokkays.nearest_country);
    });
    return maidenHyokkaykset;
  };
  

  /**
   * Palauttaa hyökkäykset, jotka on tapahtunut valittuna vuonna/vuosina.
   * @param {*} loydetytHyokkaykset 
   * @returns Taulukon hyökkäyksistä jotka on tapahtunut valittuna vuonna
   */
  const suodataHyokkayksetVuodella = (loydetytHyokkaykset) => {
    const valittuVuosi = vuosi;
    if (valittuVuosi !== "all") { //jos syötetty yksittäinen vuosi
      const suodatetutHyokkaykset = loydetytHyokkaykset.filter(hyokkays => {
        const hyokkaysVuosi = hyokkays.date.split('-')[0];
        return vuosi === hyokkaysVuosi.toString(); 
      })
      console.log(`Kaikki vuonna ${vuosi} tapahtuneet hyökkäykset:`, suodatetutHyokkaykset);
      
      return suodatetutHyokkaykset;
    }
    else {
      return loydetytHyokkaykset;
    }
  };


  /**
   * Suodattaa hyökkäykset maakoodien perusteella.
   * Valitsee siis hyökkäykset, jotka ovat tapahtuneet
   * valituissa maissa. Valinta tapahuu maakoodien avulla.
   * @param {*} hyokkaykset Taulukko hyökkäyksistä
   * @param {*} maakoodit Taulukko maakoodeista
   * @returns Taulukon valittujen maiden hyökkäyksistä ja hyökkäysten tiedoista
   *
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
    console.log("Haettavat maat:", hakusana)
    const maaList = hakusana.split('+').map(maa => maa.trim()); // "suomi, ruotsi,   norja" --> ["suomi", "ruotsi", "norja"]
    
    const uniqMaat = new Set(maat);     //poistaa duplikaatit maaListasta
    const maaSet = new Set(maaTaulukko);
    const realMaat = maaList.filter(maa => maaSet.has(maa))   //syötetyt maat suodatetaan datasta löytyvistä maista

    const newMaat = realMaat.filter(maa => !uniqMaat.has(maa));   //varmistetaan ettei näissä duplikaatteja

    // Jos input on vain haku ja ei lisää uutta maata, asetetaa paivita = false
    // Tämä estää turhan päivittämisen ja vähentää lagia kun markkereita on paljon
    if (newMaat.length == 0) { setPaivita(false); } 
    setMaat((maatEnnenLisaysta => [...maatEnnenLisaysta, ...newMaat]));   //mahdollisiin ennalta valittuihin lisätään newMaat
    
    if (hakusana.trim().length > 0) {  //Käsitellään hakuehdotukset
      const viimeinenSyotettyMaa = maaList[maaList.length - 1].trim(); //jos on syötetty useampi maa, ehdotuksiin näytetään viimeisimmän ehdotus
      
      //jos syöte ei ole vain tyhjää eli esim "Suomi +     " vaan vaikka "Suomi +     Ruotsi" niin mennään if sisään
      if (viimeinenSyotettyMaa.trim() !== '') {
          if (maat.length > 0) valitsemattomatMaat = valitsemattomatMaat.filter(maa => !maat.includes(maa)); //kun maita on valittu, valitut poistetaan ehdotuksista
        const filteredSuggestions = valitsemattomatMaat.filter(maa => 
          maa.toLowerCase().startsWith(viimeinenSyotettyMaa.trim().toLowerCase())
        );
        setSuggestions(filteredSuggestions);
        asetaHakuKoko(filteredSuggestions); //asetetaan hakuboxin koko hakuehdotuksien määrän mukaan
      }
      //Jos syötetty tyhjää + merkin jälkeen eli esim "Suomi +      "
      else {
        setSuggestions([]);
        asetaHakuKoko([]); //asetetaan hakuboxin koko defaulttiin
      }
      // Jos haussa ei muuta kuin tyhjää
    } else {
      setSuggestions([]);
      asetaHakuKoko([]); //asetetaan hakuboxin koko defaulttiin
    }
    console.log('Syötetyt maat:', newMaat);
  };


  /**
   * Säätää hakudiv laatikon koon ehdotusten mukaan
   * Jos ehdotuksia ei ole palataan perustilaan
   * @param {array} taulukko Ehdotukset 
   */
  const asetaHakuKoko = (taulukko) => {
    const hakuDiv = document.getElementById("searchdiv"); // haun ja valittujen maiden div joilla säädetään ulkonäköä

    console.log(taulukko);
    if (taulukko.length == 0) { // Ei ehdostuksia eli asetetaan default numerot
      hakuDiv.style.height = "8.8%";
    } 
    else {
      let x = 14.8 + taulukko.length * 3.89; // Hakudiv isommaksi kerrottuna ehdotusten määrällä
      if (x > 70) { x = 70; } // Jos ehdotuksia on liikaa asetetaan maksimi
      hakuDiv.style.height =  x + "%";
    }
  };


  /**
   * Kaikkien maiden checkboxin toiminta maiden taulukointiin
   * ja näyttöön tapahtuu täällä. 
   * Jos checkbox = checked, niin kaikki maat asetetaan valituiksi.
   * Jos sen tila muuttuu checked => unchecked kaikki maat poistetaan
   * valituista 
   * @param {*} isChecked tieto onko checkboxin tilasta
   */
  const handleToggleAllCountries = (isChecked) => {
    if (isChecked) {
      setMaat(maaTaulukko)
    }
    else {
      console.log("Ei chekattu, poistetaan:", maat)
      setMaat([]);
      setKoordinaatit([]);
    }
  };


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
    console.log('Poistettava maa', poistettavaMaa)
    
    setMaat(maatEnnenPoistoa => {   //Valituiksi maiksi asetetaan alla tapahtuvan return
      const uudetMaat = maatEnnenPoistoa.filter(maa => maa !== poistettavaMaa); //luodaan uusi taulukko, joka ei sisällä poistettavaa maata
      console.log('Maat poiston jälkeen:', uudetMaat);
      // poistettujen maiden koordinaattien poisto kartalta
      let hyokkaykset;
      
      if (vuosi === "all") {
        hyokkaykset = haeMaidenHyokkaykset([poistettavaMaa]);
        console.log('Vuosi : all')
      }
      else {
        const maanHyokkaykset = haeMaidenHyokkaykset([poistettavaMaa]);
        hyokkaykset = suodataHyokkayksetVuodella(maanHyokkaykset);
      }
      
      const maaKoodi = uudetMaat.map(maa => countryCodeMap[maa]);
      const maanHyokkaykset = suodataMaidenHyokkaykset(hyokkaykset, maaKoodi);
      const hyokkaystenKoordinaatit = maanHyokkaykset.map(hyokkays => ({
        longitude: hyokkays.longitude,
        latitude: hyokkays.latitude,
        time: hyokkays.time,
        date: hyokkays.date,
        countrycode: hyokkays.nearest_country
      }));
      
      setKoordinaatit(hyokkaystenKoordinaatit); //koordinaattien päivitys kartalle (eli suomeksi tässä funktiossa koordinaattien poisto)
      
      return uudetMaat; //periaatteessa setMaat(uudetMaat)
    });
  }


  /**
   * Hakee maan hyökkäysten määrän valittuna vuonna
   * @param {*} country maa jonka hyökkäyksiä käsitellään
   * @returns valitun maan hyökkäykset valittuna vuonna
   */
  const getAttackCount = (country) => {
    const countryCode = palautaMaataVastaavaMaakoodi(country);
    let count = 0;
    let hyokkaykset = haeMaidenHyokkaykset(countryCode);
    if (hyokkaykset.length == 0) { return 0; } // Ei hyökkäyksiä
    if (vuosi === "all") { return hyokkaykset.length; } // Palautetaan kaikki maan hyökkäykset
    for (let i = 0; i < hyokkaykset.length; i++) {
      if (hyokkaykset[i].date.slice(0, 4) == vuosi) { count++; }
      // Hyökkäykset ovat vuosijärjestyksessä datassa, eli jos data on päässyt seuraavaan vuoteen
      // Keskeytetään toiminta
      if (hyokkaykset[i].date.slice(0, 4) > vuosi) { break; } 
    }
    
    return count;
  }


  return (
    <>
      <Header vuosi={vuosi}/>
      <div id="maindiv">
        <div id="vasendiv" className="sivudiv">
          <Search
            onSearch={handleHaku} 
            suggestions={suggestions} 
            setSuggestions={setSuggestions} 
            onToggleAllCountries={handleToggleAllCountries}
            asetaHakuKoko={asetaHakuKoko}
          />
          <div id="valitutmaat" className="valitutMaat">
            {maat.length > 0 && (
              <SelectedCountries
                maat={maat}
                getAttackCount={getAttackCount}
                handleMaaPoisto={handleMaaPoisto}
              />
            )}
          </div>
          <div id="hyokkayslkm" className='hyokkayslkm'>
            {
              maat.length > 0 && (
                <p>
                  Number of attacks with selected
                  options : {koordinaattiLista.length}
                </p>
              )}
          </div>
        </div>
        <div id="karttadiv">
          <Map koordinaattiLista={koordinaattiLista} />
        </div>
        <div id="oikeadiv" className="sivudiv">
          <div className="oikeadiv">
            <Modal maat={maat}/>
            <p id="eventinformation">Event information</p>
            <div id="infobox"></div>
          </div>
        </div>
      </div>
      <Slider onChange={handleSlider} vuosi={vuosi}/>
      <Footer />
    </>
  );
}
  
export default App;