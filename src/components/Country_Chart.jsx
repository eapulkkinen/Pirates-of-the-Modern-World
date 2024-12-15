import { useEffect, useRef } from 'react';
import {Chart} from 'chart.js/auto';
import pirate_attacks from '../data/pirate_attacks';

/** 
 * This project is licensed under the CC BY-NC-SA 4.0 license. https://creativecommons.org/licenses/by-nc-sa/4.0/
 * See https://github.com/eapulkkinen/Pirates-of-the-Modern-World?tab=License-1-ov-file#readme
 *
 * Luo kaavion halutuilla spekseillä
 * @param {*} props indikaattorit = kaikki valitun maan indikaattorit, valittuIndikaattori = indikaattori joka halutaan näyttää
 * @returns kaavio
 */
const Country_Chart = (props) => {

  const indicatorLabels = [
    { indic: "", label: "Indicator"},
    { indic: "corruption_index", label: "Corruption Index"},
    { indic: "homicide_rate", label: "Homicide Rate"},
    { indic: "GDP", label: "GDP Per Capita"},
    { indic: "total_fisheries_per_ton", label: "Fisheries Production"},
    { indic: "total_military", label: "Armed Forces Personnel"},
    { indic: "population", label: "Population"},
    { indic: "unemployment_rate", label: "Unemployment Rate"},
    { indic: "totalgr", label: "Total Government Revenue"},
    { indic: "industryofgdp", label: "Industry of GDP"},
    { indic: "all_attacks", label: "All Attacks"}
  ]

    /**
     * valitsee props.valittuIndikaattori perusteella tarvittavan indikaattoridatan
     * @returns Haluttu indikaattoridata
     */
    const valitseIndikaattori = () => {

      let indikaattoriTaulukko;

      switch (props.valittuIndikaattori) {
        case "all_attacks":
          let hyokkaykset = [];
          let index = 0;

          for (let i = 1993; i <= 2020; i++) {      // kopioitu TokaApp.jsx: ästä pienellä muutoksella
            hyokkaykset.push(0);
            for (let hyokkays of pirate_attacks) {
              if (hyokkays.date.slice(0, 4) == i) {
                hyokkaykset[index] += 1;
              }
            }
            index++;
          }
          
          indikaattoriTaulukko = hyokkaykset;
          break;
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
      }

      return indikaattoriTaulukko;
    }

    // Tehdään kuvaaja
    const chartRef = useRef(null); // asetetaan viite canvas elementtiin
    useEffect(() => {
      const ctx = chartRef.current.getContext("2d");
      const vuosi = [];     // luodaan datasta taulukot

      for (let i = 1993; i <= 2020; i++) {
        vuosi.push(i);
      };

      const indicator = valitseIndikaattori();
      const attacks = props.indikaattorit.map(i => i.attacks);
      const hyokkaysLabel = `Attacks in ${props.maa}`;

      // määritellään taulukon tiedot
      const kuvaaja = new Chart (ctx, {
        type: "line", // taulukon tyyppi "bar", "pie" jne myös mahdollisia
        data: {
            labels: vuosi, // x-akselin data
            datasets: [ // y-akselin data
              {
                label: hyokkaysLabel,
                data: attacks,
                yAxisID: 'y',
              },
              {
                label: indicatorLabels.find((i) => i.indic === props.valittuIndikaattori).label, //haetaan taulukosta oikea labeli
                data: indicator,
                yAxisID: 'y1',
              },
          ],
        },
        options: {
          scales: {  //akselit
            x: {
              title: {
                display: true,
                text: 'Year',
                color: '#000000'
              },
              border: {
                color: '#000000'
              },
              ticks: {
                color: '#000000'
              }
            },
            y: {
              type: 'linear', 
              display: true,
              position: 'left',
              title: {
                display: true,
                text: hyokkaysLabel,
                color: '#000000'
              },
              border: {
                color: '#000000'
              },
              ticks: {
                color: '#000000'
              },
            },
            y1: {
              type: 'linear', 
              display: true,
              position: 'right',
              grid: {
                drawOnChartArea: false,  // ei näytetä tämän y-akselin viivoja kuvaajassa selkeyden takia
              },
              title: {
                display: true,
                text: indicatorLabels.find((i) => i.indic === props.valittuIndikaattori).label,
                color: '#000000'
              },
              border: {
                color: '#000000'
              },
              ticks: {
                color: '#000000'
              },
            },
          },
        },
      });

      return () => {
        kuvaaja.destroy(); 
      };

    });

    return (
    <>
        <canvas ref={chartRef} width="170" height="50"></canvas>
    </>
    );
}

export default Country_Chart;