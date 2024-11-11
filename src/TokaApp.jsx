import { useEffect, useState, useRef } from 'react';
import {Chart} from 'chart.js/auto';
import './index.css';
import Header from './components/Header';
import Footer from './components/Footer';
import pirate_attacks from './data/pirate_attacks';
import country_indicators from './data/country_indicators';
import country_codes from './data/country_codes';


function App() {

  // Luodaan piiras kaavio hyökkäyksistä per maa, näyttäen vain maat joissa yli 100 hyökkäystä
  const attackPieChartRef = useRef(null); // asetetaan viite canvas elementtiin
  useEffect(() => {
    const ctx = attackPieChartRef.current.getContext("2d");

    let index = 0;
    let hyokkaykset = [];

    var maaTaulukko = country_codes.map(i => i.country_name); //hakee datasta löytyvät maiden nimet taulukkoon ["Aruba","Afghanistan", ...]
    for (let maa of country_codes.map(i => i.country)) { // Käydään läpi jokainen maa
      let laskuri = 0;
      for (let indicator of country_indicators) { // TODO optimointi
        if (indicator.country == maa) { // Lisätään laskuriin maan hyökkäykset jokaiselta vuodelta
          laskuri += indicator.attacks;
        }
      }
      if (laskuri <= 100) { // Jos maalla on alle 100 hyökkäystä, sitä ei lasketa ja poistetaan taulukosta
        maaTaulukko.splice(index, 1);
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
    
    // määritellään taulukon tiedot
    const testi = new Chart (ctx, {
      type: "pie", // taulukon tyyppi 
      data: {
          labels: maaTaulukko, // Maat
          datasets: [{
              data: hyokkaykset, // Hyökkäykset
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
      <p>Top 15 countries with the most pirate attacks between 1993-2020</p>
      <div className='tokaSivuChart'>
        <canvas ref={attackPieChartRef} id="attackPie"></canvas>
      </div>
      <Footer />
  </>
  );
}

export default App;