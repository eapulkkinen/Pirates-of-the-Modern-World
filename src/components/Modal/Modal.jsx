import {useState} from 'react';
import './Modal.css';

const Modal = (props) => {

    const [auki, setAuki] = useState(false);

    const toggleAuki = () => {
        setAuki(!auki);
    }

    return (
        <>
        <button 
        onClick={toggleAuki}
        className='btn-modal'>Click for more info on chosen country</button>

        {auki && (
            <div className='modal'>
            <div 
            onClick={toggleAuki}
            className='overlay'></div>
            <div className='modal-content'>
                <h2>Vuosi on {props.vuosi}</h2>
                <p>
                    Tähän jotain kuvaajia
                    <br></br>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit voluptatibus animi officia tempore quaerat deleniti quo aspernatur nihil, incidunt nostrum culpa magni quasi similique, officiis, aliquam illo? Modi, ut quas.
                </p>
                <button
                className='close-modal'
                onClick={toggleAuki}
                >CLOSE</button>
            </div>

        </div>

        )}
        
        </>
    );
}

export default Modal;