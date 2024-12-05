import { useEffect, useState } from 'react';
import './App.css';
import Map from './components/Map';
import Slider from './components/Slider';
import Header from './components/Header';
import Footer from './components/Footer';
import Search from './components/Search';
import SelectedCountries from './components/SelectedCountries';
import CountryCodes from './data/country_codes';
import PirateAttacks from './data/pirate_attacks';
import Modal from './components/Modal/Modal';


/** 
 * Tähän käyttöoikeudet  
 */
function App() {
  const [koordinaattiLista, setKoordinaatit] = useState([]);  // [ {longitude, latitude, countrycode}, ... ]
  const [maat, setMaat] = useState([]); // valitut maat [ "Afghanistan", ... ]
  const [vuosi, setVuosi] = useState('1993'); // valittu vuosi
  const [ehdotukset, setEhdotukset] = useState([]); // [ "Afghanistan", ... ]
  const [paivita, setPaivita] = useState(true); // boolean, jolla estetään päivittyminen kesken haun

  // Hakee datasta löytyvät maiden nimet taulukkoon
  let maaTaulukko = CountryCodes.map(i => i.country_name); 
  maaTaulukko = maaTaulukko.sort();
  let valitsemattomatMaat = maaTaulukko;

  // [ {"country": "Finland", "countrycode": "FIN"}, ...]
  const countryCodeMap = CountryCodes.reduce((accumulator, { country_name, country }) => {
    accumulator[country_name] = country;
    return accumulator;
  }, {});


  //Kartan päivitys AINA kun valitut maat tai vuosi muuttuu.
  useEffect(() => {
    if (!paivita) { // Ei suoriteta jos paivita === false
      setPaivita(true);
      return;
    }

    if (maitaValittu()) {
      const sortatutMaakoodit = palautaMaidenKooditNimenPerusteella();
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
  const palautaMaidenKooditNimenPerusteella = () => {
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
      //find palauttaa undefined => 'unknown' tai löydetyn maan 'Finland'
      let maanNimi = CountryCodes.find(maa => maa.country === countrycode);   
       maanNimi = maanNimi ? maanNimi.country_name : 'Unknown';
      return maanNimi;
    } else {
      return countrycode;
    }
  };


  /**
   * Palauttaa maata vastaavan maakoodin.
   * @param {string} maanNimi Maan nimi 
   * @returns Maakoodin
   */
  const palautaMaataVastaavaMaakoodi = (maanNimi) => {
    let countrycode = CountryCodes.find(maa => maa.country_name === maanNimi);   
    countrycode = countrycode ? countrycode.country : 'Unknown';
    return countrycode;
  };


  /**
   * Hakee maakoodien mukaan kaikki hyökkäykset joissa nearest_country
   * vastaa maakoodia.
   * @param {*} maakoodit taulukko maakoodeista ["FIN","SWE",...]
   * @returns Taulukon hyökkäyksistä, jotka vastaa maakoodeja
   */
  const haeMaidenHyokkaykset = (maakoodit) => {
    const maidenHyokkaykset = PirateAttacks.filter(hyokkays => {
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
    if (vuosi !== "all") { //jos valittu yksittäinen vuosi
      const suodatetutHyokkaykset = loydetytHyokkaykset.filter(hyokkays => {
        const hyokkaysVuosi = hyokkays.date.split('-')[0];
        return vuosi === hyokkaysVuosi.toString(); 
      })
      console.log(`Kaikki vuonna ${vuosi} tapahtuneet hyökkäykset:`, suodatetutHyokkaykset);
      
      return suodatetutHyokkaykset;
    }
    
    return loydetytHyokkaykset;
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
    const maaList = hakusana.split('+').map(maa => maa.trim()); // "suomi, ruotsi,   norja" --> ["suomi", "ruotsi", "norja"]
    
    const uniqMaat = new Set(maat);     //poistaa duplikaatit maaListasta
    const datanMaat = new Set(maaTaulukko);
    const realMaat = maaList.filter(maa => datanMaat.has(maa))   //syötetyt maat suodatetaan datasta löytyvistä maista

    const newMaat = realMaat.filter(maa => !uniqMaat.has(maa));   //varmistetaan ettei näissä duplikaatteja

    if (newMaat.length == 0) { 
      setPaivita(false); // Ei päivitetä turhaan
    }

    const valitutMaat = [...maat, ...newMaat].sort();

    setMaat(valitutMaat);   //mahdollisiin ennalta valittuihin lisätään newMaat
    
    if (hakusana.trim().length > 0) {  //Käsitellään hakuehdotukset
      kasitteleHakuehdotukset(maaList);
      // Jos haussa ei muuta kuin tyhjää
    } else {
      setEhdotukset([]);
      asetaHakuKoko([]); //asetetaan hakuboxin koko defaulttiin
    }
    console.log('Syötetyt maat:', newMaat);
  };


  const kasitteleHakuehdotukset = (syotetytMaat) => {
    const viimeinenSyotettyMaa = syotetytMaat[syotetytMaat.length - 1].trim(); //jos on syötetty useampi maa, ehdotuksiin näytetään viimeisimmän ehdotus
      
    //jos syöte ei ole vain tyhjää eli esim "Suomi +     " vaan vaikka "Suomi +     Ruotsi" niin mennään if sisään
    if (viimeinenSyotettyMaa.trim() !== '') {
         if (maat.length > 0) valitsemattomatMaat = valitsemattomatMaat.filter(maa => !maat.includes(maa)); //kun maita on valittu, valitut poistetaan ehdotuksista
        const filteredehdotukset = valitsemattomatMaat.filter(maa => 
          maa.toLowerCase().startsWith(viimeinenSyotettyMaa.trim().toLowerCase())
        );
        setEhdotukset(filteredehdotukset);
        asetaHakuKoko(filteredehdotukset); //asetetaan hakuboxin koko hakuehdotuksien määrän mukaan
      }
      //Jos syötetty tyhjää + merkin jälkeen eli esim "Suomi +      "
      else {
        setEhdotukset([]);
        asetaHakuKoko([]); //asetetaan hakuboxin koko defaulttiin
      }
  }


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
    } else {
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
   * @param {*} valittu tieto onko checkboxin tilasta
   */
  const kaikkiMaatValittuna = (valittu) => {
    if (valittu) {
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
    setMaat(maatEnnenPoistoa => {
       // Luodaan uusi taulukko, joka ei sisällä poistettavaa maata
      const uudetMaat = maatEnnenPoistoa.filter(maa => maa !== poistettavaMaa);
      
      // poistettujen maiden koordinaattien poisto kartalta
      let hyokkaykset;

      if (vuosi === "all") {
        hyokkaykset = haeMaidenHyokkaykset([poistettavaMaa]);
        console.log('Vuosi : all')
      } else {
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
      
      setKoordinaatit(hyokkaystenKoordinaatit);
      
      return uudetMaat;
    });
  }


  /**
   * Hakee maan hyökkäysten määrän valittuna vuonna
   * @param {*} country maa jonka hyökkäyksiä käsitellään
   * @returns valitun maan hyökkäykset valittuna vuonna
   */
  const getHyokkaysmaara = (country) => {
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
            hae={handleHaku} 
            ehdotukset={ehdotukset} 
            setEhdotukset={setEhdotukset} 
            kaikkiMaatValittuna={kaikkiMaatValittuna}
            asetaHakuKoko={asetaHakuKoko}
          />
          <div id="valitutmaat" className="valitutMaat">
            {maat.length > 0 && (
              <SelectedCountries
                maat={maat}
                getHyokkaysmaara={getHyokkaysmaara}
                handleMaaPoisto={handleMaaPoisto}
              />
            )}
          </div>
          <div id="hyokkayslkm" className='hyokkayslkm'>
                <p>
                  Total attacks with selected options: {koordinaattiLista.length}
                </p>
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