/* eslint-disable no-unused-vars */
import React, { useState } from 'react';


const Slider = ({ onChange, vuosi }) => {
  const [showAll, setShowAll] = useState(false);
  const [previousSliderValue, setPreviousSliderValue] = useState(vuosi);

  /**
   * Sliderin muutoksen käsittely
   * @param {*} e tapahtuma 
   */
  const handleSliderChange = (e) => {
    //Tarkistetaan onko kaikki vuodet valittuna
    if (!showAll) {
      onChange(showAll ? "all" : e.target.value);
      setPreviousSliderValue(e.target.value);
    }
  };

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setShowAll(e.target.checked);

    if (isChecked) {
      setPreviousSliderValue(vuosi);
      onChange("All");
    }
    else {
      onChange(previousSliderValue);
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
        value={showAll ? "1993" : vuosi}
        onChange={handleSliderChange}
        id='sliderInput'
        disabled={showAll}
      />
      <label id='kaikkiVuodetLabel'>
        <input 
          type="checkbox" 
          id="kaikkiVuodetCheck"
          onChange={handleCheckboxChange}
          checked={showAll}
        />
        Show all years
      </label>
      
    </div>
  );
}

export default Slider;
