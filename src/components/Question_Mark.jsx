import React from "react";
import '../index.css';

/**
 * Tähän käyttöoikeudet
 * 
 * Tekee pienen halutun näköisen merkin (kirjain, emoji tms.), jonka päälle kursorin asettaessa näytetään laatikko, jossa on tekstiä
 * @param {*} ikoni joku merkki
 * @param {*} teksti haluttu teksti
 * @returns Hieno hommeli joka näyttää tekstiä
 */
const Question_Mark = ({ikoni, teksti}) => {
    return (
        <div class="tooltip-container">
        <div class="question-mark">{ikoni}</div>
        <div class="tooltip">
        <span class="tooltip-text">
        {teksti}
        </span>
        </div>
        </div>
    );
}

export default Question_Mark;