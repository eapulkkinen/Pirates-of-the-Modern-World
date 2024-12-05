import {useState} from 'react';
import './Modal/Modal.css';


/**
 * Tähän käyttöoikeudet
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
                <h1 id="headertitle">Pirates of the Modern World</h1>
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
                    Additional graphs
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
                <h1>Welcome to the Pirates of the Modern World App</h1>
                <p>The app can show you information regarding pirate attacks between the years 1993 and 2020</p>
                <p>Choose a country you want info on by searching for it, or just choose "Show every country" to see all countries</p>
                <p>Choose the year with the slider below the map, or just choose "Show all" to see all years</p>
                <p>Click "More information on chosen countries" to see a graph of chosen countries's attacks</p>
                <p>Click a marker on the map for more information on the attack</p>
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
                <h1>About</h1>
                <p>Lorem ipsum jne jne</p>
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