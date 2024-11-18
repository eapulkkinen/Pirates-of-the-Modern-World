import { useEffect, useState } from 'react';
import L, { icon, marker } from 'leaflet';    //Leafletin perusominaisuudet
import * as geolib from 'geolib';
import 'leaflet/dist/leaflet.css'; //Leaflet CSS
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import sininen from '../assets/Merkki.png';
import punainen from '../assets/ValittuMerkki.png';

var sininenMerkki = L.icon({ //valitsemattoman markerin ikoni
    iconUrl: sininen,
    iconSize: [38, 70],
    iconAnchor: [20, 60]
});

var punainenMerkki = L.icon({ //valitun markerin ikoni
    iconUrl: punainen,
    iconSize: [38,70],
    iconAnchor: [20, 60]
});

var aiemminValittu = null; //Aiemmin valitun markerin alustus

const Map = ({ koordinaattiLista }) => {
    const [map, setMap] = useState(null);
    const [markerClusterGroup, setMarkerClusterGroup] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);

    useEffect(() => {     
        //setView [] sisään koordinaatit kartan keskityspisteeksi ja luku sen jälkeen on zoomin määrä
        const initMap = L.map('karttadiv', {
            worldCopyJump: false,   //ei piirretä uusia pisteitä siirryttäessä toiseen karttaan
            maxBounds: [
                [-120, -210], // Eteläisimmät ja läntisimmät koordinaatit
                [120, 210]    // Pohjoisimmat ja itäisimmät koordinaatit
            ]
        }).setView([20, 0], 2);

        // tileLayerin parametreja muuttamalla saa vaihdettua kartan tyyppiä
        L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.{ext}', {
            attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            minZoom: 1,
            ext: 'png'
        }).addTo(initMap);

        setMap(initMap);

        //Ryppään luominen. Toimii yhtenä kartan tasona
        const clusterGroup = L.markerClusterGroup({
            maxClusterRadius: 60,    //säätää ryppäänluomisen etäisyyttä. default 80
            iconCreateFunction: (cluster) => {
                const numPisteet = cluster.getChildCount();

                let className = 'marker-cluster-';
                let color = '';
                let width = '25px';
                let height = '25px';

                if (numPisteet < 25) {
                    className += 'xs';
                    color = 'rgba(0, 0, 255, 0.65)';
                }
                else if (numPisteet < 100) {
                    className += 's';
                    color = 'rgba(34, 139, 34, 0.7)';
                    width = '28px';
                    height = '28px';
                }
                else if (numPisteet < 250) {
                    className += 'm';
                    color = 'rgba(255, 255, 0, 0.75)';
                    width = '30px';
                    height = '30px';
                }
                else if (numPisteet < 500) {
                    className += 'l';
                    color = 'rgba(255, 100, 10, 0.75)';
                    width = '32px';
                    height = '32px';
                }
                else if (numPisteet < 1000) {
                    className += 'xl';
                    color = 'rgba(255, 0, 0, 0.8)';
                    width = '35px';
                    height = '35px';
                }
                else {
                    className += 'xxl';
                    color = 'rgba(139, 0, 0, 0.8)';
                    width = '38px';
                    height = '38px';
                }

                return L.divIcon({
                    html: `<div style="
                                background-color: ${color};
                                border: 1px solid rgba(0, 0, 0, 0.8);
                                border-radius: 50%;
                                width: ${width};
                                height: ${height};
                                font-size: 14px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
                            ">
                            <span>${numPisteet}</span></div>`,
                    className: className,
                    iconSize: L.point(40, 40, true)
                });
            }
        });

        setMarkerClusterGroup(clusterGroup);
        initMap.addLayer(clusterGroup);

        return () => {
            initMap.remove();
        };
    }, []);

    useEffect(() => {
        if (map && markerClusterGroup) {
            //Jos suodatuksilla ei löydy yhtään hyökkäystä, poistetaan karttapisteet varmuuden vuoksi
            //ja markers, valittumarker sekä infobox tyhjennetään.
            if (koordinaattiLista.length === 0) {  
                markerClusterGroup.clearLayers();
                document.getElementById('infobox').innerHTML = "";
                setMarkers([]);
                setSelectedMarker(null);
                return;
            }

            //Tarkastetaan löytyykö klikattu marker vielä suodatusvalinnoilla
            //löydetyistä hyökkäyksistä, jos ei, infobox tyhjennetään ja
            //valittu marker nulliksi.
            if (selectedMarker !== null  && !koordinaattiLista.some(
                koord => 
                    koord.latitude === selectedMarker.latitude &&
                    koord.longitude === selectedMarker.longitude &&
                    koord.date === selectedMarker.date &&
                    koord.time === selectedMarker.time
                    )
                ) {
                    document.getElementById('infobox').innerHTML = "";
                    setSelectedMarker(null)
            }

            
            //Etsitään markersien poistettavia hyökkäyksiä, joita ei nykyisessä
            //koordinaattilistassa (edellisillä suodatuksilla löydetyt hyökkäykset).
            const poistettavatMarkerit = markers.filter(marker => {
                return !koordinaattiLista.some(koords => 
                    marker.getLatLng().lat === koords.latitude &&
                    marker.getLatLng().lng === koords.longitude &&
                    marker.date === koords.date &&
                    marker.time === koords.time
                );
            });

            //poistettavat markerit pois kartalta
            poistettavatMarkerit.forEach(marker => markerClusterGroup.removeLayer(marker));

            //Koordinaattilistasta löytyvät markerit talteen
            const validMarkers = markers.filter(marker => {
                return koordinaattiLista.some(koords => 
                    marker.getLatLng().lat === koords.latitude &&
                    marker.getLatLng().lng === koords.longitude &&
                    marker.date === koords.date &&
                    marker.time === koords.time
                );
            });

            //luodaan uusien suodatusten mukaiset koordinaatit ja niiden tiedot taulukoksi
            const newCoords = koordinaattiLista.filter(koordinaatti =>
                !markers.some(marker =>
                    marker.getLatLng().lat === koordinaatti.latitude &&
                    marker.getLatLng().lng === koordinaatti.longitude &&
                    marker.date === koordinaatti.date &&
                    marker.time === koordinaatti.time
                )
            );

            //luodaan uusista koordinaateista markerit ja laitetaan ne taulukkoon
            const newMarkers = newCoords.map(koordinaatit => {
                var marker = L.marker([koordinaatit.latitude, koordinaatit.longitude], {icon: sininenMerkki});
                marker.date = koordinaatit.date;
                marker.time = koordinaatit.time;
                let googleLinkki = 'https://google.com/maps/place/' + koordinaatit.latitude + ',' + koordinaatit.longitude; //Muodostetaan linkki google mapsiin samoilla koordinaateilla
                marker.bindPopup('<b>View on Google Maps</b><br><a href="' + googleLinkki + '" target="_blank">Click here</a>'); //Määritellään millainen markerin popup on

                marker.addEventListener("click", (e) => { // jos markeria klikataan suoritetaan tämä
                    let infobox = document.getElementById('infobox'); //valitaan valmiiksi luotu html elementti
                    marker.openPopup(); //Avataan aiemmin määritelty popup
                    if (marker.options.icon === sininenMerkki) marker.setIcon(punainenMerkki); //Vaihtaa valitsemattoman markerin väriä
                    if (aiemminValittu != null && aiemminValittu != marker) aiemminValittu.setIcon(sininenMerkki); //Vaihtaa aiemmin valitun markerin värin takaisin alkuperäiseen
                    aiemminValittu = marker; //Piirtämisen jälkeen sijoitetaan valittu marker aiemminValituksi seuraavaa klikkausta varten
                    // Muutetaan päiväys pv.kk.vuosi muotoon
                    const date = koordinaatit.date;
                    const pvm = date.split('-');
                    let dateFixed = pvm[2] + "." + pvm[1] + "." + pvm[0];

                    // Muutetaan koordinaatit XX° XX′ XX″ muotoon 
                    const latFixed = geolib.decimalToSexagesimal(koordinaatit.latitude);
                    const lonFixed = geolib.decimalToSexagesimal(koordinaatit.longitude);

                    // Leikataan hyökkäyksen kuvauksesta alkuosa, koska se tieto tulee ilmi muista kohdista
                    const att_desc = koordinaatit.attack_description.split('\n');

                    // Luodaan olio jolla on tapahtuman tiedot
                    let tiedot = {
                        date: dateFixed,
                        time: koordinaatit.time,
                        coordinates: `${latFixed}, ${lonFixed}`,
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
                            let titles = keys[i].split('_');
                            let title = "";
                            for (let j in titles) {
                                if (j == 0) {
                                    // Muutetaan otsikon ensimmäinen kirjain isoksi
                                    title = titles[j].charAt(0).toUpperCase() + titles[j].slice(1);
                                } else {
                                    title += " " + titles[j];
                                }
                            }

                            let p = document.createElement("p");
                            p.classList.add("infoboxp");

                            if (keys[i] === "EEZ_country") {
                                p.innerHTML = `
                                <span style="font-weight:bold">${title}</span>
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
                            }
                            else {
                                p.innerHTML += `<span style="font-weight:bold">${title}:</span> ${tiedot[keys[i]]}<br>`
                            }

                            // Lisätään ominaisuus infobox elementtiin
                            // Ominaisuuden otsikko asetetaan boldatuksi
                            infobox.appendChild(p);
                        }                        
                    }
                    //tooltipillä saisi ehkä eez vinkin näkyviin,
                    //mutta vaatii hieman koodin refaktorointia,
                    //että sen saa suoraan eez kohdalle
        
                    setSelectedMarker(marker);
                });

                markerClusterGroup.addLayers(marker)
                return marker;
            });
            
            //Vanhojen validien ja uusien karttapisteiden "merge" palautettavaksi taulukoksi
            const allMarkers = [...validMarkers, ...newMarkers];

            setMarkers(allMarkers);
        }
    }, [map, koordinaattiLista]);


    return (
        <div id="karttadiv">
        {}
        </div>
  );
};

export default Map;