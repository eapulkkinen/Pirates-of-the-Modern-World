import {useState} from 'react';
import './Modal/Modal.css';


/** 
 * This project is licensed under the CC BY-NC-SA 4.0 license. https://creativecommons.org/licenses/by-nc-sa/4.0/
 * See https://github.com/eapulkkinen/Pirates-of-the-Modern-World?tab=License-1-ov-file#readme
 */
const Header = () => {
    const [aukiHelp, setAukiHelp] = useState(false);
    const [aukiAbout, setAukiAbout] = useState(false);

    // Asettaa Help ikkunan näkyväksi / pois näkyvistä
    const toggleHelp = () => {
        setAukiHelp(!aukiHelp);
    }


    // Asettaa About ikkunan näkyväksi / pois näkyvistä
    const toggleAbout = () => {
        setAukiAbout(!aukiAbout);
    }


    /**
     * Tarkistaa onko nykyinen sivu Main
     * @returns true jos ollaan mainissa, false jos ei olla
     */
    const onkoMain = () => {
        if ( window.location.href.split("/")[3] == "index.html" || window.location.href.split("/")[3] == "") { return true; }
        return false;
    }


    // Avaa main karttasivun jos se ei ole auki, jos on auki, ei tee mitään
    const toggleMain = () => {
        if (!onkoMain()) {
            window.location.href= "../../index.html";
        }

    }


    // Avaa lisäsivun jos se ei ole auki, jos on auki, ei tee mitään
    const toggleGraphs = () => {
        if (onkoMain()) {
            window.location.href = "../../toka.html";
        }
    }
    

    return (
        <div id="header">
            <div id="titlejanav">
                <h1 id="headertitle">Pirates of the Modern World 🏴‍☠️ Mapping Dangers of the High Seas</h1>
                <div id='navnapit'>
                    <button type='submit'
                        onClick={toggleMain}
                        id="mainNappi"
                        className={onkoMain() ? 'inactivenappi' : ''}
                    >
                    Map view
                    </button>
                    <button 
                        type='submit'
                        onClick={toggleGraphs}
                        id='tokaNappi'
                        className={!onkoMain() ? 'inactivenappi' : ''}
                    >
                    Attack statistics
                    </button>
                </div>
            </div>
            <div id="oikeaylanapit">
                <button onClick={toggleHelp} id='helpnappi' className='modalNappi'>Help</button>
                <button onClick={toggleAbout} id='aboutnappi' className='modalNappi'>About</button>
            </div>

            {aukiHelp && (
            <div className='modal'>
            <div className='modalSisalto' id='helpModal'>
                <h1>Welcome to the Pirates of the Modern World App!</h1>
                <p>Did you know that pirates still exist? Well now you can see where they are active!</p>
                <ul>
                    <li>The app can show you information regarding pirate attacks between the years 1993 and 2020.</li>
                    <li>Search for countries using the searchbar on the left side of the screen.</li>
                    <li>Click a recommendation to choose a country or just click &quot;Select all countries&quot; to see all countries.</li>
                    <li>Choose the year with the slider below the map, or just choose &quot;Show all&quot; to see all years.</li>
                    <li>The map will show all attacks which fit the chosen year and countries</li>
                    <li>Click a marker on the map to see additional information about the attack. You can even look it up on Google Maps!</li>
                    <li>Click &quot;More information on chosen countries&quot; to see a graph of chosen countries&apos;s attacks</li>
                    <li>You can additionally compare the amount of attacks to other indicators. How does unemployment rate affect piracy?</li>
                    <li>Text highlighted in white hides additional information, just hover your cursor over them!</li>
                    <li>Interested in additional statistics? Click &quot;Attack statistics&quot; to see more graphs.</li>
                </ul>
                <button
                className='modalSulkuNappi'
                onClick={toggleHelp}
                >CLOSE</button>
            </div>
            </div>
            )}
            {aukiAbout && (
            <div className='modal'>
            <div className='modalSisalto' id='aboutModal'>
                <h1>About the application</h1>
                <ul>
                    <li>This application was made as a part of University of Jyväskylä&apos;s TIEA207 course.</li>
                    <li>If you find some data missing for an attack, that is because the original data was missing that data.</li>
                    <li>This application is made with the <a href="https://react.dev/" target="_blank">React</a> library 
                    and uses the <a href="https://leafletjs.com/" target="_blank">Leaflet</a>, <span></span>
                    <a href="https://www.chartjs.org/" target="_blank">Chart.js</a> and <span></span>
                    <a href="https://www.npmjs.com/package/geolib" target="_blank">Geolib</a> libraries.</li>
                    <li>Code for our modal windows from <a href="https://www.youtube.com/watch?v=9DwGahSqcEc" target="_blank">The Web School</a>.</li>
                    <li>Git repository: <a href="https://github.com/eapulkkinen/Pirates-of-the-Modern-World" target="_blank">Click here</a></li>
                    <li>Remember to read the README.md!</li>
                </ul>
                <button
                className='modalSulkuNappi'
                onClick={toggleAbout}
                >CLOSE</button>
            </div>
            </div>
            )}
        </div>
    )
}


export default Header;