import { useEffect, useState, useRef } from 'react';
import {Chart} from 'chart.js/auto';
import './index.css';
import Header from './components/Header';
import Footer from './components/Footer';
import pirate_attacks from './data/pirate_attacks';
import country_indicators from './data/country_indicators';
import country_codes from './data/country_codes';

/**
 * Mahdollisia muita kaavioita
 * 
 */

function App() {
  // Luodaan muutama taulukko väreistä joita käytetään sivun piirakkakaavioissa
  // Värivalinnat perustuu https://www.simplifiedsciencepublishing.com/resources/best-color-palettes-for-scientific-figures-and-data-visualizations
  const varitGrayscale = ["#0d0d0d", "#262626", "#595959", "#7f7f7f", "#a1a1a1", "#bababa", "#d4d4d4", "#ededed"];
  const varitBright = ["#003a7d", "#008dff", "#ff73b6", "#c701ff", "#4ecb8d", "#ff9d3a", "#f9e858", "#d83034"];
  const varitMuted = ["#f0c571", "#59a89c", "#0b81a2", "#e25759", "#9d2c00", "#7E4794", "#36b700", "#c8c8c8"]; // Toimii hyvin värisokeuden kanssa
  const varitAlternating = ["#8fd7d7", "#00b0be", "#ff8ca1", "#f45f74", "#bdd373", "#98c127", "#ffcd8e", "#ffb255"];

  const rajaVari = "#000000";

  // Luodaan piiras kaavio hyökkäyksistä per maa, näyttäen vain maat joissa yli 100 hyökkäystä
  // Loput maat asetetaan viimeiseksi alkioksi
  const attackPieChartRef = useRef(null); // asetetaan viite canvas elementtiin
  useEffect(() => {
    const ctx = attackPieChartRef.current.getContext("2d");

    let index = 0;
    let loput = 0;
    let hyokkaykset = [];

    var maaTaulukko = country_codes.map(i => i.country_name); //hakee datasta löytyvät maiden nimet taulukkoon ["Aruba","Afghanistan", ...]
    for (let maa of country_codes.map(i => i.country)) { // Käydään läpi jokainen maa
      let laskuri = 0;
      for (let indicator of country_indicators) { // TODO optimointi
        if (indicator.country == maa) { // Lisätään laskuriin maan hyökkäykset jokaiselta vuodelta
          laskuri += indicator.attacks;
        }
      }
      if (laskuri <= 150) { // Jos maalla on alle 100 hyökkäystä, se lasketaan vain viimeiseen alkioon ja poistetaan taulukosta
        maaTaulukko.splice(index, 1);
        loput += laskuri;
        continue;
      }
      index++;
      hyokkaykset.push(laskuri); // Lisätään hyökkäykset taulukkoon jos niitä on yli 100
    }
    
    // Luodaan yhdistetty taulukko jotta saadaan maat ja niiden hyökkäykset linkitettyä
    let yhdistetty = [];
    for (let i = 0; i < maaTaulukko.length; i++) { 
      let obj = {
        maa: maaTaulukko[i],
        hyokkaykset: hyokkaykset[i]
      };
      yhdistetty.push(obj);
    }
    yhdistetty = yhdistetty.sort((a, b) => b.hyokkaykset - a.hyokkaykset); // Lajitellaan hyökkäykset isoimmasta pienimpään
    for (let i = 0; i < maaTaulukko.length; i++) { // Asetetaan "uudet sijainnit" taulukkoihin
      maaTaulukko[i] = yhdistetty[i].maa;
      hyokkaykset[i] = yhdistetty[i].hyokkaykset;
    }
    maaTaulukko.push("Other countries");
    hyokkaykset.push(loput);
    
    // määritellään taulukon tiedot
    const testi = new Chart (ctx, {
      type: "pie", // taulukon tyyppi 
      data: {
          labels: maaTaulukko, // Maat
          datasets: [{
              data: hyokkaykset, // Hyökkäykset
              backgroundColor: varitMuted,
              borderColor: rajaVari
          }]
      },
      
    });

    return () => {
      testi.destroy(); // cleanup
    };

  });

  return (
  <>
      <Header />
      <h1>Did you know?</h1>
      <p>10 countries have had over 150 pirate attacks between 1993-2020</p>
      <div className='tokaSivuChart'>
        <canvas ref={attackPieChartRef} id="attackPie"></canvas>
      </div>
      <Footer />
  </>
  );
}

export default App;