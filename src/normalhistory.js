import React, { useState, useEffect } from 'react';

const History = (props) => {
  
  useEffect(() => {
  });
  
  const [ isDisplaying, toggleDisplay ] = useState(false);
  
  function toggleHistory() {
    return isDisplaying ? toggleDisplay(false) : toggleDisplay(true);
  }
  
  let calcHistoryStyle = {};
  if (isDisplaying) {
    calcHistoryStyle = {
      width: "14vw",
      visibility: "visible"
    }
   } else {
    calcHistoryStyle = {
      width: "0",
      visibility: "hidden"
    }
  }
  return (
    <div id="historyPanel">
      
      { isDisplaying ? <div id="history-toggle" onClick={toggleHistory}><i className="fas fa-chevron-left"></i></div> : <div id="history-toggle" onClick={toggleHistory}><i className="fas fa-chevron-right"></i></div>}
      <div id="calc-history" style={calcHistoryStyle}>
        <i className="fas fa-history" id="history-icon"></i>
        <div id="history">
          {props.history.map((item, index) => {
            return <div key={index}><h3>{item.expression}</h3><p>{item.result}</p></div>
          })}
        </div>
        { isDisplaying && <div id="wrapper">
          <div id="clear-history" onClick={props.clearHistory}><i className="fas fa-trash-alt"></i></div>
        </div>} 
      </div>
    </div>
  );
};

export default History;