import { useEffect, useState } from 'react';
import L from 'leaflet';    //Leafletin perusominaisuudet
import 'leaflet/dist/leaflet.css'; //Leaflet CSS

const Map = ({ koordinaattiLista }) => {
    const [map, setMap] = useState(null);
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
        if (map && koordinaattiLista.length > 0) {
            koordinaattiLista.forEach(koordinaatit => {
                L.marker(koordinaatit.coords)
                .addTo(map)
                .bindPopup(koordinaatit.place);
            });
        }
    }, [map, koordinaattiLista]);

    return (
        <div id="karttadiv">
        {}
        </div>
  );
};

export default Map;