import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  return (
    <>
      <div id="maindiv">
        <div id="vasendiv" class="sivudiv">
          <p>Tänne maatiedot ja suodatusvalinnat?</p>
        </div>
        <div id="karttadiv">
          <p>Tähän kartta</p>
        </div>
        <div id="oikeadiv" class="sivudiv">
          <p>Tänne tietoa tapahtumista?</p>
        </div>
      </div>
    </>
  )
}

export default App
