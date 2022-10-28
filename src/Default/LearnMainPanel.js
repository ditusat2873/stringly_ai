import React, { useRef,useEffect } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {getMenuItems} from './MenuItems';
import HoldBowHelp from './HoldBowHelp';
import styled from "styled-components"
import WebCamPanel from './WebCamPanel';
import YouTube from 'react-youtube';
import './LearnContentPanel.css';
import './Tuner/styles.css';
import { makeStyles} from "@material-ui/core/styles";

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
    const [player, setPlayer] = React.useState();


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

    const opts = {
        height: '500',
        width: '900',
        playerVars: {
          // https://developers.google.com/youtube/player_parameters
          autoplay: 0,
        }
    };

    useEffect(() => {
        console.log("LearnMainPanel:useEffect()")
        return () => {
            console.log("LearnMainPanel:useEffect() Unload...")
            setShowWebCam(false);
            setActivity('');

            // Anything in here is fired on component unmount.
        }   
    }, [props.name])

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
    const onClickVideo = (event) => {
        console.log("props.activity", player.getCurrentTime());
        player.pauseVideo();
        player.seekTo(5, true);
    }
    const _onReady = (event) => {
        // access to player in all event handlers via event.target
        //event.target.playVideo();
        //event.target.seekTo(20, true);
        setPlayer(event.target);
        console.log("Video Paused!!!", event.target.getPlaybackRate(), event.target.getCurrentTime())
      }

      const useStyles = makeStyles({
        select: {
            '&:before': {
                borderColor: 'red',
            },
            '&:after': {
                borderColor: 'red',
            },
            '&:not(.Mui-disabled):hover::before': {
                borderColor: 'red',
            },
        },
        icon: {
            fill: 'black',
        },
        root: {
            color: 'black',
        },
    })
    const inputLabelStyle = {
        color: 'blue',
      };
      const formHelperTextStyle = {
        color: 'blue',
        fontSize:'0.9em'
      };
    const classes = useStyles();

    return (
        <div className="mainPanel">
            <div className="select visible transition-all bg-blue-200 text-black text-center py-1 mt-2 rounded-xl shadow-lg w-100 ">
                <FormControl variant="filled" sx={{ m: 1, minWidth: 140 }}>
                    <InputLabel style={inputLabelStyle} id="demo-simple-select-helper-label">Select Activity...</InputLabel>
                    <Select
                        labelId="activity-select-helper-label"
                        id="activity-select-helper"
                        value={activity}
                        label="Activity"
                        onChange={handleChange}
                        className={classes.select}
                        inputProps={{
                            classes: {
                                icon: classes.icon,
                                root: classes.root
                            },
                        }}
                    >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {menuItems.map(function(d, idx){
                        return (d.enabled?<MenuItem value={d.key}>{d.name}</MenuItem>:<MenuItem disabled value={d.key}>{d.name}</MenuItem>)
                    })}
                    </Select>
                    <FormHelperText  style={formHelperTextStyle}>Select the activity you want to explore from the list above.</FormHelperText>
                </FormControl>
            </div>
            <div id="learnContentPanel">
                {showWebCam ?<WebCamPanel activity={activity}/>
                :
                <div className="learnContentHelpPanel">
                    <div>
                        <h1 style={{fontSize: "50px", top:"-30px"}}>Instructions</h1>
                    </div>

                    {activity == '100' ? 
                        <HoldBowHelp/>
                    : activity == '101' ? 
 
                        <div className="parent">
                            <div className="child1">
                                <div><img src="imgs/blob.svg" style={{width: "130px", height: "130px", top: "250px"}}/></div>
                                <div><img src="imgs/blob1.svg" style={{width: "130px", height: "130px", top: "250px", left: "500px"}}/></div>
                                <div><img src="imgs/blob2.svg" style={{width: "130px", height: "130px", top: "250px", left: "970px"}}/></div>
                            </div>
                            <div className="child1 child2"> 
                                <div><p className="indextag" style={{width: "130px",position:"absolute", top: "-30px", left: "-25px"}}>1</p></div>
                                <div><p className="indextag" style={{width: "130px",position:"absolute", top: "100px", left: "-25px"}}>2</p></div>
                                <div><p className="indextag" style={{width: "130px",position:"absolute", top: "220px", left: "-25px"}}>3</p></div>
                            </div>
                            <div className="buttons child1 child2">
                                <div><p className="ptag" style={{width: "500px",position:"absolute", top: "-40px", left: "60px"}}>101 Accept camera access and wait for the webcam to load.</p></div>
                                <div><p className="ptag" style={{width: "500px",position:"absolute", top: "90px", left: "60px"}}>Perform the pose and hold for 30 seconds</p></div>
                                <div><p className="ptag" style={{width: "500px",position:"absolute", top: "220px", left: "60px"}}>The timer will restart if you make a mistake.</p></div>
                                <img className="border-solid" src="imgs/allow.png" style={{position:"absolute", top: "30px", left: "350px", height:"90px"}}/>
                            </div>
                        </div>
                     : activity == '102' ? 
 
                     <div className="parent">
                            <div className="child1">
                                <div><img src="imgs/blob.svg" style={{width: "130px", height: "130px", top: "250px"}}/></div>
                                <div><img src="imgs/blob1.svg" style={{width: "130px", height: "130px", top: "250px", left: "500px"}}/></div>
                                <div><img src="imgs/blob2.svg" style={{width: "130px", height: "130px", top: "250px", left: "970px"}}/></div>
                            </div>
                            <div className="child1 child2"> 
                                <div><p className="indextag" style={{width: "130px",position:"absolute", top: "-30px", left: "-25px"}}>1</p></div>
                                <div><p className="indextag" style={{width: "130px",position:"absolute", top: "100px", left: "-25px"}}>2</p></div>
                                <div><p className="indextag" style={{width: "130px",position:"absolute", top: "220px", left: "-25px"}}>3</p></div>
                            </div>
                            <div className="buttons child1 child2">
                                <div><p className="ptag" style={{width: "500px",position:"absolute", top: "-40px", left: "60px"}}>102 Accept camera access and wait for the webcam to load.</p></div>
                                <div><p className="ptag" style={{width: "500px",position:"absolute", top: "90px", left: "60px"}}>Perform the pose and hold for 30 seconds</p></div>
                                <div><p className="ptag" style={{width: "500px",position:"absolute", top: "220px", left: "60px"}}>The timer will restart if you make a mistake.</p></div>
                                <img className="border-solid" src="imgs/allow.png" style={{position:"absolute", top: "30px", left: "350px", height:"90px"}}/>
                            </div>
                     </div>
                      : activity == '200' ? 
 
                      <div className="parent">
                             <div className="child1">
                                 <div><img src="imgs/blob.svg" style={{width: "130px", height: "130px", top: "250px"}}/></div>
                                 <div><img src="imgs/blob1.svg" style={{width: "130px", height: "130px", top: "250px", left: "500px"}}/></div>
                                 <div><img src="imgs/blob2.svg" style={{width: "130px", height: "130px", top: "250px", left: "970px"}}/></div>
                             </div>
                             <div className="child1 child2"> 
                                 <div><p className="indextag" style={{width: "130px",position:"absolute", top: "-30px", left: "-25px"}}>1</p></div>
                                 <div><p className="indextag" style={{width: "130px",position:"absolute", top: "100px", left: "-25px"}}>2</p></div>
                                 <div><p className="indextag" style={{width: "130px",position:"absolute", top: "220px", left: "-25px"}}>3</p></div>
                             </div>
                             <div className="buttons child1 child2">
                                 <div><p className="ptag" style={{width: "500px",position:"absolute", top: "-40px", left: "60px"}}>200 Accept camera access and wait for the webcam to load.</p></div>
                                 <div><p className="ptag" style={{width: "500px",position:"absolute", top: "90px", left: "60px"}}>Perform the pose and hold for 30 seconds</p></div>
                                 <div><p className="ptag" style={{width: "500px",position:"absolute", top: "220px", left: "60px"}}>The timer will restart if you make a mistake.</p></div>
                                 <img className="border-solid" src="imgs/allow.png" style={{position:"absolute", top: "30px", left: "350px", height:"90px"}}/>
                             </div>
                      </div>
                      : activity == '201' ? 
 
                      <div className="parent">
                             <div className="child1">
                                 <div><img src="imgs/blob.svg" style={{width: "130px", height: "130px", top: "250px"}}/></div>
                                 <div><img src="imgs/blob1.svg" style={{width: "130px", height: "130px", top: "250px", left: "500px"}}/></div>
                                 <div><img src="imgs/blob2.svg" style={{width: "130px", height: "130px", top: "250px", left: "970px"}}/></div>
                             </div>
                             <div className="child1 child2"> 
                                 <div><p className="indextag" style={{width: "130px",position:"absolute", top: "-30px", left: "-25px"}}>1</p></div>
                                 <div><p className="indextag" style={{width: "130px",position:"absolute", top: "100px", left: "-25px"}}>2</p></div>
                                 <div><p className="indextag" style={{width: "130px",position:"absolute", top: "220px", left: "-25px"}}>3</p></div>
                             </div>
                             <div className="buttons child1 child2">
                                 <div><p className="ptag" style={{width: "500px",position:"absolute", top: "-40px", left: "60px"}}>201 Accept camera access and wait for the webcam to load.</p></div>
                                 <div><p className="ptag" style={{width: "500px",position:"absolute", top: "90px", left: "60px"}}>Perform the pose and hold for 30 seconds</p></div>
                                 <div><p className="ptag" style={{width: "500px",position:"absolute", top: "220px", left: "60px"}}>The timer will restart if you make a mistake.</p></div>
                                 <img className="border-solid" src="imgs/allow.png" style={{position:"absolute", top: "30px", left: "350px", height:"90px"}}/>
                             </div>
                      </div>
                      : activity == '202' ? 
 
                      <div className="parent">
                             <div className="child1">
                                 <div><img src="imgs/blob.svg" style={{width: "130px", height: "130px", top: "250px"}}/></div>
                                 <div><img src="imgs/blob1.svg" style={{width: "130px", height: "130px", top: "250px", left: "500px"}}/></div>
                                 <div><img src="imgs/blob2.svg" style={{width: "130px", height: "130px", top: "250px", left: "970px"}}/></div>
                             </div>
                             <div className="child1 child2"> 
                                 <div><p className="indextag" style={{width: "130px",position:"absolute", top: "-30px", left: "-25px"}}>1</p></div>
                                 <div><p className="indextag" style={{width: "130px",position:"absolute", top: "100px", left: "-25px"}}>2</p></div>
                                 <div><p className="indextag" style={{width: "130px",position:"absolute", top: "220px", left: "-25px"}}>3</p></div>
                             </div>
                             <div className="buttons child1 child2">
                                 <div><p className="ptag" style={{width: "500px",position:"absolute", top: "-40px", left: "60px"}}>202 Accept camera access and wait for the webcam to load.</p></div>
                                 <div><p className="ptag" style={{width: "500px",position:"absolute", top: "90px", left: "60px"}}>Perform the pose and hold for 30 seconds</p></div>
                                 <div><p className="ptag" style={{width: "500px",position:"absolute", top: "220px", left: "60px"}}>The timer will restart if you make a mistake.</p></div>
                                 <img className="border-solid" src="imgs/allow.png" style={{position:"absolute", top: "30px", left: "350px", height:"90px"}}/>
                             </div>
                      </div>
                       : (activity == '300' ||  activity == '301' || activity == '302' || activity == '303'|| activity == '304'|| activity == '305'|| activity == '306'|| activity == '307'|| activity == '308'
                       || activity == '309'|| activity == '310') ? 
  
                       <div className="parent">
                              <div className="child1">
                                  <div><img src="imgs/blob.svg" style={{width: "130px", height: "130px", top: "250px"}}/></div>
                                  <div><img src="imgs/blob1.svg" style={{width: "130px", height: "130px", top: "250px", left: "500px"}}/></div>
                                  <div><img src="imgs/blob2.svg" style={{width: "130px", height: "130px", top: "250px", left: "970px"}}/></div>
                              </div>
                              <div className="child1 child2"> 
                                  <div><p className="indextag" style={{width: "130px",position:"absolute", top: "-30px", left: "-25px"}}>1</p></div>
                                  <div><p className="indextag" style={{width: "130px",position:"absolute", top: "100px", left: "-25px"}}>2</p></div>
                                  <div><p className="indextag" style={{width: "130px",position:"absolute", top: "220px", left: "-25px"}}>3</p></div>
                              </div>
                              <div className="buttons child1 child2">
                                  <div><p className="ptag" style={{width: "600px",position:"absolute", top: "-40px", left: "60px"}}>Click "Start", then accept camera access and wait for the webcam to load.</p></div>
                                  <div><p className="ptag" style={{width: "750px",position:"absolute", top: "90px", left: "60px"}}>Select the Tempo you are comfortable with. To evaluate your Music performance, you will need to unselect Accompaniment. </p></div>
                                  <div><p className="ptag" style={{width: "750px",position:"absolute", top: "220px", left: "60px"}}>Clicking Start will give you 10 seconds before starting your evaluation.</p></div>
                                  <img className="border-solid" src="imgs/allow.png" style={{position:"absolute", top: "30px", left: "550px", height:"90px"}}/>
                              </div>
                       </div>
                    :
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
                            <div><p className="ptag" style={{width: "500px",position:"absolute", top: "-40px", left: "60px"}}>Select an activity from the drop down list above ⬆.</p></div>
                            <div></div>
                            <div></div>
                            <img src="imgs/activity.png" style={{position:"absolute", top: "-20px", left: "450px", height:"90px", borderStyle: "solid"}}/>
                        </div>
                    </div>
                }
                    {activity != '' ? 
                        <div className="buttonDiv">
                                <Button style={{fontSize: "40px", left:"580px", top:"200px"}} onClick={onClick}>
                                Start
                                </Button>
                        </div>
                        : <div></div>
                    }
                    {activity != '' ? 
                        <div className="youtubeDiv">
                        <YouTube videoId="9M8CnlRO1y0" opts={opts} onReady={_onReady} />
                        </div>
                        : <div></div>
                    }

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