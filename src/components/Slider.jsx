import React, { useState } from 'react';

const Slider = ({ onChange }) => {
  
  const [vuosi, setVuosi] = useState(1993); 

  const handleChange = (event) => {
    setVuosi(event.target.value);
    onChange(event.target.value);
  };
  
  return (
    <div style={{ textAlign: 'center', padding: '10px' }}> 
      <h1>Näytettävä vuosi {vuosi}</h1>

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
        Näytä kaikki
      </label>
      
    </div>
  );
}

export default Slider;
