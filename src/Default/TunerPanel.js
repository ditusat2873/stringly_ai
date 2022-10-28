import React, { useRef,useEffect } from 'react';
import {getMenuItems} from './MenuItems';
import styled from "styled-components"
import Tuner from './Tuner/Tuner';
import YouTube from 'react-youtube';
import './LearnContentPanel.css';

const LearnMainPanel = props => {
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

    const opts = {
        height: '500',
        width: '900',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
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

    const webcampRef = useRef(null);
    const canvasRef = useRef(null);
    const [activity, setActivity] = React.useState('');
    const [showWebCam, setShowWebCam] = React.useState(false);

    let stuff;

    const handleChange = (event) => {
        setActivity(event.target.value);
        setShowWebCam(false);
        console.log("event.target.value");
        console.log(event.target.value);
    };
  
    const menuItems = getMenuItems(props.name);
    console.log("props.name-> " + props.name);
    console.log("menuItems-> ");
    console.log(menuItems);

    useEffect(() => {
        console.log("LearnMainPanel:useEffect()")
        return () => {
            console.log("LearnMainPanel:useEffect() Unload...")
            // Anything in here is fired on component unmount.
        }   
    }, [])

    const onClick = (event) => {
        console.log("props.activity")
        setShowWebCam(true);
        console.log(props.activity)
        var videoElement = document.getElementById('webCam');
        if(videoElement){
        videoElement.pause();
        videoElement.removeAttribute('src'); // empty source
        videoElement.load();
        console.log("Remove webCam...")
        }
    };
 
    return (
        <div className="mainPanel">
            <div id="learnContentPanel">
                {showWebCam ?<Tuner/>
                :
                <div className="learnContentHelpPanel">
                    <div>
                        <h1 style={{fontSize: "50px", top:"-30px"}}>Instructions</h1>
                    </div>
                    <div className="parent">
                        <div className="child1">
                            <div><img src="imgs/blob.svg" style={{width: "130px", height: "130px", top: "250px"}}/></div>
                            <div></div>
                            <div></div>
                        </div>
                        <div className="child1 child2"> 
                            <div><p className="indextag" style={{width: "130px",position:"absolute", top: "-30px", left: "-25px"}}>1</p></div>
                            <div></div>
                            <div></div>
                        </div>
                        <div className="buttons child1 child2">
                            <div><p className="ptag" style={{width: "500px",position:"absolute", top: "-40px", left: "60px"}}>Use the Tuner to tune your stringed instrument. Click the Start button below to get started. Click Stop, once done.</p></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>

                        <div className="buttonDiv">
                                <Button style={{fontSize: "40px", left:"580px", top:"200px"}} onClick={onClick}>
                                Start
                                </Button>
                        </div>
                        <div className="youtubeDiv">
                                <YouTube videoId="AxKMs5bn87Y" opts={opts}/>
                        </div>
                </div>
                }
        </div>
        </div>
    );
  }
  //{activity!='' ?  <LearnContentPanel activity={activity}/>:

  /*
            {activity=='100' ?  <HoldBowHelp/>:
                <div className="learnMainHelp">
                    <img src="imgs/blob3.svg" style={{width: "600px", height: "600px", left: "-210px",top: "-300px"}}/>
                    <div><h1 style={{fontSize:"50px", top:"-30px"}}>Instructions</h1>TO DO.....</div>
                </div>
            }
*/

  export default LearnMainPanel