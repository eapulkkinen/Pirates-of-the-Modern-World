import { useEffect, useRef } from 'react';
import {Chart} from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './index.css';
import Header from './components/Header';
import Question_Mark from './components/Question_Mark';
import Footer from './components/Footer';
import pirate_attacks from './data/pirate_attacks';
import country_codes from './data/country_codes';

/** 
 * This project is licensed under the CC BY-NC-SA 4.0 license. https://creativecommons.org/licenses/by-nc-sa/4.0/
 * See https://github.com/eapulkkinen/Pirates-of-the-Modern-World?tab=License-1-ov-file#readme
 * 
 * Tilastosivun pääohjelma
 */
function App() {

  /**
   * Funktio jolla saadaan lajiteltua kaksi taulukko ns. linkitettynä
   * @param {*} t1 Ensimmäinen taulukko eli labelit
   * @param {*} t2 Toinen taulukko eli numerot
   * @param {boolean} reverse false jos halutaan pienimmästä isoimpaan, true jos haluaa isoimmasta pienimpään
   * @returns t1 ja t2 lajiteltuina
   */
  function tuplaSort(t1, t2, reverse = true) {
    // Luodaan yhdistetty taulukko jotta saadaan taulukot linkitettyä
    let yhdistetty = [];
    for (let i = 0; i < t1.length; i++) { 
      let obj = {
        eka: t1[i],
        toka: t2[i]
      };
      yhdistetty.push(obj);
    }
    if (reverse) { yhdistetty = yhdistetty.sort((a, b) => b.toka - a.toka); } // Lajitellaan isoimmasta pienimpään
    else { yhdistetty = yhdistetty.sort((a, b) => a.toka - b.toka); } // Lajitellaan pienimmästä isoimpaan
    for (let i = 0; i < t1.length; i++) { // Asetetaan "uudet sijainnit" taulukkoihin
      t1[i] = yhdistetty[i].eka;
      t2[i] = yhdistetty[i].toka;
    }
    return [t1, t2]; // Palautetaan lajitellut taulukot
  }

  // Luodaan muutama taulukko väreistä joita käytetään sivun piirakkakaavioissa
  // Värivalinnat perustuu https://www.simplifiedsciencepublishing.com/resources/best-color-palettes-for-scientific-figures-and-data-visualizations
  const varitMuted = ["#f0c571", "#59a89c", "#0b81a2", "#e25759", "#9d2c00", "#7E4794", "#36b700", "#c8c8c8", "#a85f00", "#8c0081", "#853434"]; // Toimii hyvin värisokeuden kanssa
  const rajaVari = "#000000"; // Charttien rajojen väri

  Chart.register(ChartDataLabels);

  // Luodaan piiraskaavio hyökkäyksistä per maa, näyttäen vain maat joissa yli 100 hyökkäystä
  // Loput maat asetetaan viimeiseksi alkioksi
  const attackPieChartRef = useRef(null); // asetetaan viite canvas elementtiin
  useEffect(() => {
    const ctx = attackPieChartRef.current.getContext("2d");

    let yht = 0;
    let maaTaulukko = country_codes.map(i => i.country_name); // Taulukko maiden nimistä
    let maaLyhenteet = country_codes.map(i => i.country); // Taulukko maiden nimien lyhenteistä
    let maat = [];
    let hyokkaykset = [];

    for (let i = 0; i < maaTaulukko.length; i++) {  // käydään läpi kaikki maat
      for (let hyokkays of pirate_attacks) {
        if (hyokkays.nearest_country == maaLyhenteet[i]) {
          yht += 1;
          if (maat.length == 0) { // Ensimmäinen alkio
            maat.push(maaTaulukko[i]);
            hyokkaykset.push(1);
            continue;
          }
          for (let j = 0; j < maat.length; j++) { // Muut alkiot
            if (maat[j] == maaTaulukko[i]) { // Tarkastetaan löytyykö alkio jo taulukosta
              hyokkaykset[j] += 1;
              break;
            }
            if (j == maat.length-1) { // Jos ei ole löytynyt, kyseessä on uusi tapaus joka lisätään taulukkoon
              maat.push(maaTaulukko[i]);
              hyokkaykset.push(1);
              break;
            }
          }
        }
      }
    }

    // Käydään läpi kaikki tavat ja poistetaan ne joissa on alle 100 tapausta
    // Lisätään nämä tapaukset loppuun "Other countries" alkioon
    let loput = 0;
    for (let i = 0; i < maat.length;) {
      if (hyokkaykset[i] <= 153) {
        loput += hyokkaykset[i];
        maat.splice(i, 1);
        hyokkaykset.splice(i, 1);
        continue;
      }
      i++; // Siirrytään seuraavaan jos mitään ei poistettu
    }
    
    // Lajitellaan maat hyökkäysten mukaan
    let yhdistetty = tuplaSort(maat, hyokkaykset); 
    maat = yhdistetty[0];
    hyokkaykset = yhdistetty[1];

    // Lisätään loput maat taulukkoon
    maat.push("Other countries");
    hyokkaykset.push(loput);
    
    // määritellään taulukon tiedot
    const chartti = new Chart (ctx, {
      type: "pie",
      data: {
          labels: maat, // Maat
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
            clip: 'true',
            formatter: function(value) {
              return Math.round((value / yht) * 1000) / 10 + '%';
            }
          },
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              color: "#000000"
            }
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

    // Käydään läpi kaikki tavat ja poistetaan ne joissa on alle 100 tapausta
    // Lisätään nämä tapaukset loppuun "Other types" alkioon
    let loput = 0;
    for (let i = 0; i < tavat.length;) {
      if (hyokkaykset[i] <= 100) {
        loput += hyokkaykset[i];
        tavat.splice(i, 1);
        hyokkaykset.splice(i, 1);
        continue;
      }
      i++; // Siirrytään seuraavaan jos mitään ei poistettu
    }

    // Lajitellaan tavat hyökkäysten mukaan
    let yhdistetty = tuplaSort(tavat, hyokkaykset); 
    tavat = yhdistetty[0];
    hyokkaykset = yhdistetty[1];

    // Lisätään loput tavat taulukkoon
    tavat.push("Other types");
    hyokkaykset.push(loput);

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
            anchor: 'center',
            display: 'auto',
            clip: 'true',
            formatter: function(value) {
              return Math.round((value / yht) * 1000) / 10 + '%';
            }
          },
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              color: "#000000"
            }
          }
        }
      }
    });
    return () => {
      chartti.destroy(); // cleanup
    };
  });

  // Luodaan piiraskaavio kaikista laivatyypeistä
  const  vesselTypeChartRef = useRef(null); // asetetaan viite canvas elementtiin
  useEffect(() => {
    const ctx = vesselTypeChartRef.current.getContext("2d");

    // Käydään läpi kaikki hyökkäykset
    // Aina kun tulee uusi laivatyyppi, lisätään se tyypit taulukkoon
    // Jos tapa on jo olemassa, lisätään siihen +1
    let tyypit = [];
    let hyokkaykset = [];
    let yht = 0;

    for (let hyokkays of pirate_attacks) {
      if (hyokkays.vessel_type == "NA") { continue; } // Jätetään tapaukset joissa dataa ei ole huomioimatta
      yht += 1; // Hyökkäys lasketaan yhteismäärään
      if (tyypit.length == 0) {
        tyypit.push(hyokkays.vessel_type); // Lisätään ensimmäinen ei tyhjä tyyppi taulukkoon
        hyokkaykset.push(1); // Lisätään ensimmäinen luku hyökkäyksiin
        continue;
      }
      for (let i = 0; i < tyypit.length; i++) { // Käydään läpi listatut tyypit
        if (tyypit[i] == hyokkays.vessel_type) { // Jos tapa on jo listattu, nostetaan sen hyökkäysten määrää
          hyokkaykset[i] += 1;
          break;
        }
        if (i == tyypit.length-1) { // Jos käydään läpi kaikki tyypit ja mikään ei ole sama eli tyyppi on uusi, lisätään taulukkoon uusi tyyppi
          tyypit.push(hyokkays.vessel_type);
          hyokkaykset.push(1);
        }
      }
    }

    // Käydään läpi kaikki tyypit ja poistetaan ne joissa on <= 30 tapausta
    // Lisätään nämä tapaukset loppuun "Other types" alkioon
    let loput = 0;
    for (let i = 0; i < tyypit.length;) {
      if (hyokkaykset[i] <= 30) {
        loput += hyokkaykset[i];
        tyypit.splice(i, 1);
        hyokkaykset.splice(i, 1);
        continue;
      }
      i++; // Siirrytään seuraavaan jos mitään ei poistettu
    }

    // Lajitellaan tyypit hyökkäysten mukaan
    let yhdistetty = tuplaSort(tyypit, hyokkaykset); 
    tyypit = yhdistetty[0];
    hyokkaykset = yhdistetty[1];

    // Lisätään loput tyypit taulukkoon
    tyypit.push("Other types");
    hyokkaykset.push(loput);

    const chartti = new Chart (ctx, {
      type: "pie",
      data: {
          labels: tyypit, // Tavat
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
            anchor: 'center',
            display: 'auto',
            clip: 'true',
            formatter: function(value) {
              return Math.round((value / yht) * 1000) / 10 + '%';
            }
          },
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              color: "#000000"
            }
          }
        }
      }
    });
    return () => {
      chartti.destroy(); // cleanup
    };
  });

  // Luodaan piiraskaavio kaikista laivojen statuksista
  const  vesselStatusChartRef = useRef(null); // asetetaan viite canvas elementtiin
  useEffect(() => {
    const ctx = vesselStatusChartRef.current.getContext("2d");

    // Käydään läpi kaikki hyökkäykset
    // Aina kun tulee uusi laivan status, lisätään se status taulukkoon
    // Jos status on jo olemassa, lisätään siihen +1
    let status = [];
    let hyokkaykset = [];
    let yht = 0;

    for (let hyokkays of pirate_attacks) {
      if (hyokkays.vessel_status == "NA") { continue; } // Jätetään tapaukset joissa dataa ei ole huomioimatta
      yht += 1; // Hyökkäys lasketaan yhteismäärään
      if (status.length == 0) {
        status.push(hyokkays.vessel_status); // Lisätään ensimmäinen ei tyhjä status taulukkoon
        hyokkaykset.push(1); // Lisätään ensimmäinen luku hyökkäyksiin
        continue;
      }
      for (let i = 0; i < status.length; i++) { // Käydään läpi listatut statukset
        if (status[i] == hyokkays.vessel_status) { // Jos status on jo listattu, nostetaan sen hyökkäysten määrää
          hyokkaykset[i] += 1;
          break;
        }
        if (i == status.length-1) { // Jos käydään läpi kaikki statukset ja mikään ei ole sama eli status on uusi, lisätään taulukkoon uusi status
          status.push(hyokkays.vessel_status);
          hyokkaykset.push(1);
        }
      }
    }

    // Käydään läpi kaikki statukset ja poistetaan ne joissa on <= 100 tapausta
    // Lisätään nämä tapaukset loppuun "Other types" alkioon
    let loput = 0;
    for (let i = 0; i < status.length;) {
      if (hyokkaykset[i] <= 100) {
        loput += hyokkaykset[i];
        status.splice(i, 1);
        hyokkaykset.splice(i, 1);
        continue;
      }
      i++; // Siirrytään seuraavaan jos mitään ei poistettu
    }

    // Lajitellaanstatukset hyökkäysten mukaan
    let yhdistetty = tuplaSort(status, hyokkaykset); 
    status = yhdistetty[0];
    hyokkaykset = yhdistetty[1];

    // Lisätään loput tyypit taulukkoon
    status.push("Other types");
    hyokkaykset.push(loput);

    const chartti = new Chart (ctx, {
      type: "pie",
      data: {
          labels: status, // Tavat
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
            anchor: 'center',
            display: 'auto',
            clip: 'true',
            formatter: function(value) {
              return Math.round((value / yht) * 1000) / 10 + '%';
            }
          },
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              color: "#000000"
            }
          }
        }
      }
    });
    return () => {
      chartti.destroy(); // cleanup
    };
  });

  // Luodaan piirakkakaavio hyökkäyksistä per maanosa
  const geographicChartRef = useRef(null);
  useEffect(() => {
    const ctx = geographicChartRef.current.getContext("2d");

    let regions = [];
    let hyokkaykset = [];
    let yht = 0;
    
    for (let hyokkays of pirate_attacks) { 
      let maa = hyokkays.nearest_country;
      if (maa == "NA") { continue; } // Kaikilla hyökkäksillä pitäisi olla maa mutta tämä on varmuuden vuoksi tässä
      for (let country of country_codes) {
        if (country.country == maa) { // Jos country code lyhenne on sama kuin hyökkäyksen country code
          yht += 1;
          if (regions.length == 0) { // lisätään eka region
            regions.push(country.region);
            hyokkaykset.push(1);
            continue;
          }
          for (let i = 0; i < regions.length; i++) { // Käydään läpi regionit, jos on jo aiemmin mukana, lisätään +1 hyökkäyksiin
            if (regions[i] == country.region) {
              hyokkaykset[i] += 1;
              break;
            }
            if (i == regions.length-1) {
              regions.push(country.region);
              hyokkaykset.push(1);
            }
          }
        }
      }
    }

    // Käydään läpi kaikki regionit ja poistetaan ne joissa on <= 100 tapausta
    // Lisätään nämä tapaukset loppuun "Other types" alkioon
    let loput = 0;
    for (let i = 0; i < regions.length;) {
      if (hyokkaykset[i] <= 100) {
        loput += hyokkaykset[i];
        regions.splice(i, 1);
        hyokkaykset.splice(i, 1);
        continue;
      }
      i++; // Siirrytään seuraavaan jos mitään ei poistettu
    }

    // Lajitellaan regionit hyökkäysten mukaan
    let yhdistetty = tuplaSort(regions, hyokkaykset); 
    regions = yhdistetty[0];
    hyokkaykset = yhdistetty[1];

    // Lisätään loput regionit taulukkoon
    regions.push("Other regions");
    hyokkaykset.push(loput);


    const chartti = new Chart (ctx, {
      type: "pie",
      data: {
          labels: regions, // Alueet
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
            anchor: 'center',
            display: 'auto',
            clip: 'true',
            formatter: function(value) {
              return Math.round((value / yht) * 1000) / 10 + '%';
            }
          },
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              color: "#000000"
            }
          }
        }
      }
    });
    return () => {
      chartti.destroy(); // cleanup
    };
  });

  // Luodaan piirakkakaavio hyökkäyksistä per maanosa
  const distanceChartRef = useRef(null);
  useEffect(() => {
    const ctx = distanceChartRef.current.getContext("2d");

    let distances = ["<10km", "10km-25km", "25km-50km", "50km-100km", ">100km"];
    let hyokkaykset = [0, 0, 0, 0, 0];
    let yht = 0;
    
    for (let hyokkays of pirate_attacks) { 
      yht++;
      if (hyokkays.shore_distance < 10) { hyokkaykset[0] += 1; }
      else if (hyokkays.shore_distance < 25) {hyokkaykset[1] += 1; }
      else if (hyokkays.shore_distance < 50) {hyokkaykset[2] += 1; }
      else if (hyokkays.shore_distance < 100) {hyokkaykset[3] += 1; }
      else {hyokkaykset[4] += 1; }
    }



    const chartti = new Chart (ctx, {
      type: "pie",
      data: {
          labels: distances, // etäisyydet
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
            anchor: 'center',
            display: 'auto',
            clip: 'true',
            formatter: function(value) {
              return Math.round((value / yht) * 1000) / 10 + '%';
            }
          },
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              color: "#000000"
            }
          }
        }
      }
    });
    return () => {
      chartti.destroy(); // cleanup
    };
  });

  const atkByYearRef = useRef(null);
  useEffect(() => {
    const ctx = atkByYearRef.current.getContext("2d");

    let hyokkaykset = [];
    let vuodet = []
    let index = 0;
    for (let i = 1993; i <= 2020; i++) {
      hyokkaykset.push(0);
      for (let hyokkays of pirate_attacks) {
        if (hyokkays.date.slice(0, 4) == i) {
          hyokkaykset[index] += 1;
        }
      }
      vuodet.push(i);
      index++;
    }

    const chartti = new Chart (ctx, {
      type: "line",
      data: {
          labels: vuodet, // x-akseli
          datasets: [{
              data: hyokkaykset, // y-akseli
              tension: 0.1,
              borderColor: '#000000',
              borderWidth: 5,
              pointRadius: 0
            }]
      },
      options: {
        plugins: {
          legend: {
            display: false
          },
          datalabels: {
            display: false
          }
        },
        scales: {
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
            title: {
              display: true,
              text: 'Number of attacks',
              color: '#000000'
            },
            border: {
              color: '#000000'
            },
            ticks: {
              color: '#000000'
            }
          }
        }
      }
    });
    return () => {
      chartti.destroy(); // cleanup
    };
  });

  const atkByTimeRef = useRef(null);
  useEffect(() => {
    const ctx = atkByTimeRef.current.getContext("2d");

    let hyokkaykset = [];
    let ajat = []

    for (let hyokkays of pirate_attacks) {
      let aikaString = hyokkays.time;
      if (aikaString == "NA") { continue; }
      let hour = aikaString.slice(0, 2);
      let aika = parseInt(hour);

      if (ajat.length == 0) {
        ajat.push(aika);
        hyokkaykset.push(1);
        continue;
      }
      for (let i = 0; i < ajat.length; i++) {
        if (aika == ajat[i]) {
          hyokkaykset[i] += 1;
          break;
        }
        if (i == ajat.length-1) {
          ajat.push(aika);
          hyokkaykset.push(1);
          break;
        }
      }
    }

    let yhdistetty = tuplaSort(hyokkaykset, ajat, false);
    hyokkaykset = yhdistetty[0];
    ajat = yhdistetty[1];

    const chartti = new Chart (ctx, {
      type: "line",
      data: {
          labels: ajat, // x-akseli
          datasets: [{
              data: hyokkaykset, // y-akseli
              tension: 0.1,
              borderColor: '#000000',
              borderWidth: 5,
              pointRadius: 0
          }]
      },
      options: {
        plugins: {
          legend: {
            display: false
          },
          datalabels: {
            display: false
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Hour',
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
            title: {
              display: true,
              text: 'Number of attacks',
              color: '#000000'
            },
            border: {
              color: '#000000'
            },
            ticks: {
              color: '#000000'
            }
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
      <div id="tokaSivuDiv">
        <Header />
        <h1 id='paaOtsikko'>Descriptive statistics</h1>
        <div className='tokaSivuChart'>
          <h2>Top 10 countries with the most attacks between 1993-2020</h2>
          <canvas ref={attackPieChartRef} id="attackPie"></canvas>
        </div>
        <div className='tokaSivuChart'>
          <h2>Most common attack types<Question_Mark ikoni={'*'} teksti={"some attacks may be missing attack type data, this chart only reflects those cases that do have that data"}></Question_Mark></h2> 
          <canvas ref={atkTypeChartRef} id="atkTypePie"></canvas>
        </div>
        <div className='tokaSivuChart'>
          <h2>Most common vessel types<Question_Mark ikoni={'*'} teksti={"some attacks may be missing vessel type data, this chart only reflects those cases that do have that data"}></Question_Mark></h2>
          <canvas ref={vesselTypeChartRef} id="vesselTypePie"></canvas>
        </div>
        <div className='tokaSivuChart'>
          <h2>Most common vessel status<Question_Mark ikoni={'*'} teksti={"some attacks may be missing vessel status data, this chart only reflects those cases that do have that data"}></Question_Mark></h2>
          <canvas ref={vesselStatusChartRef} id="vesselStatusPie"></canvas>
        </div>
        <div className='tokaSivuChart'>
          <h2>Attacks by geographic regions</h2>
          <canvas ref={geographicChartRef} id="geographicPie"></canvas>
        </div>
        <div className='tokaSivuChart'>
          <h2>Attacks by distance from shore</h2>
          <canvas ref={distanceChartRef} id="distancePie"></canvas>
        </div>
        <div className='tokaSivuChart'>
          <h2>Attacks by year for all countries</h2>
          <canvas ref={atkByYearRef} id="atkByYearRef"></canvas>
        </div>
        <div className='tokaSivuChart' id='vikaChart'>
          <h2>Attacks by time for all countries<Question_Mark ikoni={'*'} teksti={"some attacks may be missing attack time data, this chart only reflects those cases that do have that data"}></Question_Mark></h2>
          <canvas ref={atkByTimeRef} id="atkByTimeRef"></canvas>
        </div>
        <Footer />
      </div>
  </>
  );
}

export default App;