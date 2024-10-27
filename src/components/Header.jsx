import {useState} from 'react';
import './Modal/Modal.css';



const Header = () => {

    const [auki, setAuki] = useState(false);
    const toggleHelp = () => {
        setAuki(!auki);
    }
    

    return (
        <div>
            <h1>Pirate App 🏴‍☠️</h1>
            <button type='submit'>Map view</button>
            <button type='submit'>Additional graphs</button>
            <button onClick={toggleHelp} className='btn-modal'>Help</button>
            
            {auki && (
            <div className='modal'>
            <div className='modal-content'>
                <h1>Welcome to the Pirate App 🏴‍☠️</h1>
                <p>The app can show you information regarding pirate attacks between the years 1993 and 2020</p>
                <p>Choose a country you want info on by searching for it, or just choose "Show every country" to see all countries</p>
                <p>Choose the year with the slider below the map, or just choose "Show all" to see all years</p>
                <button
                className='close-modal'
                onClick={toggleHelp}
                >CLOSE</button>
            </div>
            </div>
            )}
        </div>
    )
}


export default Header;