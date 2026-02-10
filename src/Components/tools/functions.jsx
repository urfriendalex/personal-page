import React from "react";

export const splitToSpans = (text, delimeter) => {
  return (
    <>
      {text.split(delimeter).map((letter, idx) => (
        <span key={idx}>{letter}</span>
      ))}
    </>
  );
};