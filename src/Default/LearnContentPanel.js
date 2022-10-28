import React, { useRef,useEffect, useState } from 'react';
import WebCamPanel from './WebCamPanel';
import Timer from './Timer';
import HoldBowHelp from './HoldBowHelp';

import './LearnContentPanel.css';
import styled from "styled-components"
import ReactDOM from 'react-dom';

const LearnContentPanel = props => {
    console.log("props.activity");
    console.log(props.activity);
    const theme = {
        blue: {
            default: "#3f51b5",
            hover: "#283593"
        },
        pink: {
            default: "#e91e63",
            hover: "#ad1457"
        }
        };
        
    const Button = styled.button`
        background-color: ${(props) => theme[props.theme].default};
        color: white;
        padding: 5px 15px;
        border-radius: 5px;
        outline: 0;
        text-transform: uppercase;
        margin: 10px 0px;
        cursor: pointer;
        box-shadow: 0px 2px 2px lightgray;
        transition: ease background-color 250ms;
        &:hover {
            background-color: ${(props) => theme[props.theme].hover};
        }
        &:disabled {
            cursor: default;
            opacity: 0.7;
        }
        `;
        
    Button.defaultProps = {
        theme: "blue"
        };

    useEffect(() => {
        console.log("LearnContentPanel:useEffect...")
        //ReactDOM.render(<LearnContentPanel activity={props.activity}/>, document.getElementById('learnContentPanel'));
    }, [props.activity])

    useEffect(() => {
        return () => {
            console.log("LearnContentPanel:useEffect Unload...")
            //chart.current.removeChild(chart.current.children[0])
            console.log(document.getElementById("webCam"))
            /*var videoElement = document.getElementById('webCam');
            videoElement.pause();
            videoElement.removeAttribute('src'); // empty source
            videoElement.load();*/
            // Anything in here is fired on component unmount.
        }   
    }, [])
      

    const onClick = (event) => {
        console.log("props.activity")
        console.log(props.activity)
        var videoElement = document.getElementById('webCam');
        if(videoElement){
        videoElement.pause();
        videoElement.removeAttribute('src'); // empty source
        videoElement.load();
        console.log("Remove webCam...")
        }

        ReactDOM.render(<WebCamPanel activity={props.activity}/>, document.getElementById('learnContentPanel'));
    };

    return (
        <div id="learnContentPanel">
                
                <div className="learnContentHelpPanel">
                    <div>
                        <h1 style={{fontSize: "50px", top:"-30px"}}>Instructions</h1>
                    </div>

                    {props.activity == '100' ? 
                        <HoldBowHelp/>
                    : props.activity == '101' ? 
 
                        <div className="parent">
                            <div className="child1">
                                <div><img src="imgs/blob.svg" style={{width: "130px", height: "130px", top: "250px"}}/></div>
                                <div><img src="imgs/blob1.svg" style={{width: "130px", height: "130px", top: "250px", left: "500px"}}/></div>
                                <div><img src="imgs/blob2.svg" style={{width: "130px", height: "130px", top: "250px", left: "970px"}}/></div>
                            </div>
                            <div className="child1 child2"> 
                                <div><h3 style={{width: "130px", height: "110px", top: "245px"}}>1.</h3></div>
                                <div><h3 style={{width: "130px", height: "110px", top: "245px", left:"500px"}}>2.</h3></div>
                                <div><h3 style={{width: "130px", height: "70px", top: "245px", left:"970px"}}>3.</h3></div>
                            </div>
                            <div className="buttons child1 child2">
                                <div><p className="ptag" style={{width: "390px",position:"absolute", top: "-40px", left: "60px"}}>101 Accept camera access and wait for the webcam to load.</p></div>
                                <div><p className="ptag" style={{width: "390px",position:"absolute", top: "90px", left: "60px"}}>Perform the pose and hold for 30 seconds</p></div>
                                <div><p className="ptag" style={{width: "390px",position:"absolute", top: "220px", left: "60px"}}>The timer will restart if you make a mistake.</p></div>
                                <img src="imgs/allow.png" style={{position:"absolute", top: "-20px", left: "450px", height:"90px", borderStyle: "solid"}}/>
                            </div>
                        </div>
                     : props.activity == '102' ? 
 
                     <div className="parent">
                         <div className="child1">
                             <div><img src="imgs/blob.svg" style={{width: "130px", height: "130px", top: "250px"}}/></div>
                             <div><img src="imgs/blob1.svg" style={{width: "130px", height: "130px", top: "250px", left: "500px"}}/></div>
                             <div><img src="imgs/blob2.svg" style={{width: "130px", height: "130px", top: "250px", left: "970px"}}/></div>
                         </div>
                         <div className="child1 child2"> 
                             <div><h3 style={{width: "130px", height: "110px", top: "245px"}}>1.</h3></div>
                             <div><h3 style={{width: "130px", height: "110px", top: "245px;", left:"500px"}}>2.</h3></div>
                             <div><h3 style={{width: "130px", height: "70px", top: "245px", left:"970px"}}>3.</h3></div>
                         </div>
                         <div className="buttons child1 child2">
                             <div><p className="ptag" style={{width: "390px",position:"absolute", top: "-40px", left: "60px"}}>102 Accept camera access and wait for the webcam to load.</p></div>
                             <div><p className="ptag" style={{width: "390px",position:"absolute", top: "90px", left: "60px"}}>Perform the pose and hold for 30 seconds</p></div>
                             <div><p className="ptag" style={{width: "390px",position:"absolute", top: "220px", left: "60px"}}>The timer will restart if you make a mistake.</p></div>
                             <img src="imgs/allow.png" style={{position:"absolute", top: "-20px", left: "450px", height:"90px", borderStyle: "solid"}}/>
                         </div>
                     </div>
                :
                        <div></div>
                    }

                    <div >
                            <Button style={{fontSize: "40px", left:"580px", top:"200px"}} onClick={onClick}>
                            Start
                            </Button>
                    </div>
                </div>
        </div>
    );
  }

  export default LearnContentPanel