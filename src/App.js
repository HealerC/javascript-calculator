import React from 'react';
import Display from './display';
import Buttons from './buttons';
import History from './history';
import './App.scss';
import CALC_CONSTANTS, { handleEquals } from './calculator-constants';

class App extends React.Component {
  /**
   *  Calculator app that persists data in the local storage
   *  so that the user can continue seeing previous calculations made.
   *  The state properties are majorly to pass to its child props to
   *  display it except "displayingEqusls" which is used to monitor 
   *  whether the calculator is displaying a value after the equal to 
   *  button was clicked.
   */
  constructor(props) {
    super(props);
    this.state = {
      expression: "",          // The expression to be evaluated.
      result: "",              // The expression shown at the auxillary display
                               // in order to see the calculator work as you
                               // begin to type in the numbers
      history: [],             // The previous calculations that has been done. 
                               // An array of objects of two properties corresponding
                               // to an expression and its result. It's values
                               // are stored in localStorage as JSON on each update.
      displayingEquals: false  // If the equals button is clicked when a valid
                               // expression has been typed. It is set to true
    }
    this.handleClick = this.handleClick.bind(this);
    this.clearHistory = this.clearHistory.bind(this);
    this.validateExpression = this.validateExpression.bind(this);
  }
  handleClick(event){
    // On the event that the user either clicked a button or 
    // press the corresponding key on the keyboard.
    const charClicked = event.target.id;      // The button the user clicked
    switch(charClicked) {
      case "clear":                           // Effectively clears the display
        this.setState({
          expression: "",
          result: ""
        });
        break;
      case "backspace":                 // Remove the last typed digit/operator
        this.setState((state) => {
          const newExpression = state.expression.substring(0, 
            state.expression.length-1);
          
          // The handleEquals allow calculations to be done as the user
          // is either inputing or deleting values but sometimes the 
          // expression is not valid one so then it is set to an empty string
          // in this case.
          let result = handleEquals(newExpression);
          if (isNaN(result)) {
            // An invalid expression
            result = "";
          }
          
          return {
            expression: newExpression,
            result: result
          }
        });
        break;
      case "equals":                // The equals button has been clicked
                                    // Leave if the expression was not valid
        this.setState((state) => {
          const result = handleEquals(state.expression);
          if (isNaN(result)) {
            return;
          }
          // Save to history. It's only when the equals button has been clicked
          // that the expression can be saved to history (if valid)
          let completeExpression = { expression: state.expression, result: result }
          state.history.push(completeExpression);
          return {
            expression: result,
            result: "",             // When displaying the result of an expression,
                                    // The other auxiliary that updates as
                                    // the user types should not display also
            history: state.history,
            displayingEquals: true  // It just performed an equals to operation
          }
        });
        break;
      /* Bunch of cases that handle operators /, * ,- ,+ */
      case "multiply":
      case "divide":
      case "subtract":
      case "add":
        this.setState((state) => {
          // The user can type in a number of operators and digits
          // in different formats in any manner even if it may render
          // the expression invalid. So the method checks to make sure 
          // that the user types in the next right thing. 
          let newExpression = this.validateExpression(state.expression, 
                              CALC_CONSTANTS[charClicked]);
          
          // Updating result display as the user types as previously explained
          let result = handleEquals(newExpression);
          if (isNaN(result)) {
            result = "";
          }
          return {
            expression: newExpression,    // Just the expression yet to be calculated
            result: result,               // Shows in case the expression is valid
            displayingEquals: false       // It did not just perform an equals to 
          }
        });
        break;
      /* Cases that handle digits 0-9*/
      default:
        const letterClicked = event.target.textContent;
        this.setState((state) => {
          // It'll still need to be validated (Needs less validation than 
          // operators though)
          let newExpression = this.validateExpression(state.expression, 
                              letterClicked);
          // Real-time updating (as usual)
          let result = handleEquals(newExpression);
          if (isNaN(result)) {
            result = "";
          }
          return {    // same as for operators
            expression: newExpression,
            result: result,
            displayingEquals: false
          }
        });
    }
  }
  
  validateExpression(expression, nextChar) {
    /* Well this is the function that validates an expression to see
    if it will allow the user to click the next number/operator. It takes
    the expression as parameter and nextChar as the next character (number 
    or operator) that wants to be added to the expression. 
    This method is a bit verbose but it works so let's just call it a day.*/
    if (this.state.displayingEquals === true) {
      // When an equals to operation has been done, clicking a new number
      // starts another expression.
      if (isNaN(nextChar) === false) {
        // But then the next character clicked must be a number. 
        // If an operator is supplied instead, then the operator appends
        // the expression and another expression is continued from the 
        // result of the previous.
        expression = "";
      }
    }
    if (expression === "") {
      // The default state. Nothing is actually in the expression
      // First char can start with "-" or a number or a decimal point in which
      // Zero will be appended before the decimal point.
      if (nextChar === '-' || nextChar === '.' || isNaN(nextChar) === false) {
        return nextChar === '.' ? "0." : nextChar;
      } else {
        return "";
      }
    }
    if (expression.charAt(expression.length-1) === '.' && isNaN(nextChar)) {
      // If there was a decimal point and the next character is an operator,
      // then zero should be appended to the expression before the next character
      // can be appended. This is to prevent multiple decimal points per number.
      nextChar === '.' ? expression += "" : expression += "0";
    }
    
    /* The Regex that is used to get the last group of numbers 
       or last operators in an expression */
    const digitRegex = /\d+[.0-9]*$/;
    const operatorRegex = /\W+$/;
    
    // The last group of numbers or operators the regex will match
    let lastCharGroup = "";
    
    if (digitRegex.test(expression)) {
      // The last group of characters are numbers with or without
      // a decimal point. e.g. 123, 1.23, 12.3, 123.0
      lastCharGroup = expression.match(digitRegex)[0];
      if (isNaN(nextChar) === false) {
        // The next character typed is a number just append it to the expression
        if (lastCharGroup.indexOf('.') === -1) {
          // If there is no decimal point in the expression, check if the number
          // starts with multiple zeros. If I add the next number to the previous
          // will the value of the previous change?
          return Number(lastCharGroup) == lastCharGroup+nextChar ? expression : expression += nextChar;          
        } else {
          // We can't test here because we cannot predict the extent of zeros a 
          // use can type when the number has a decimal point.
          return expression += nextChar;
          
        }
      } else if (nextChar === '.') {
        // A decimal point wants to be typed. There should be only one
        // decimal point in the number.
        return lastCharGroup.indexOf('.') === -1 ? expression += nextChar: 
                                                            expression;
      } else {
        // It is an operator - either /, *, -, +. It's okay. Just append it
        // like we did with the number
        return expression += nextChar;
      }
    } else {
      // The last group of characters are operators - may be more 
      // than one (e.g. *-, /-) or just one /, *, -, +.
      lastCharGroup = expression.match(operatorRegex)[0];
      if (lastCharGroup.length === 2) {
        // There are more than one operators present already
        // Maybe *- or /-. So if the next character is a number it gladly
        // appends it normally but if not then the operator replaces the
        // two operators present.
        if (isNaN(nextChar) === false) {
          // The next character is a number
          return expression += nextChar;
        } else {
          // The next character is an operator. Replace the TWO last characters
          let newExpression = expression.substring(0, expression.length-2) 
                              + nextChar;
          return newExpression;
        }
      } else {
        // There is just one operator present. If the next character is a
        // number, it's alright. Else if it's an operator, the operator should
        // either replace the present one or add to the present one based on 
        // if the present one is * or / and operator is - (so we can do *-, /-)
        if (expression.length === 1 && isNaN(nextChar)) {
          // There is only one operator present and it is the only 
          // expression (So it's probably -). Only a minus is allowed.
          // It does nothing effectively though as it just replaces
          // the old one.
          return nextChar === '-' ? nextChar : "";
        }
        if (isNaN(nextChar) === false) {
          // Just a number. Append it to the expression. (Numbers don't have
          // much problem as we can see)
          return expression += nextChar;
        } else if (nextChar === '-') {
          // If the new character is a - it can only add to the previous operators
          // if they are * or /
          if (lastCharGroup === '/' || lastCharGroup === '*') {
            return expression += nextChar;
          } else {
            // The new character is not a - .Just replace the previuos operator.
            let newExpression = expression.substring(0, expression.length-1)
                                + nextChar;
            return newExpression;
          }
        } else {
          // Every other condition failed. It's just an operator to be added
          // to an expression. No big deal about the - or * or / state.
          let newExpression = expression.substring(0, expression.length-1)
                                + nextChar;
            return newExpression;
        }
      }
    }
  }
  clearHistory(){
    this.setState({
      history: []
    });
  }
  
  componentDidMount() {
    /* Try to get the saved history if the user has previously used the
    calculator. It was saved in JSON format. */
    try {
      let storedHistory = JSON.parse(localStorage.getItem("jsCalcHistory"));
      // Returns null if there is no history saved.
      storedHistory ? this.setState({history: storedHistory}) : 
        this.setState({history: []});
    } catch (err) {
      alert(err);
    }
  }
  
  componentDidUpdate() {
    /* To make sure that the history pane is always scrolled to the bottom. 
    I may as well have done it in its own History component. My bad.*/
    const calcHistory = document.getElementById("calc-history");
    if (calcHistory.scrollHeight - calcHistory.scrollTop !== 
                                 calcHistory.clientHeight) {
      calcHistory.scrollTop = calcHistory.scrollHeight;
    }
    
    // Save the history to the local storage.
    localStorage.setItem("jsCalcHistory", JSON.stringify(this.state.history));
  }
  render() {
    return (
      <div id="calculator-app">
        <Display expression={this.state.expression} result={this.state.result} />
        <Buttons handleClick={this.handleClick} />
        <History history={this.state.history} clearHistory={this.clearHistory} />
        <div id="info">
          <p id="me">Designed by <a href="https://codepen.io/HealerC" 
            title="codepen@HealerC" target="_blank" rel="noopener noreferrer">Uyioghosa</a>
          </p>
          <p id="instructions"><b>Keys:</b> [0-9/*-+=], C, H, backspace, enter</p>
        </div>
      </div>
    );
  }
}

export default App;