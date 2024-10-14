import { useEffect, useState } from 'react';
import './App.css';
import Map from './components/Map';
import Slider from './components/Slider';
import Footer from './components/Footer';
import Search from './components/Search';

function App() {
  const [koordinaattiLista, setKoordinaatit] = useState([]);
  const [hakusana, setHakusana] = useState('');
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

  const handleHaku = (hakusana) => {
    setHakusana(hakusana);
    console.log('Hakusana: ' + hakusana);
  }

  const handleSlider = (vuosi) => {
    setVuosi(vuosi);
    console.log('Valittu vuosi: ' + vuosi)
  }

  return (
    <>
      <div id="maindiv">
        <div id="vasendiv" className="sivudiv">
          <Search onSearch={handleHaku} />
          <p>Tänne maatiedot ja suodatusvalinnat?</p>
        </div>
        <div id="karttadiv">
          <Map koordinaattiLista={koordinaattiLista} />
        </div>
        <div id="oikeadiv" className="sivudiv">
          <p>Tänne tietoa tapahtumista?</p>
        </div>
      </div>
      <Slider onChange={handleSlider}/>
      <Footer />
    </>
  );
}

export default App;
