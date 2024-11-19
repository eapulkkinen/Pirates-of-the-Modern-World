import { useEffect, useRef } from 'react';
import {Chart} from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './index.css';
import Header from './components/Header';
import Footer from './components/Footer';
import pirate_attacks from './data/pirate_attacks';
import country_indicators from './data/country_indicators';
import country_codes from './data/country_codes';

// TODO ehkä tee jotenkin funktio joka tekee chartin

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
      for (let indicator of country_indicators) {
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
    
    // Lajitellaan maat hyökkäysten mukaan
    let yhdistetty = tuplaSort(maaTaulukko, hyokkaykset); 
    maaTaulukko = yhdistetty[0];
    hyokkaykset = yhdistetty[1];

    // Lisätään loput maat taulukkoon
    maaTaulukko.push("Other countries");
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
            clip: 'true',
            formatter: function(value) {
              return Math.round((value / yht) * 1000) / 10 + '%';
            }
          },
          legend: {
            display: true,
            position: 'right',
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
              backgroundColor: varitBright,
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
            position: 'left',
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
              backgroundColor: varitAlternating,
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
            position: 'right',
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
              backgroundColor: varitGrayscale,
              borderColor: rajaVari
          }]
      },
      options: {   
        plugins: {
          datalabels: {
            color: "#000000",
            backgroundColor: "#ffffff",
            anchor: 'center',
            display: 'auto',
            clip: 'true',
            formatter: function(value) {
              return Math.round((value / yht) * 1000) / 10 + '%';
            }
          },
          legend: {
            display: true,
            position: 'left',
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
            position: 'right',
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
              borderColor: '#7ca377'
          }]
      },
      options: {
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Year',
              color: '#000000'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Number of attacks',
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
              borderColor: '#7ca377'
          }]
      },
      options: {
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Hour',
              color: '#000000'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Number of attacks',
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
        <div className="tokaSivuHF">
          <Header />
        </div>
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
          <canvas ref={vesselTypeChartRef} id="vesselTypePie"></canvas>
        </div>
        <div className='tokaSivuChart'>
          <p>Most common vessel status*</p>
          <canvas ref={vesselStatusChartRef} id="vesselStatusPie"></canvas>
        </div>
        <div className='tokaSivuChart'>
          <p>Attacks by geographic regions</p>
          <canvas ref={geographicChartRef} id="geographicPie"></canvas>
        </div>
        <div className='tokaSivuChart'>
          <p>Attacks by year</p>
          <canvas ref={atkByYearRef} id="atkByYearRef"></canvas>
        </div>
        <div className='tokaSivuChart'>
          <p>Attacks by time*</p>
          <canvas ref={atkByTimeRef} id="atkByTimeRef"></canvas>
        </div>
        <p>*some attacks may be missing certain data, this chart only reflects those cases that do have that data</p>
        <div className="tokaSivuHF">
          <Footer />
        </div>
      </div>
  </>
  );
}

export default App;