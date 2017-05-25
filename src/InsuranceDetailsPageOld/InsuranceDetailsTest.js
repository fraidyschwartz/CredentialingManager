import React from 'react';

export default function Form(props) {
    function createRow(n) {
        let checked = false;
        let currentNumber = props.chosen.find(c => parseInt(c) === n);
        if(currentNumber) {
            checked = true;
        }
        return (
            <div key={n} >
                <label>{n}</label>
                <input checked={checked} onClick={props.handler} type="checkbox" value={n} />
            </div>
        )
    }

    return (
        <form>
            {props.numbers.map(n => createRow(n))}
            <br />
        </form>
    )
} 