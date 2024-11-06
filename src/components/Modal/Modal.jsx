import {useState} from 'react';
import './Modal.css';

const Modal = (props) => {

    const [auki, setAuki] = useState(false);

    const toggleAuki = () => {
        setAuki(!auki);             // vaihtaa auki arvoa true/false
    }

    return (
        <>
        <button 
        onClick={toggleAuki}
        className='modalNappi'>Click for more info on chosen countries</button>

        
        {auki && (                      // jos auki = true, niin näytetään modal komponentti
            <div className='modal'>
            <div 
            onClick={toggleAuki}
            className='overlay'></div>  

            <div className='modalSisalto'>
                <h2>Vuosi on {props.vuosi}</h2>
                <p>
                    Tähän jotain kuvaajia
                    <br></br>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit voluptatibus animi officia tempore quaerat deleniti quo aspernatur nihil, incidunt nostrum culpa magni quasi similique, officiis, aliquam illo? Modi, ut quas.
                </p>
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