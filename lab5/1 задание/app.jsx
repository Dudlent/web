import React from "react";
import ReactDOM from "react-dom";
let age = "19";
let name = "Nicita";
let output = <span>{name} is {age} years old</span>;
ReactDOM.render(output, document.querySelector("#myDiv"));