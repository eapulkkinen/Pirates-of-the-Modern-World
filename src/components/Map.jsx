import { useEffect, useState } from 'react';
import L from 'leaflet';    //Leafletin perusominaisuudet
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
            markerClusterGroup.clearLayers();

            console.log("Koordinaattilista Map.jsx:", koordinaattiLista);

            //karttapisteiden päivitys
            if (koordinaattiLista.length === 0) {   //jos suodatuksilla löytyy 0 maata
                markerClusterGroup.clearLayers();
                document.getElementById('infobox').innerHTML = "";
                setMarkers([]);
                setSelectedMarker(null);
                return;
            }

            if (selectedMarker && !koordinaattiLista.some(
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

            //katsotaan mitkä markerit löytyy kartalta ja mitkä eivät kuulu
            //suodatettujen maiden hyökkäysten dataan
            const poistettavatMarkerit = markers.filter(marker => {
                return !koordinaattiLista.some(koordinaatti => 
                    marker.getLatLng().lat === koordinaatti.latitude &&
                    marker.getLatLng().lng === koordinaatti.longitude &&
                    marker.date === koordinaatti.date &&
                    marker.time === koordinaatti.time
                    );
                }
            );
        

            //yläpuolella löydetyjen markerin poisto kartalta
            poistettavatMarkerit.forEach(marker => markerClusterGroup.removeLayer(marker));
            
            console.log("Poistettavat ", poistettavatMarkerit);
            setMarkers(prevMarkers => prevMarkers.filter(marker => poistettavatMarkerit.includes(marker)));
            
            //luodaan suodatusten mukaiset koordinaatit ja niiden tiedot taulukoksi
            const newCoords = koordinaattiLista.filter(koordinaatti =>
                !markers.some(marker =>
                    marker.getLatLng().lat === koordinaatti.latitude &&
                    marker.getLatLng().lng === koordinaatti.longitude &&
                    marker.date === koordinaatti.date &&
                    marker.time === koordinaatti.time
                )
            );

            //luodaan koordinaateista markerit ja laitetaan ne taulukkoon
            const newMarkers = newCoords.map(koordinaatit => {
                const marker = L.marker([koordinaatit.latitude, koordinaatit.longitude]);
                marker.date = koordinaatit.date;
                marker.time = koordinaatit.time;

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

                setSelectedMarker(marker);
                
                return marker;
            });
            
            markerClusterGroup.addLayers(newMarkers);   //uudet markerit kartalle
            console.log("Uusien karttapisteiden koordinaatit: ", newCoords);
            setMarkers(prevMarkers => [...prevMarkers, ...newMarkers]);
        }
    }, [map, koordinaattiLista]);


    return (
        <div id="karttadiv">
        {}
        </div>
  );
};

export default Map;