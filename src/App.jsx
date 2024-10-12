import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import L from 'leaflet'
import './App.css'


function App() {
  /** Testatu karttaa, mutta ei toimi järkevästi näillä
  useEffect(() => {
    const map = L.map('karttadiv').setView([20, 0], 1);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CartoDB</a>',
      maxZoom: 20,
    }).addTo(map);

    // Cleanup function to remove the map instance on unmount
    return () => {
      map.remove();
    };
  }, []);
  */

  return (
    <>
      <div id="maindiv">
        <div id="vasendiv" class="sivudiv">
          <p>Tänne maatiedot ja suodatusvalinnat?</p>
        </div>
        <div id="karttadiv">
        </div>
        <div id="oikeadiv" class="sivudiv">
          <p>Tänne tietoa tapahtumista?</p>
        </div>
      </div>
    </>
  )
}

export default App
