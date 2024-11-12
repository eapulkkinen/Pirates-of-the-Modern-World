import React, { useState } from 'react';

function SelectedCountries({ maat, getAttackCount, handleMaaPoisto }) {
    
    return (
        <table>
        <thead>
            <tr>
                <th>Country</th>
                <th>Number of attacks</th>
            </tr>
        </thead>
        <tbody>
            {maat.map((maa, index) => (
            <tr key={index}>
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