import { useEffect, useState, useRef } from 'react';
import {Chart} from 'chart.js/auto';

/**
 * Luo kaavion halutuilla spekseillä
 * @param {*} props indikaattorit = kaikki valitun maan indikaattorit, valittuIndikaattori = indikaattori joka halutaan näyttää
 * @returns kaavio
 */
const Country_Chart = (props) => {

    /**
     * valitsee props.valittuIndikaattori perusteella tarvittavan indikaattoridatan
     * @returns Haluttu indikaattoridata
     */
    const valitseIndikaattori = () => {

      let indikaattoriTaulukko 

      switch (props.valittuIndikaattori) {
        case "corruption_index": 
          const corruption = props.indikaattorit.map(i => i.corruption_index);
          indikaattoriTaulukko = corruption;
          break;
        case "homicide_rate":
          const homicide = props.indikaattorit.map(i => i.homicide_rate);
          indikaattoriTaulukko = homicide;
          break;
        case "GDP":
          const gdp = props.indikaattorit.map(i => i.GDP);
          indikaattoriTaulukko = gdp;
          break;
        case "total_fisheries_per_ton":
          const fish = props.indikaattorit.map(i => i.total_fisheries_per_ton);
          indikaattoriTaulukko = fish;
          break;
        case "total_military":
          const military = props.indikaattorit.map(i => i.total_military);
          indikaattoriTaulukko = military;
          break;
        case "population":
          const population = props.indikaattorit.map(i => i.population);
          indikaattoriTaulukko = population;
          break;
        case "unemployment_rate":
          const unemployment = props.indikaattorit.map(i => i.unemployment_rate);
          indikaattoriTaulukko = unemployment;
          break;
        case "totalgr":
          const gr = props.indikaattorit.map(i => i.totalgr);
          indikaattoriTaulukko = gr;
          break;
        case "industryofgdp":
          const industry = props.indikaattorit.map(i => i.industryofgdp);
          indikaattoriTaulukko = industry;
          break;
        default:
          const oletus = props.indikaattorit.map(i => i.unemployment_rate);
          indikaattoriTaulukko = oletus;
      }

      return indikaattoriTaulukko;
    }

    const chartRef = useRef(null); // asetetaan viite canvas elementtiin
    useEffect(() => {
      const ctx = chartRef.current.getContext("2d");
      const vuosi = props.indikaattorit.map(i => i.year); // luodaan datasta taulukot
      const indicator = valitseIndikaattori();
      const attacks = props.indikaattorit.map(i => i.attacks);

      // määritellään taulukon tiedot
      const testi = new Chart (ctx, {
        type: "line", // taulukon tyyppi "bar", "pie" jne myös mahdollisia
        data: {
            labels: vuosi, // x-akselin data
            datasets: [ // y-akselin data
              {
                label: 'Attacks',
                data: attacks 
              },
              {
                label: props.valittuIndikaattori,
                data: indicator
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
        
        <canvas ref={chartRef} width="170" height="50"></canvas>
        
    </>
    );
}

export default Country_Chart;