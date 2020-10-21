import React, { useState } from 'react';

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

export default History;