import React, { useState } from 'react';

function SelectedCountries({ maat, getAttackCount, handleMaaPoisto }) {
    const [sortOrder, setSortOrder] = useState("alphabetical");
    const [thText, setThText] = useState("Number of attacks🔤");

    const handleSort = () => {
        let text = "Number of attacks";
        if (sortOrder === "alphabetical") {
            setSortOrder("descending");
            text = text + "⬆️";
        } else if (sortOrder === "descending") {
            setSortOrder("ascending");
            text = text + "⬇️";
        } else {
            setSortOrder("alphabetical");
            text = text + "🔤";
        }
        setThText(text)
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
                    <th id="hyokkaystenmaara" onClick={handleSort} style={{ cursor: "pointer"}}> {thText}</th>
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