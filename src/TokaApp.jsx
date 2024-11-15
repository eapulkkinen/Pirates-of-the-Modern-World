import { useEffect, useState, useRef } from 'react';
import {Chart} from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './index.css';
import Header from './components/Header';
import Footer from './components/Footer';
import pirate_attacks from './data/pirate_attacks';
import country_indicators from './data/country_indicators';
import country_codes from './data/country_codes';

/**
 * Mahdollisia muita kaavioita
 * Most common attack types
 * Most common vessel types
 * Most common vessel status
 */

function App() {
  // Luodaan muutama taulukko väreistä joita käytetään sivun piirakkakaavioissa
  // Värivalinnat perustuu https://www.simplifiedsciencepublishing.com/resources/best-color-palettes-for-scientific-figures-and-data-visualizations
  const varitGrayscale = ["#0d0d0d", "#262626", "#595959", "#7f7f7f", "#a1a1a1", "#bababa", "#d4d4d4", "#ededed"];
  const varitBright = ["#003a7d", "#008dff", "#ff73b6", "#c701ff", "#4ecb8d", "#ff9d3a", "#f9e858", "#d83034"];
  const varitMuted = ["#f0c571", "#59a89c", "#0b81a2", "#e25759", "#9d2c00", "#7E4794", "#36b700", "#c8c8c8"]; // Toimii hyvin värisokeuden kanssa
  const varitAlternating = ["#8fd7d7", "#00b0be", "#ff8ca1", "#f45f74", "#bdd373", "#98c127", "#ffcd8e", "#ffb255"];

  const rajaVari = "#000000"; // Charttien rajojen väri

  Chart.register(ChartDataLabels);

  // Luodaan piiraskaavio hyökkäyksistä per maa, näyttäen vain maat joissa yli 100 hyökkäystä
  // Loput maat asetetaan viimeiseksi alkioksi
  const attackPieChartRef = useRef(null); // asetetaan viite canvas elementtiin
  useEffect(() => {
    const ctx = attackPieChartRef.current.getContext("2d");

    let index = 0;
    let loput = 0;
    let yht = 0;
    let hyokkaykset = [];

    var maaTaulukko = country_codes.map(i => i.country_name); //hakee datasta löytyvät maiden nimet taulukkoon ["Aruba","Afghanistan", ...]
    for (let maa of country_codes.map(i => i.country)) { // Käydään läpi jokainen maa
      let laskuri = 0;
      for (let indicator of country_indicators) { // TODO optimointi
        if (indicator.country == maa) { // Lisätään laskuriin maan hyökkäykset jokaiselta vuodelta
          laskuri += indicator.attacks;
        }
      }
      yht += laskuri; // Lisätään lasketut hyökkäykset yhteen lukuun
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
    maaTaulukko.push("Other countries combined");
    hyokkaykset.push(loput);
    
    // määritellään taulukon tiedot
    const chartti = new Chart (ctx, {
      type: "pie",
      data: {
          labels: maaTaulukko, // Maat
          datasets: [{
              data: hyokkaykset, // Hyökkäykset
              backgroundColor: varitMuted,
              borderColor: rajaVari
          }]
      },
      options: {   
        plugins: {
          datalabels: {
            color: "#ffffff",
            backgroundColor: "#000000",
            anchor: 'end',
            formatter: function(value) {
              return Math.round((value / yht) * 1000) / 10 + '%';
            }
          },
          legend: {
            display: true,
            position: 'right'
          }
        }
      }
    });
    return () => {
      chartti.destroy(); // cleanup
    };
  });

  // Luodaan piiraskaavio kaikista hyökkäystyypeistä
  const atkTypeChartRef = useRef(null); // asetetaan viite canvas elementtiin
  useEffect(() => {
    const ctx = atkTypeChartRef.current.getContext("2d");

    // Käydään läpi kaikki hyökkäykset
    // Aina kun tulee uusi hyökkäystapa, lisätään se tavat taulukkoon
    // Jos tapa on jo olemassa, lisätään siihen +1
    let tavat = [];
    let hyokkaykset = [];
    let yht = 0;

    for (let hyokkays of pirate_attacks) {
      if (hyokkays.attack_type == "NA") { continue; } // Jätetään tapaukset joissa dataa ei ole huomioimatta
      yht += 1; // Hyökkäys lasketaan yhteismäärään
      if (tavat.length == 0) {
        tavat.push(hyokkays.attack_type); // Lisätään ensimmäinen ei tyhjä tapa taulukkoon
        hyokkaykset.push(1); // Lisätään ensimmäinen luku hyökkäyksiin
        continue;
      }
      for (let i = 0; i < tavat.length; i++) { // Käydään läpi listatut tavat
        if (tavat[i] == hyokkays.attack_type) { // Jos tapa on jo listattu, nostetaan sen hyökkäysten määrää
          hyokkaykset[i] += 1;
          break;
        }
        if (i == tavat.length-1) { // Jos käydään läpi kaikki tavat ja mikään ei ole sama eli tapa on uusi, lisätään taulukkoon uusi tapa
          tavat.push(hyokkays.attack_type);
          hyokkaykset.push(1);
        }
      }
    }

    const chartti = new Chart (ctx, {
      type: "pie",
      data: {
          labels: tavat, // Tavat
          datasets: [{
              data: hyokkaykset, // Määrä
              backgroundColor: varitMuted,
              borderColor: rajaVari
          }]
      },
      options: {   
        plugins: {
          datalabels: {
            color: "#ffffff",
            backgroundColor: "#000000",
            anchor: 'end',
            display: 'auto',
            formatter: function(value) {
              return Math.round((value / yht) * 1000) / 10 + '%';
            }
          },
          legend: {
            display: true,
            position: 'left'
          }
        }
      }
    });
    return () => {
      chartti.destroy(); // cleanup
    };
  });

  return (
  <>
      <Header />
      <h1>Interesting data</h1>
      <div className='tokaSivuChart'>
        <p>10 countries have had over 150 pirate attacks between 1993-2020</p>
        <canvas ref={attackPieChartRef} id="attackPie"></canvas>
      </div>
      <div className='tokaSivuChart'>
        <p>Most common attack types*</p>
        <canvas ref={atkTypeChartRef} id="atkTypePie"></canvas>
      </div>
      <div className='tokaSivuChart'>
        <p>Most common vessel types*</p>
      </div>
      <div className='tokaSivuChart'>
        <p>Most common vessel status*</p>
      </div>
      <p>*some attacks may be missing certain data, this chart only reflects those cases that do have that data</p>
      <Footer />
  </>
  );
}

export default App;