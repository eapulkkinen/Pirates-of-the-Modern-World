import {useState} from 'react';
import './Modal/Modal.css';

// TODO lisää tapa jolla näkyy headerissä mikä sivu on valittu

const Header = () => {

    const [auki, setAuki] = useState(false);

    const toggleHelp = () => {
        setAuki(!auki);
    }

    /**
     * Tarkistaa onko nykyinen sivu Main
     * Erittäin huono tilapäinen ratkaisu, muista muokata myöhemmin
     * @returns true jos ollaan mainissa, false jos ei olla
     */
    const onkoMain = () => {
        if ( window.location.href.split("/")[3] == "index.html") { return true; }
        return false;
    }

    // Avaa main karttasivun jos se ei ole auki, jos on auki, ei tee mitään
    const toggleMain = () => {
        if (onkoMain()) {
            console.log("Ollaan jo Mainissa");
        }
        else {
            window.location.href= "../../index.html";
        }

    }

    // Avaa lisäsivun jos se ei ole auki, jos on auki, ei tee mitään
    const toggleGraphs = () => {
        if (onkoMain()) {
            window.location.href = "../../toka.html";
        }
        else {
            console.log("Ollaan jo tokalla sivulla");
        }
    }
    

    return (
        <div>
            <h1>Pirate App 🏴‍☠️</h1>
            <button type='submit' onClick={toggleMain} id="mainNappi">Map view</button>
            <button type='submit' onClick={toggleGraphs} id='tokaNappi'>Additional graphs</button>
            <button onClick={toggleHelp} className='modalNappi'>Help</button>
            
            {auki && (
            <div className='modal'>
            <div className='modalSisalto'>
                <h1>Welcome to the Pirate App 🏴‍☠️</h1>
                <p>The app can show you information regarding pirate attacks between the years 1993 and 2020</p>
                <p>Choose a country you want info on by searching for it, or just choose "Show every country" to see all countries</p>
                <p>Choose the year with the slider below the map, or just choose "Show all" to see all years</p>
                <button
                className='modalSulkuNappi'
                onClick={toggleHelp}
                >CLOSE</button>
            </div>
            </div>
            )}
        </div>
    )
}


export default Header;