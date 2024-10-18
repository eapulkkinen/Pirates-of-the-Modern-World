import { useEffect, useState } from 'react';
import './App.css';
import Map from './components/Map';
import Slider from './components/Slider';
import Footer from './components/Footer';
import Search from './components/Search';

function App() {
  const [koordinaattiLista, setKoordinaatit] = useState([]);
  const [hakusyote, setHaku] = useState('');
  const [maat, setMaat] = useState([]);
  const [vuosi, setVuosi] = useState('');

  const haeKoordinaatit = () => {
    //Oikeasti tässä kohtaa haettaisi databasesta tmv. koordinaatit
    
    //Tässä kovakoodattu esimerkki listasta
    const koordinaatit = [
      {
        coords: [62.2391, 25.7387],
        place: 'Agora'
      },  
      {
        coords: [60.1699, 24.9384],
        place: 'Helsinki'
      }
    ];

    //const koordinaatit = []; //Toimii myös tyhjällä listalla eli 
    //"kun ei ole valittu yhtään suodattimia yms ei näytetä mtn"

    setKoordinaatit(koordinaatit); //Map.jsx "kutsu"
  };

  useEffect(() => {
    haeKoordinaatit();
  }, []);

  useEffect(() => {
    console.log('Kaikki maat:', maat); // Log updated countries whenever they change
  }, [maat]);

  const handleHaku = (hakusana) => {
    setHaku(hakusana);

    const maaList = hakusana.split(',').map(maa => maa.trim());
    
    const uniqMaat = new Set(maat);

    const newMaat = maaList.filter(maa => !uniqMaat.has(maa));

    setMaat((maatEnnenLisaysta => [...maatEnnenLisaysta, ...newMaat]));

    console.log('Syötetyt maat:', newMaat);
  }

  const handleSlider = (vuosi) => {
    setVuosi(vuosi);
    console.log('Valittu vuosi:', vuosi);
  }

  const handleMaaPoisto = (poistettavaMaa) => {
    console.log('Maat ennen poistoa:', maat);
    setMaat(maatEnnenPoistoa => {
      const uudetMaat = maatEnnenPoistoa.filter(maa => maa !== poistettavaMaa);
      console.log('Maat poiston jälkeen:', uudetMaat);
      return uudetMaat;
    });
  }
 
  const tapahtumat = [
    {
      date:"1993-01-02",
      time:"NA",
      longitude: 116.9667,
      latitude: 19.7,
      attack_type: "NA",
      location_description:"Hong Kong - Luzon - Hainan",
      nearest_country:"CHN",
      eez_country:"TWN",
      shore_distance: 357.50237257241855,
      attack_description: "NA",
      vessel_name: "Mv Cosmic Leader"
    },
    //-75.52725175699993,10.30955638200004,"24.01.2017: 1750 LT: Posn: 10:19.3N - 075:32.1W, Mamonal Inner Anchorage, Colombia.
    //"NA",Chemical Tanker,Anchored,imb
    {
      date:"2017-01-24",
      time:"17:50",
      longitude: -75.5336111111111,
      latitude: 10.321666666666667,
      attack_type: "Boarded",
      location_description:"Mamonal Inner Anchorage",
      nearest_country:"COL",
      eez_country:"COL",
      shore_distance: 1.5097984775275843,
      attack_description: "Unnoticed, robbers boarded \
      an anchored chemical tanker, stole the ship’s \
      properties and escaped. The theft was discovered \
      by the crew during routine rounds.",
      vessel_name: "Paatti"
    }];

  return (
    <>
      <div id="header">Main view</div>
      <div id="maindiv">
        <div id="vasendiv" className="sivudiv">
          <Search onSearch={handleHaku} />
          
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
      <Slider onChange={handleSlider}/>
      <Footer />
    </>
  );
}

export default App;
