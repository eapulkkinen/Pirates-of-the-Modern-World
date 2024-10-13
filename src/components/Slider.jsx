import React, { useState } from 'react';

const Slider = () => {
  
  const [value, setValue] = useState(1993); 

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div style={{ textAlign: 'center', padding: '10px' }}> 
      <h1>Näytettävä vuosi {value}</h1>

      <input
        type="range"
        min="1993"
        max="2020"
        step="1"
        value={value}
        onChange={handleChange}
        style={{ width: '400px' }} 
      />
    </div>
  );
}

export default Slider;
