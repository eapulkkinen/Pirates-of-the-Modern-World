import React, { useState } from 'react';
import { useMemo } from 'react';


/**
 * Tähän käyttöoikeudet
 */
function SelectedCountries({ maat, getHyokkaysmaara, handleMaaPoisto }) {
    const [sortJarjestys, setSortJarjestys] = useState("alphabetical");
    const [sortIkoni, setSortIkoni] = useState("🔤");


    /**
     * Muuttaa sorttaus järjestyksen ja ikonin sen mukaan
     */
    const muutaSortJarjestys = () => {
        let ikoni = "🔤";
        if (sortJarjestys === "alphabetical") {
            setSortJarjestys("descending");
            ikoni = "⬇️";
        } else if (sortJarjestys === "descending") {
            setSortJarjestys("ascending");
            ikoni = "⬆️";
        } else {
            setSortJarjestys("alphabetical");
            ikoni = "🔤";
        }
        setSortIkoni(ikoni);
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
                    <th id="hyokkaystenmaara" onClick={muutaSortJarjestys} style={{ cursor: "pointer"}}> Number of attacks </th>
                    <th id="nuoli" onClick={muutaSortJarjestys} style={{ cursor: "pointer"}}> {sortIkoni}</th>
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