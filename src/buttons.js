import React, { useEffect } from 'react';
import CALC_CONSTANTS from './calculator-constants';

const Buttons = (props) => {
  /* This component handles everything about buttons. 
  As a button is clicked or a togglekey is pressed on the keyboard
  It sends the event to the parent to take action accordingly. 
  Effects hook here to add and remove the key listener. */
  useEffect(() => {
    
    function handleKeyPress(event) {
      const keyPressed = event.key.toLowerCase();
      switch(keyPressed) {
        case '1': case '2': case '3': case '4': case '5': case '6': case '7':
        case '8': case '9': case '0': case '.': case '/': case '*': case '-': 
        case '+': case 'backspace': case '=': 
          const keys = Object.keys(CALC_CONSTANTS);
          let id = "";
          for (let key in keys) {
            // Each of the keyboard keys have an associated key in the object
            // CALC_CONSTANTS which corresponds to the id of the button to 
            // be pressed.
            if (CALC_CONSTANTS[keys[key]] === keyPressed) {
              // We've found our id :)
              id = keys[key];
            }
          }
          document.getElementById(id).click();
          break;
        case 'enter': 
          document.getElementById("equals").click();
          break;
        case 'c':
          document.getElementById("clear").click();
          break;
        case 'h':
          document.getElementById("history-toggle").click();
          break;
        default:
          return;
      }
    }
    document.addEventListener("keydown", handleKeyPress);
    
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    }
  });
  
  return (
    <div id="buttonPanel">
      {/* All the buttons in the app arranged here based on their arrangement
          in the calculator. From left-to-right, up-to-down */}
      <button id="clear" onClick={props.handleClick}>C</button>
      <button id="divide" className="operator" onClick={props.handleClick}>
        <i className="fas fa-divide"></i></button>
      <button id="multiply" className="operator" onClick={props.handleClick}>
        <i className="fas fa-times"></i></button>
      <button id="backspace" className="operator" onClick={props.handleClick}>
        <i className="fas fa-backspace"></i></button>
      
      <button id="seven" onClick={props.handleClick}>7</button>
      <button id="eight" onClick={props.handleClick}>8</button>
      <button id="nine" onClick={props.handleClick}>9</button>
      <button id="subtract" className="operator" onClick={props.handleClick}>
        <i className="fas fa-minus"></i></button>
      
      <button id="four" onClick={props.handleClick}>4</button>
      <button id="five" onClick={props.handleClick}>5</button>
      <button id="six" onClick={props.handleClick}>6</button>
      <button id="add" className="operator" onClick={props.handleClick}>
        <i className="fas fa-plus"></i></button>
      
      <button id="one" onClick={props.handleClick}>1</button>
      <button id="two" onClick={props.handleClick}>2</button>
      <button id="three" onClick={props.handleClick}>3</button>
      <button id="equals" onClick={props.handleClick}><span style={{opacity:"0"}}>=</span><i className="fas fa-equals"></i></button>
      
      <button id="zero" onClick={props.handleClick}>0</button>
      <button id="decimal" onClick={props.handleClick}>.</button>
    </div>
  );
};

export default Buttons;