/* eslint-disable no-unused-vars */
import React, { useState } from 'react';


const Slider = ({ onChange, vuosi }) => {
  const handleChange = (event) => {
    onChange(event.target.value);
  };
  

  return (
    <div style={{ textAlign: 'center', padding: '10px' }}> 
      <h1> Year to be displayed: {vuosi}</h1>

      <input
        type="range"
        min="1993"
        max="2020"
        step="1"
        value={vuosi}
        onChange={handleChange}
        style={{ width: '400px' }} 
      />
      <label>
        <input type="checkbox" />
        Show all
      </label>
      
    </div>
  );
}

export default Slider;
