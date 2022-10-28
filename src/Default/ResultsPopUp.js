import React from "react";
import './LearnContentPanel.css';


const ResultPopUp = props => {
    return (
      <div className="popup-box">
        <div className="box">
          <span className="close-icon" onClick={props.handleClose}>x</span>
          <span className="popup-content"> {props.content}</span>
        </div>
      </div>
    );
  };

  export default ResultPopUp;