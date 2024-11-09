import { useEffect, useState } from 'react';
import L, { marker } from 'leaflet';    //Leafletin perusominaisuudet
import * as geolib from 'geolib';
import 'leaflet/dist/leaflet.css'; //Leaflet CSS
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

const Map = ({ koordinaattiLista }) => {
    const [map, setMap] = useState(null);
    const [markerClusterGroup, setMarkerClusterGroup] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);

    useEffect(() => {     
        //setView [] sisään koordinaatit kartan keskityspisteeksi ja luku sen jälkeen on zoomin määrä
        const initMap = L.map('karttadiv').setView([20, 0], 2);

        // tileLayerin parametreja muuttamalla saa vaihdettua kartan tyyppiä
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://carto.com/">CartoDB</a>',
        }).addTo(initMap);

        setMap(initMap);

        //Ryppään luominen. Toimii yhtenä kartan tasona
        const clusterGroup = L.markerClusterGroup({
            maxClusterRadius: 60    //säätää ryppäänluomisen etäisyyttä. default 80
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
                const marker = L.marker([koordinaatit.latitude, koordinaatit.longitude]);
                marker.date = koordinaatit.date;
                marker.time = koordinaatit.time;

                marker.addEventListener("click", (e) => { // jos markeria klikataan suoritetaan tämä
                    let infobox = document.getElementById('infobox'); //valitaan valmiiksi luotu html elementti
                    let googleLinkki = 'https://google.com/maps/place/' + koordinaatit.latitude + ',' + koordinaatit.longitude; //Muodostetaan linkki google mapsiin samoilla koordinaateilla
                    marker.bindPopup('<b>View on Google Maps</b><br><a href="' + googleLinkki + '" target="_blank">Click here</a>'); //Klikkaamalla markeria saadaan popup, jossa aiemmin mainittu linkki
                    
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