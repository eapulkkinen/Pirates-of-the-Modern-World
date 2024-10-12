import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import L from 'leaflet'
import './App.css'
import Map from './components/Map'


function App() {

  return (
    <>
      <div id="maindiv">
        <div id="vasendiv" className="sivudiv">
          <p>Tänne maatiedot ja suodatusvalinnat?</p>
        </div>
        <div id="karttadiv">
          <Map></Map>
        </div>
        <div id="oikeadiv" className="sivudiv">
          <p>Tänne tietoa tapahtumista?</p>
        </div>
      </div>
    </>
  )
}

export default App
