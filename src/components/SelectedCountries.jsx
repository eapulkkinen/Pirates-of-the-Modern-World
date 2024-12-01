import React, { useState } from 'react';

function SelectedCountries({ maat, getAttackCount, handleMaaPoisto }) {
    const [sortOrder, setSortOrder] = useState("alphabetical");
    const [thIcon, setThIcon] = useState("🔤");

    const handleSort = () => {
        let icon = "🔤";
        if (sortOrder === "alphabetical") {
            setSortOrder("descending");
            icon = "⬆️";
        } else if (sortOrder === "descending") {
            setSortOrder("ascending");
            icon = "⬇️";
        } else {
            setSortOrder("alphabetical");
            icon = "🔤";
        }
        setThIcon(icon);
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
<<<<<<< HEAD
                    <th id="hyokkaystenmaara" onClick={handleSort} style={{ cursor: "pointer"}}> Number of attacks </th>
                    <th id="nuoli" onClick={handleSort} style={{ cursor: "pointer"}}> {thIcon}</th>
=======
                    <th id="hyokkaystenmaara" onClick={handleSort} style={{ cursor: "pointer"}}> {thText}</th>
>>>>>>> 2487e6e (CSS asettelua)
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