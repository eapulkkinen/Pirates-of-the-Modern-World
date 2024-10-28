import { useEffect, useState, useRef } from 'react';
import {Chart} from 'chart.js/auto';
import pirate_attacks from '../data/pirate_attacks';
import country_indicators from '../data/country_indicators';



const Country_Chart = () => {


    const chartRef = useRef(null); // asetetaan viite canvas elementtiin
    useEffect(() => {
      const ctx = chartRef.current.getContext("2d");
      const gdp = country_indicators.map(i => i.GDP); // luodaan datasta taulukot
      const unemployment = country_indicators.map(i => i.unemployment_rate);

      // määritellään taulukon tiedot
      const testi = new Chart (ctx, {
        type: "line", // taulukon tyyppi "bar", "pie" jne myös mahdollisia
        data: {
            labels: gdp, // x-akselin data
            datasets: [{
                data: unemployment // y-akselin data
            }]

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