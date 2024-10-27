import { useEffect, useState } from 'react';
import L from 'leaflet';    //Leafletin perusominaisuudet
import 'leaflet/dist/leaflet.css'; //Leaflet CSS

const Map = ({ koordinaattiLista }) => {
    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState([]);

    useEffect(() => {     
        //setView [] sisään koordinaatit kartan keskityspisteeksi ja luku sen jälkeen on zoomin määrä
        const initMap = L.map('karttadiv').setView([20, 0], 2);

        // tileLayerin parametreja muuttamalla saa vaihdettua kartan tyyppiä
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://carto.com/">CartoDB</a>',
        }).addTo(initMap);

        setMap(initMap);

        return () => {
            initMap.remove();
        };
    }, []);

    useEffect(() => {
        if (map) {
            markers.forEach(marker => map.removeLayer(marker));

            const newMarkers = koordinaattiLista.map(koordinaatit => {
                const marker = L.marker([koordinaatit.latitude, koordinaatit.longitude]).addTo(map);

                marker.addEventListener("click", (e) => { // jos markeria klikataan suoritetaan tämä
                    const infobox = document.getElementById('infobox'); //valitaan valmiiksi luotu html elementti
                    const date = koordinaatit.date;
                    const time = koordinaatit.time;
                    const coords = `${koordinaatit.latitude}, ${koordinaatit.longitude}`;
                    const location_desc = koordinaatit.location_description;
                    const country = koordinaatit.countryname;
                    const eez = koordinaatit.eezcountryname;
                    const shore_dist = koordinaatit.shore_distance.toFixed(2);
                    const shorecoords = `${koordinaatit.shore_latitude}, ${koordinaatit.shore_longitude}`;
                    const attack_desc = koordinaatit.attack_description;
                    const vessel = koordinaatit.vessel_name;
                    const vesseltype = koordinaatit.vessel_type;
                    const vesselstatus = koordinaatit.vessel_status;

                    //tässä syötetään mitä tekstiä halutaan näyttää
                    infobox.innerHTML = `   
                    Date: ${date}<br>
                    Country: ${country}<br>
                    EEZ Country: ${eez}
                    Coordinates: ${coords}<br>
                    Distance from shore: ${shore_dist}<br>
                    `;

                });
                
                return marker;
            })

            setMarkers(newMarkers);
        }
    }, [map, koordinaattiLista]);


    return (
        <div id="karttadiv">
        {}
        </div>
  );
};

export default Map;