/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from 'react';
import './App.css';
import Map from './components/Map';
import Slider from './components/Slider';
import Header from './components/Header';
import Footer from './components/Footer';
import Search from './components/Search';
import country_codes from './data/country_codes';
import pirate_attacks from './data/pirate_attacks';
import Modal from './components/Modal/Modal'


  function App() {
    const [koordinaattiLista, setKoordinaatit] = useState([]);  // listan alkiot tyyppiä {longitude, latitude, countrycode}
    const [hakusyote, setHaku] = useState('');
    const [maat, setMaat] = useState([]);
    const [vuosi, setVuosi] = useState('1993');
    const [suggestions, setSuggestions] = useState([]);

    const maaTaulukko = country_codes.map(i => i.country_name); //hakee datasta löytyvät maiden nimet taulukkoon ["Aruba","Afghanistan", ...]
    var valitsemattomatMaat = maaTaulukko;
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
        const maakoodit = maat.map(maa => countryCodeMap[maa]);
        const maidenHyokkaykset = haeMaidenHyokkaykset(maakoodit);
        const suodatetutHyokkaykset = suodataHyokkayksetVuodella(maidenHyokkaykset);
        console.log(`Maiden ${maakoodit} hyokkäykset vuonna ${vuosi}:`, suodatetutHyokkaykset);
        console.log('Kaikki suodatettavat maat:', maat);
        //Hyökkäysten koordinaatit, jotta "piirto"funktio on selvempi
        const hyokkaykset = suodatetutHyokkaykset.map(hyokkays => {
          const nearestCountryCode = hyokkays.nearest_country;
          const eezCountryCode = hyokkays.eez_country;

          const countryName = palautaMaakoodiaVastaavaMaa(nearestCountryCode);
          const eezCountryName = palautaMaakoodiaVastaavaMaa(eezCountryCode);

          return {  //palautetaan objekti jossa hyökkäyksen ominaisuudet sekä maan ja eez maan nimi
            ...hyokkays,
            countryname: countryName,
            eezcountryname: eezCountryName
          };
        });

        setKoordinaatit(hyokkaykset); //parametri : ([{longitude:15.25125, latitude:65.2315}, ...])
      }
    }, [maat, vuosi]); //kun maat TAI vuosi muuttuu


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

      /**
       * Jos countrycode on NA, niin se palautetaan. Tämä siksi, että
       * infoboxissa varmaan helppo suodattaa kaikki NA-arvoiset pois
       * tai valita niille jokin muu menettely. 
       */
      else {
        return countrycode;
      }
    };


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
      console.log(`Kaikki vuonna ${vuosi} tapahtuneet hyökkäykset:`, hyokkaykset);
      
      return hyokkaykset;
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
    }


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
      const hakuDiv = document.getElementById("searchdiv"); // haun ja valittujen maiden div joilla säädentään ulkonäköä
      const valitutMaatDiv = document.getElementById("valitutmaat");

      setHaku(hakusana);

      console.log("Haettavat maat:", hakusana)

      // Jos haku on käynnissä muutetaan laatiokoiden kokoa
      // TODO korjaa että toimii myös kun ehdotusta klikataan
      // TODO Säädä numerot paremmiksi
      const asetaHakuKoko = (taulukko) => {
        if (taulukko.length == 0) {
          hakuDiv.style.height = "8.8%";
          valitutMaatDiv.style.height = "80%";
        } else {
          let x = 8.8 + taulukko.length * 5;
          if (x > 58.8) { x = 58.8; }
          hakuDiv.style.height =  x + "%";
          valitutMaatDiv.style.height = 88.8 - x + "%";
        }
      }
      const maaList = hakusana.split('+').map(maa => maa.trim()); // "suomi, ruotsi,   norja" --> ["suomi", "ruotsi", "norja"]
      
      const uniqMaat = new Set(maat);     //poistaa duplikaatit maaListasta

      const maaSet = new Set(maaTaulukko);

      const realMaat = maaList.filter(maa => maaSet.has(maa))   //syötetyt maat suodatetaan datasta löytyvistä maista
  
      const newMaat = realMaat.filter(maa => !uniqMaat.has(maa));   //varmistetaan ettei näissä duplikaatteja
  
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
          asetaHakuKoko(filteredSuggestions);
        }
        //Jos syötetty tyhjää + merkin jälkeen eli esim "Suomi +      "
        else {
          setSuggestions([]);
          asetaHakuKoko([]);
        }
        // Jos haussa ei muuta kuin tyhjää
      } else {
        setSuggestions([]);
        asetaHakuKoko([]);
      }
      console.log('Syötetyt maat:', newMaat);
    }


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

    return (
      <>
        <Header vuosi={vuosi}/>
        <div id="maindiv">
          <div id="vasendiv" className="sivudiv">
            <div id="searchdiv" className='searchdiv'>
            <Search
              onSearch={handleHaku} 
              suggestions={suggestions} 
              setSuggestions={setSuggestions} 
              onToggleAllCountries={handleToggleAllCountries}
            />
            </div>
            <div id="valitutmaat" className="valitutMaat">
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
              <p>Event information</p>
              <p id="infobox"></p>
            </div>
          </div>
        </div>
        <Slider onChange={handleSlider} vuosi={vuosi}/>
        <Footer />
      </>
    );
  }
  
  export default App;