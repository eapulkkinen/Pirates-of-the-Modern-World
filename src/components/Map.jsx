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