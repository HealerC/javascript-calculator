import React from 'react';

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

export default Display;