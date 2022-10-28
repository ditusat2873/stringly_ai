import './LearnContentPanel.css';

const HoldBowHelp = props => {
    return (
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
                <div><p className="ptag" style={{width: "500px",position:"absolute", top: "-40px", left: "60px"}}>Accept camera access and wait for the webcam to load.</p></div>
                <div><p className="ptag" style={{width: "500px",position:"absolute", top: "90px", left: "60px"}}>Wait for the timer to start, then perform the exercise for 30 seconds</p></div>
                <div><p className="ptag" style={{width: "500px",position:"absolute", top: "220px", left: "60px"}}>The timer will restart if you make a mistake.</p></div>
                <img className="border-solid" src="imgs/allow.png" style={{position:"absolute", top: "30px", left: "350px", height:"90px"}}/>
            </div>
        </div>
    );
  }

  export default HoldBowHelp