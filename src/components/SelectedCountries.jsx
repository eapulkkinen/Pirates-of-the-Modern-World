import React, { useState } from 'react';

function SelectedCountries({ maat, getAttackCount, handleMaaPoisto }) {
    const [sortOrder, setSortOrder] = useState("alphabetical");
    var suuntaNuoli = document.getElementById("nuoli");
    const handleSort = () => {
        if (sortOrder === "alphabetical") {
            setSortOrder("descending");
            suuntaNuoli.innerText = "⬆️"; //Suurin määrä ensin
        }
        else if (sortOrder === "descending") {
            setSortOrder("ascending");
            suuntaNuoli.innerText = "⬇️"; //Pienin määrä ensin
        }
        else {
            setSortOrder("alphabetical")
            suuntaNuoli.innerText = "🔤"; //Aakkosjärjestys
        }
    };

    const sortedMaat = () => {
        if (sortOrder === "alphabetical") {
            return maat;
        } 
        else {
            return [...maat].sort((a, b) => {
                if (sortOrder === "descending") {
                    return getAttackCount(b) - getAttackCount(a);
                } 
                else if (sortOrder === "ascending") {
                    return getAttackCount(a) - getAttackCount(b);
                }
                return [];
            });
        }
    };

    return (
        <table id="valituttaulukko">
        <thead>
            <tr className="valittutr">
                <th className='thCountry'>Country</th>
                <div id="hyokkaystenmaara" onClick={handleSort} style={{ cursor: "pointer"}}>
                    <th>Number of attacks</th>
                    <th id="nuoli">🔤</th>
                </div>
            </tr>
        </thead>
        <tbody>
            {sortedMaat().map((maa, index) => (
            <tr className="valittutr" key={index}>
                <td>{maa}</td>
                <td className='tdAttackCount'>{getAttackCount(maa)}</td>
                <td>
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