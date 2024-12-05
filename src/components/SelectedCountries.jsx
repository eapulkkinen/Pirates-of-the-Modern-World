import React, { useState } from 'react';
import { useMemo } from 'react';

function SelectedCountries({ maat, getHyokkaysmaara, handleMaaPoisto }) {
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
        const attackCounts = useMemo(() => {
            const attackCounts = {};
            maat.forEach((maa) => {
                attackCounts[maa] = getHyokkaysmaara(maa);
            });
            return attackCounts;
        }, [maat, getHyokkaysmaara]);
    
        if (sortOrder === "alphabetical") {
            return maat;
        } else {
            return [...maat].sort((a, b) => {
                if (sortOrder === "descending") {
                    return attackCounts[b] - attackCounts[a];
                } else if (sortOrder === "ascending") {
                    return attackCounts[a] - attackCounts[b];
                }
            });
        }
    };

    return (
        <table id="valituttaulukko">
        <thead>
            <tr className="valittutr" id='valittuOtsikot'>
                    <th className='thCountry'>Country</th>
                    <th id="hyokkaystenmaara" onClick={handleSort} style={{ cursor: "pointer"}}> Number of attacks </th>
                    <th id="nuoli" onClick={handleSort} style={{ cursor: "pointer"}}> {thIcon}</th>
            </tr>
        </thead>
        <tbody>
            {sortedMaat().map((maa, index) => (
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