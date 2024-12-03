import React from "react";
import '../index.css';

/**
 * Tekee pienen kysymysmerkin, jonka päälle kursorin asettaessa näytetään laatikko, jossa on tekstiä
 * @param {String} teksti näytettävä teksti 
 * @returns kysymysmerkki hommelin
 */
const Question_Mark = ({teksti}) => {
    return (
        <div class="tooltip-container">
        <div class="question-mark">?</div>
        <div class="tooltip">
        <span class="tooltip-text">
        {teksti}
        </span>
        </div>
        </div>
    );
}

export default Question_Mark;