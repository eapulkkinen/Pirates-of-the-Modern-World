import { useEffect, useState } from 'react';
import L, { icon, marker } from 'leaflet'; 
import * as geolib from 'geolib';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import sininen from '../assets/Merkki.png';
import punainen from '../assets/ValittuMerkki.png';


/** 
 * This project is licensed under the CC BY-NC-SA 4.0 license. https://creativecommons.org/licenses/by-nc-sa/4.0/
 * See https://github.com/eapulkkinen/Pirates-of-the-Modern-World?tab=License-1-ov-file#readme
 */
const Map = ({ koordinaattiLista }) => {
    const [kartta, setKartta] = useState(null);
    const [markerRypas, setRypas] = useState(null);
    const [markerit, setMarkerit] = useState([]);
    const [valittuMarker, setValittuMarker] = useState(null);

    let sininenMerkki = L.icon({ //valitsemattoman markerin ikoni
        iconUrl: sininen,
        iconSize: [38, 70],
        iconAnchor: [20, 63]
    });
    let punainenMerkki = L.icon({ //valitun markerin ikoni
        iconUrl: punainen,
        iconSize: [38,70],
        iconAnchor: [20, 63]
    });
    let aiemminValittu = null; //Aiemmin valitun markerin alustus

    useEffect(() => {     
        const initKartta = L.map('karttadiv', {
            worldCopyJump: false, 
            maxBounds: [
                [-120, -210],
                [120, 210]    
            ]
        }).setView([20, 0], 2);

        L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.{ext}', {
            attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            minZoom: 1,
            ext: 'png'
        }).addTo(initKartta);

        setKartta(initKartta);

        const markerRypas = L.markerClusterGroup({
            maxClusterRadius: 60,
            iconCreateFunction: (cluster) => {
                const numPisteet = cluster.getChildCount();

                let mid = 150; // Värien keskikohta
                let max = 1000; // Värien maksimi
                let temp = numPisteet; // Jotta ei korvata alkuperäistä lukua
                if (temp > max) { temp = max; } // Jos enemmän kuin maksimi, asetetaan maksimiin
                let puna = 0;
                let vihrea = 0;
                let sini = 0;
                let skalaari = 0;

                if (numPisteet <= mid) {
                    skalaari = (numPisteet - 1) / (mid - 1);
                    vihrea = (255 * skalaari);
                    sini = (255 * (1 - skalaari));
                } 
                else if (mid < temp <= max) {
                    skalaari = (temp - mid) / (max - mid);
                    puna = (255 * skalaari);
                    vihrea = (255 * (1 - skalaari)); 
                }

                let className = 'marker-cluster-';
                let vari = 'rgba(' + puna + ', '+ vihrea +', ' + sini + ', 0.85)';
                let leveys = '25px';
                let korkeus = '25px';

                if (numPisteet < 25) {
                    className += 'xs';
                } else if (numPisteet < 100) {
                    className += 's';
                    leveys = '28px';
                    korkeus = '28px';
                } else if (numPisteet < 250) {
                    className += 'm';
                    leveys = '30px';
                    korkeus = '30px';
                } else if (numPisteet < 500) {
                    className += 'l';
                    leveys = '32px';
                    korkeus = '32px';
                } else if (numPisteet < 1000) {
                    className += 'xl';
                    leveys = '35px';
                    korkeus = '35px';
                } else {
                    className += 'xxl';
                    leveys = '38px';
                    korkeus = '38px';
                }

                return L.divIcon({
                    html: `<div style="
                                background-color: ${vari};
                                border: 1px solid rgba(0, 0, 0, 0.8);
                                border-radius: 50%;
                                width: ${leveys};
                                height: ${korkeus};
                                font-size: 16px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
                            ">
                            <span style="
                color: black; /* Text color */
                font-weight: bold;
                -webkit-text-stroke: 0.5px rgba(255, 255, 255, 0.8);
                text-fill-color: black; /* Ensure the text color is black */
            ">${numPisteet}</span></div>`,
                    className: className,
                    iconSize: L.point(40, 40, true)
                });
            }
        });

        setRypas(markerRypas);
        initKartta.addLayer(markerRypas);

        return () => {
            initKartta.remove();
        };
    }, []);

    
    useEffect(() => {
        if (kartta && markerRypas) {
            //Jos suodatuksilla ei löydy yhtään hyökkäystä, poistetaan karttapisteet varmuuden vuoksi
            //ja markerit, valittumarker sekä infobox asetetaan defaulttiin.
            if (koordinaattiLista.length === 0) {  
                markerRypas.clearLayers();
                setInfoboxDefault();
                setMarkerit([]);
                setValittuMarker(null);
                return;
            }

            //Tarkastetaan löytyykö klikattu marker vielä suodatusvalinnoilla
            //löydetyistä hyökkäyksistä, jos ei, infobox asetetaan defaulttiin ja
            //valittu marker nulliksi.
            if (valittuMarker !== null  && !koordinaattiLista.some(
                koord => 
                    koord.latitude === valittuMarker.latitude &&
                    koord.longitude === valittuMarker.longitude &&
                    koord.date === valittuMarker.date &&
                    koord.time === valittuMarker.time
                    )
                ) {
                    setInfoboxDefault();
                    setValittuMarker(null)
            }

            
            //Etsitään markeritien poistettavia hyökkäyksiä, joita ei nykyisessä
            //koordinaattilistassa (edellisillä suodatuksilla löydetyt hyökkäykset).
            const poistettavatMarkerit = markerit.filter(marker => {
                return !koordinaattiLista.some(koords => 
                    marker.getLatLng().lat === koords.latitude &&
                    marker.getLatLng().lng === koords.longitude &&
                    marker.date === koords.date &&
                    marker.time === koords.time
                );
            });

            //poistettavat markerit pois kartalta
            poistettavatMarkerit.forEach(marker => markerRypas.removeLayer(marker));

            //Koordinaattilistasta löytyvät markerit talteen
            const validmarkerit = markerit.filter(marker => {
                return koordinaattiLista.some(koords => 
                    marker.getLatLng().lat === koords.latitude &&
                    marker.getLatLng().lng === koords.longitude &&
                    marker.date === koords.date &&
                    marker.time === koords.time
                );
            });

            //luodaan uusien suodatusten mukaiset koordinaatit ja niiden tiedot taulukoksi
            const uudetKoords = koordinaattiLista.filter(koordinaatti =>
                !markerit.some(marker =>
                    marker.getLatLng().lat === koordinaatti.latitude &&
                    marker.getLatLng().lng === koordinaatti.longitude &&
                    marker.date === koordinaatti.date &&
                    marker.time === koordinaatti.time
                )
            );

            //luodaan uusista koordinaateista markerit ja laitetaan ne taulukkoon
            const newmarkerit = uudetKoords.map(koordinaatit => {
                let marker = L.marker([koordinaatit.latitude, koordinaatit.longitude], {icon: sininenMerkki});
                marker.date = koordinaatit.date;
                marker.time = koordinaatit.time;
                let googleLinkki = 'https://google.com/maps/place/' + koordinaatit.latitude + ',' + koordinaatit.longitude; //Muodostetaan linkki google mapsiin samoilla koordinaateilla
                marker.bindPopup('<b>View on Google Maps</b><br><a href="' + googleLinkki + '" target="_blank">Click here</a>', { offset: L.point(0, -30) }); //Määritellään millainen markerin popup on

                marker.addEventListener("click", (e) => { // jos markeria klikataan suoritetaan tämä
                    let infobox = document.getElementById('infobox'); //valitaan valmiiksi luotu html elementti
                    marker.openPopup(); //Avataan aiemmin määritelty popup
                    if (marker.options.icon === sininenMerkki) marker.setIcon(punainenMerkki); //Vaihtaa valitsemattoman markerin väriä
                    if (aiemminValittu != null && aiemminValittu != marker) aiemminValittu.setIcon(sininenMerkki); //Vaihtaa aiemmin valitun markerin värin takaisin alkuperäiseen
                    aiemminValittu = marker; //Piirtämisen jälkeen sijoitetaan valittu marker aiemminValituksi seuraavaa klikkausta varten
                    // Muutetaan päiväys pv.kk.vuosi muotoon
                    const pvm = koordinaatit.date.split('-');
                    const fixPvm = pvm[2] + "." + pvm[1] + "." + pvm[0];

                    // Muutetaan koordinaatit XX° XX′ XX″ muotoon 
                    const fixLat = geolib.decimalToSexagesimal(koordinaatit.latitude);
                    const fixLon = geolib.decimalToSexagesimal(koordinaatit.longitude);

                    // Leikataan hyökkäyksen kuvauksesta alkuosa, koska se tieto tulee ilmi muista kohdista
                    const att_desc = koordinaatit.attack_description.split('\n');

                    // Luodaan olio jolla on tapahtuman tiedot
                    let tiedot = {
                        date: fixPvm,
                        time: koordinaatit.time,
                        coordinates: `${fixLat}, ${fixLon}`,
                        location_description: koordinaatit.location_description,
                        nearest_country: koordinaatit.countryname,
                        EEZ_country: koordinaatit.eezcountryname,
                        distance_from_shore: koordinaatit.shore_distance.toFixed(2) + " kilometers",
                        //shore_coordinates = `${koordinaatit.shore_latitude}, ${koordinaatit.shore_longitude}`; // Ei tarpeellinen
                        attack_type: koordinaatit.attack_type,
                        vessel_name: koordinaatit.vessel_name,
                        vessel_type: koordinaatit.vessel_type,
                        vessel_status: koordinaatit.vessel_status,
                        description_of_attack: att_desc[att_desc.length-1]
                    };

                    // Tyhjennetään infobox jos siinä on tietoa
                    if (infobox.innerHTML.length > 0) { infobox.innerHTML = ``;}

                    // Käydään tiedot olion jokainen ominaisuus läpi
                    // Jos ominaisuudessa on tietoa, lisätään se infobox elementtiin
                    let keys = Object.keys(tiedot);
                    for (let i = 0; i < keys.length; i++) {
                        if (tiedot[keys[i]] != "NA") { // Käsitellään ominaisuus vain jos se ei ole "NA"
                            // Luodaan otsikko joka näytetään infoboksissa
                            let otsikot = keys[i].split('_');
                            let otsikko = "";
                            for (let j in otsikot) {
                                if (j == 0) {
                                    // Muutetaan otsikon ensimmäinen kirjain isoksi
                                    otsikko = otsikot[j].charAt(0).toUpperCase() + otsikot[j].slice(1);
                                } else {
                                    otsikko += " " + otsikot[j];
                                }
                            }

                            let p = document.createElement("p");
                            p.classList.add("infoboxp");

                            if (keys[i] === "EEZ_country") {
                                p.innerHTML = `
                                <span style="font-weight:bold">${otsikko}</span>
                                <div class="tooltip-container">
                                    <div class="question-mark">?</div>
                                    <div class="tooltip">
                                    <span class="tooltip-text">
                                    Exclusive Economic Zone (EEZ) is an area
                                    of the sea in which a sovereign state has
                                    exclusive rights regarding the exploration
                                    and use of marine resources.
                                    </span>
                                    </div>
                                </div>
                                </span>
                                <span> :</span>
                                <span> ${tiedot[keys[i]]}</span>`;
                            } else {
                                p.innerHTML += `<span style="font-weight:bold">${otsikko}:</span> ${tiedot[keys[i]]}<br>`
                            }

                            infobox.appendChild(p);
                        }                        
                    }
        
                    setValittuMarker(marker);
                });

                markerRypas.addLayers(marker)
                return marker;
            });
            
            const allmarkerit = [...validmarkerit, ...newmarkerit];
            setMarkerit(allmarkerit);
        }
    }, [kartta, koordinaattiLista]);

    function setInfoboxDefault() {
        let infobox = document.getElementById('infobox');
        infobox.innerHTML = ""; // Tyhjennetään laatikon vanhat tiedot

        // Asetetaan default teksti laatikkoon
        let p = document.createElement("p");
        p.classList.add("infoboxp");
        let p2 = document.createElement("p");
        p2.classList.add("infoboxp");
        p.textContent = "Attack information will appear here when you click a marker on the map";
        p2.textContent = "If you don't have markers on the map, try choosing a country from the left side of the screen";
        infobox.appendChild(p);
        infobox.appendChild(p2);
    }


    return (
        <div id="karttadiv">
        {}
        </div>
  );
};

export default Map;