import React, { useState } from 'react';

function SelectedCountries({ maat, getAttackCount, handleMaaPoisto }) {
    const [sortOrder, setSortOrder] = useState("alphabetical");
    var suuntaNuoli = document.getElementById("nuoli");
    const handleSort = () => {
        if (sortOrder === "alphabetical") {
            setSortOrder("descending");
            suuntaNuoli.innerText = "⬆️";
        }
        else if (sortOrder === "descending") {
            setSortOrder("ascending");
            suuntaNuoli.innerText = "⬇️";
        }
        else {
            setSortOrder("alphabetical")
            suuntaNuoli.innerText = "";
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
                <th>Country</th>
                <th onClick={handleSort} style={{ cursor: 'pointer' }}>Number of attacks</th>
                <th id="nuoli"></th>
            </tr>
        </thead>
        <tbody>
            {sortedMaat().map((maa, index) => (
            <tr className="valittutr" key={index}>
                <td>{maa}</td>
                <td>{getAttackCount(maa)}</td>
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