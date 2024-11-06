import React from 'react';


const Dropdown = (props) => {

    const valinnat = [];

    for (let i = 0; i < props.content.length; i++){
        const apu = valinnat.push({label: props.content[i], value: props.content[i]});
        valinnat = apu;
    }

    

    return (
        <select>
            {valinnat.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
            ))}
        </select>
    )
}

export default Dropdown;