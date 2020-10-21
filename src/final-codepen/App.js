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
          <p id="me">Made by <a href="https://codepen.io/HealerC" 
            title="codepen@HealerC" target="_blank" rel="noopener noreferrer">Uyioghosa</a>
          </p>
          <p id="instructions"><b>Keys:</b> [0-9/*-+=], C, H, backspace, enter</p>
        </div>
      </div>
    );
  }
}
/* THE DISPLAY COMPONENT */
const Display = (props) => {
  /* The role is to display the expression being typed and the 
   * result it gives after equal. The "auxillary" shows real-time 
   * result while the "display" shows the expression as it is being
   * typed as well as the result when equals is clicked. When it shows
   * the result of an equals though, the auxiliary doesn't show.
   */
  //const DMSA_REGEX_GROUP = /\/|\*|-|\+/g;
  
  // Fontawesome icons are used in displaying *, / + sign so the regex 
  // gets these operators and replaces them with the fontawesome alternatives
  const DMSA_REGEX_GROUP = /\/|\*|\+/g;
  
  let modifiedExpression = props.expression;
  modifiedExpression = modifiedExpression.replace(DMSA_REGEX_GROUP, (match) => {
    switch(match) {
      case '+':
        return "<i class='fas fa-plus'></i>";
      case '-':
        return "<i class='fas fa-minus'></i>";
      case '*':
        return "<i class='fas fa-times'></i>";
      case '/':
        return "<i class='fas fa-divide'></i>";
      default:
        return match;
    }
  });
  
  return (
    <div id="displayPanel">
      {/* When there is nothing provided as expression it renders as 0 --> 
      The dangerouslySetInnerHTML is to render the fontawesome icons as html*/}
      { props.expression === "" ? <h1 id="display">0</h1> :
          <h1 id="display" dangerouslySetInnerHTML=
            {{__html: modifiedExpression}}></h1>
      }
      
      {/* Real-time display of results. */}
      { props.result === "" ? <h2 id="auxiliary">&nbsp;</h2> : 
                              <h2 id="auxiliary">{props.result}</h2> }
    </div>
  );
}

/* THE BUTTON COMPONENT */
const { useEffect } = React

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


/* THE HISTORY COMPONENT */
const { useState } = React;
const History = (props) => {
  /* The component that shows all the calculations made in the 
  app. */
  
  // If the history panel with history is displaying or hidden.
  const [ isDisplaying, toggleDisplay ] = useState(false);
  
  // Toggle the history panel from displaying to hide and vice-versa
  function toggleHistory() {
    return isDisplaying ? toggleDisplay(false) : toggleDisplay(true);
  }
  
  
  /* The widthType and heightType variables are used in relation
  to responsive web design. On a smaller device the height of the 
  history is considered as the history will appear landscape and
  underneath the calculator. On a larger one though, the height of the 
  history will be portrait and at the right side of the calculator so
  it is the width that will be continuously changed  */
  const widthType = {width: "14vw"};    // Bigger device. Width = 0
  const heightType = {height: "20vh"};  // Smaller device. Height = 0
  let calcHistoryProperty = {};         // The style it toggles depending 
                                        // on the screen size.
  if (window.screen.width <= 480) {
    calcHistoryProperty = heightType;
  } else {
    calcHistoryProperty = widthType;
  }
  
  // The style on if the history is displaying or not
  let calcHistoryStyle = {};
  if (isDisplaying) {
    // Here it simply sets its visibiity to visible.
    calcHistoryStyle = calcHistoryProperty;
    calcHistoryStyle.visibility = "visible";
   } else {
     // Here we don't know which property we have to set to 0 to 
     // hide the component as it could be width or height depending
     // on the screen size.
    let property = Object.keys(calcHistoryProperty)[0]; // The property
    calcHistoryStyle = {
      [property]: 0,
      visibility: "hidden"
    }
  }
  return (
    <div id="historyPanel">
      {/* Show a different icon when the history is hidden or not */}
      { isDisplaying ? <div id="history-toggle" onClick={toggleHistory}>
                          <i className="fas fa-chevron-left"></i></div> : 
                       <div id="history-toggle" onClick={toggleHistory}>
                          <i className="fas fa-chevron-right"></i></div>}
      
      {/* The calc-histoy may not or may not show (default) because of 
      the style given */}
      <div id="calc-history" style={calcHistoryStyle}>
        <i className="fas fa-history" id="history-icon"></i>
        
        <div id="history">
          {/* It should not show any thing from history props if it is null */}
          { props.history && props.history.map((item, index) => {
            return <div key={index}><h3>{item.expression}</h3><p>{item.result}</p></div>
          })}
        </div>
        
          {/* A wrapper div that enables the clear button which is its child
            to show the way did. Actually I don't understand how but it works so...*/}
        { isDisplaying && <div id="wrapper">
              <div id="clear-history" onClick={props.clearHistory}>
              <i className="fas fa-trash-alt"></i></div>
            </div> }  
      </div>
      
    </div>
  );
};

/* FUNCTIONS AND OBJECTS USED IN CALCULATIONS*/

/* Calc constants maps the id of the buttons to the values that 
will be used in the program*/
const CALC_CONSTANTS = {
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
  zero: '0',
  decimal: '.',
  divide: '/',
  multiply: '*',
  subtract: '-',
  add: '+',
  clear: 'c',
  backspace: 'backspace',
  equals: '='
}
function handleEquals(expression) {
  /* Evaluates the expression and returns the result. The expression is 
  split into groups by regex and using BODMSA-ish type of calculation, 
  evaluates the expression*/
  const re = /\d+[.0-9]*|(?<=\B)-\d+[.0-9]*|(?<=\B)\+\d+[.0-9]*|\D/g;
  let stack = expression.match(re);         // The expression split into numbers
                                            // and characters
  const BODMAS = ["/", "*", "-", "+"];      // Each of the operators 
                                            // will be tested in this order
  for (let i = 0; i < BODMAS.length; i++) {
    let presentOperator = BODMAS[i];        // The present operator
    
    if (expression.indexOf(presentOperator) >= 0) {
      // Is the operator even in the expression
      for (let j = 1; j < stack.length; j += 2) { // valid expressions have the operators
                                                  // At even positions
        if (stack[j] === presentOperator) {
          /* An operator is found. Get the value before it and after it,
          calculate it applying the operator and replace it in the array.
          */
          let x = stack[j-1];
          let y = stack[j+1];
          const result = calculate(x, y, presentOperator);
          let elementsBeforeX = stack.slice(0, j-1);
          let elementsAfterY = stack.slice(j+2);
          let newStack = [...elementsBeforeX, result, ...elementsAfterY];
          stack = newStack;
          j -= 2;               // So that we don't skip any operator 
                                // after a calculation
        }
      }
    }
  }
  try {
    return stack[0].toString();
  } catch(err) {
    return NaN;
  }
}
function calculate(x, y, operator) {
  x = Number(x);
  y = Number(y);
  switch(operator) {
    case '/':
      return x / y;
    case '*':
      return x * y;
    case '+':
      return x + y;
    case '-':
      return x - y;
    default:
      return -1;
  }
}

ReactDOM.render(<App />, document.getElementById('root'));