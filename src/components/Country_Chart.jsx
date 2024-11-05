import { useEffect, useState, useRef } from 'react';
import {Chart} from 'chart.js/auto';
import pirate_attacks from '../data/pirate_attacks';
import country_indicators from '../data/country_indicators';
import country_codes from '../data/country_codes';





const Country_Chart = (props) => {


    const chartRef = useRef(null); // asetetaan viite canvas elementtiin
    useEffect(() => {
      const ctx = chartRef.current.getContext("2d");
      const vuosi = props.indikaattorit.map(i => i.year); // luodaan datasta taulukot
      const unemployment = props.indikaattorit.map(i => i.unemployment_rate);
      const attacks = props.indikaattorit.map(i => i.attacks);

      // määritellään taulukon tiedot
      const testi = new Chart (ctx, {
        type: "bar", // taulukon tyyppi "bar", "pie" jne myös mahdollisia
        data: {
            labels: vuosi, // x-akselin data
            datasets: [ // y-akselin data
              {
                label: 'Attacks',
                data: attacks 
              },
              {
                label: 'Unemployment rate',
                data: unemployment
              }
          ]

        }
      });

      return () => {
        testi.destroy(); // cleanup
      };

    });

    return (
    <>
        
        <canvas ref={chartRef} width="170" height="90"></canvas>
        
    </>
    );
}

export default Country_Chart;