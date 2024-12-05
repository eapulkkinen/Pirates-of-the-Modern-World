import React, { useState } from 'react';


/** 
 * Tähän käyttöoikeudet  
 */
const Slider = ({ onChange, vuosi }) => {
  const [naytaKaikki, setNaytaKaikki] = useState(false);
  const [aiempiValittuVuosi, setAiempiValittuVuosi] = useState(vuosi);

  /**
   * Sliderin muutoksen käsittely
   * @param {*} e tapahtuma 
   */
  const kasitteleSliderMuutos = (e) => {
    //Tarkistetaan onko kaikki vuodet valittuna
    if (!naytaKaikki) {
      onChange(naytaKaikki ? "all" : e.target.value);
      setAiempiValittuVuosi(e.target.value);
    }
  };

  /**
   * Checkboxin muutoksen käsittely
   * @param {*} e tapahtuma 
   */
  const kasiteleCheckboxMuutos = (e) => {
    const valittu = e.target.checked;
    setNaytaKaikki(e.target.checked);

    if (valittu) {
      setAiempiValittuVuosi(vuosi);
      onChange("all");
    }
    else {
      onChange(aiempiValittuVuosi);
    }
  }

  return (
    <div id='sliderDiv'> 
      <h1 id="sliderheader"> Year to be displayed: {vuosi}</h1>
      <input
        type="range"
        min="1993"
        max="2020"
        step="1"
        value={naytaKaikki ? "1993" : vuosi}
        onChange={kasitteleSliderMuutos}
        id='sliderInput'
        disabled={naytaKaikki}
      />
      <label id='kaikkiVuodetLabel'>
        <input 
          type="checkbox" 
          id="kaikkiVuodetCheck"
          onChange={kasiteleCheckboxMuutos}
          checked={naytaKaikki}
        />
        Show all years
      </label>
      
    </div>
  );
}

export default Slider;
