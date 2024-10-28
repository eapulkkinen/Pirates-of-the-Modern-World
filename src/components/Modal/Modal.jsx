import {useState} from 'react';
import './Modal.css';
import '../Country_Chart';
import Country_Chart from '../Country_Chart';

const Modal = (props) => {

    const [auki, setAuki] = useState(false);

    const toggleAuki = () => {
        setAuki(!auki);             // vaihtaa auki arvoa true/false
    }

    return (
        <>
        <button 
        onClick={toggleAuki}
        className='modalNappi'>Click for more info on chosen country</button>

        
        {auki && (                      // jos auki = true, niin näytetään modal komponentti
            <div className='modal'>
            <div 
            onClick={toggleAuki}
            className='overlay'></div>  

            <div className='modalSisalto'>
                <h2>Vuosi on {props.vuosi}</h2>
                <>
                <Country_Chart />
                </>
                <button
                className='modalSulkuNappi'
                onClick={toggleAuki}
                >CLOSE</button>
            </div>

        </div>

        )}
        
        </>
    );
}

export default Modal;