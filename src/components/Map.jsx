import { useEffect } from 'react';
import L from 'leaflet';    //Leafletin perusominaisuudet
import 'leaflet/dist/leaflet.css'; //Leaflet CSS

const Map = () => {
  useEffect(() => {     
    //setView [] sisään koordinaatit kartan keskityspisteeksi ja luku sen jälkeen on zoomin määrä
    const map = L.map('karttadiv').setView([20, 0], 2);

    // tileLayerin parametreja muuttamalla saa vaihdettua kartan tyyppiä
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CartoDB</a>',
    }).addTo(map);

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div id="karttadiv">
      {}
    </div>
  );
};

export default Map;