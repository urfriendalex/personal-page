import React from 'react';

export const splitToSpans = (text, delimeter, parentDivClassName) =>
{
    return <div className={parentDivClassName}>
        {text.split(delimeter).map((letter, idx) => (
            <span key={idx}>{letter}</span>
        ))}
    </div>
}