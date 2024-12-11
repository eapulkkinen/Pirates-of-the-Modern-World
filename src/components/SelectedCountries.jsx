import React, { useState } from 'react';
import { useMemo } from 'react';
import Question_Mark from './Question_Mark';


/** 
 * This project is licensed under the CC BY-NC-SA 4.0 license. https://creativecommons.org/licenses/by-nc-sa/4.0/
 * See https://github.com/eapulkkinen/Pirates-of-the-Modern-World?tab=License-1-ov-file#readme
 */
function SelectedCountries({ maat, getHyokkaysmaara, handleMaaPoisto }) {
    const [sortJarjestys, setSortJarjestys] = useState("alphabetical");
    const [sortIkoni, setSortIkoni] = useState("🔤");
    const [sortTeksti, setSortTeksti] = useState("Click to sort by attack count from most attacks to least, click twice to sort by least attacks to most");


    /**
     * Muuttaa sorttaus järjestyksen ja ikonin sen mukaan
     */
    const muutaSortJarjestys = () => {
        let ikoni = "🔤";
        let teksti = ""
        if (sortJarjestys === "alphabetical") {
            setSortJarjestys("descending");
            ikoni = "⬇️";
            teksti = "Click to sort by attack count from least attacks to most, click twice to sort alphabetically";
        } else if (sortJarjestys === "descending") {
            setSortJarjestys("ascending");
            ikoni = "⬆️";
            teksti = "Click to sort alphabetically, click twice to sort by attack count from most attacks to least"
        } else {
            setSortJarjestys("alphabetical");
            ikoni = "🔤";
            teksti = "Click to sort by attack count from most attacks to least, click twice to sort by least attacks to most";
        }
        setSortIkoni(ikoni);
        setSortTeksti(teksti)
    };


    /**
     * Järjestää maat ja hyökkäykset valitun järjestystavan mukaisesti
     * @returns Taulukon järjestetyistä maista ja niiden hyokkäysmääristä
     */
    const jarjestaMaat = () => {
        const hyokkaysmaara = useMemo(() => {
            const attackCounts = {};
            maat.forEach((maa) => {
                attackCounts[maa] = getHyokkaysmaara(maa);
            });
            return attackCounts;
        }, [maat, getHyokkaysmaara]);
    
        if (sortJarjestys === "alphabetical") {
            return maat;
        } else {
            return [...maat].sort((a, b) => {
                if (sortJarjestys === "descending") {
                    return hyokkaysmaara[b] - hyokkaysmaara[a];
                } else if (sortJarjestys === "ascending") {
                    return hyokkaysmaara[a] - hyokkaysmaara[b];
                }
            });
        }
    };


    return (
        <table id="valituttaulukko">
        <thead>
            <tr className="valittutr" id='valittuOtsikot'>
                    <th className='thCountry'>Country</th>
                    <th id="hyokkaystenmaara"> Number of attacks </th>
                    <th id="nuoli" onClick={muutaSortJarjestys}>
                        <Question_Mark ikoni={sortIkoni} teksti={sortTeksti} style={{ cursor: "pointer"}}></Question_Mark>
                    </th>
            </tr>
        </thead>
        <tbody>
            {jarjestaMaat().map((maa, index) => (
            <tr className="valittutr" key={index}>
                <td>{maa}</td>
                <td className='tdAttackCount'>{getHyokkaysmaara(maa)}</td>
                <td className='tdRasti'>
                    <button
                        onClick={() => handleMaaPoisto(maa)}
                        style={{ cursor: 'pointer' }}
                    >
                        &#x2716;
                    </button>
                </td>
            </tr>
            ))}
        </tbody>
        </table>
    );
}

export default SelectedCountries;