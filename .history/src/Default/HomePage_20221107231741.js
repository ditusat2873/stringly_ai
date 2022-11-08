import React from 'react';

const HomePage = () =>{

    return (
    <div>
        <h1 style={{marginBottom: '10px', paddingLeft: '550px', fontSize:'100px'}}>Welcome to Stringly</h1>
        <h2 style={{marginBottom: '10px', paddingLeft: '850px', fontSize:'40px'}}>your musical buddy.</h2>
        <img alt="The Violin Player" src="imgs/violin.png" style={{ marginRight:'600px',  width: '500px'}}/>
        <img alt="Melodies" src="imgs/music.png" style={{position: 'absolute', top: '170px', left: '400px', width:'180px', height:'167px'}}/>
        <i className="fa-solid fa-file-video" style={{ position: 'absolute', top: '370px', left: '820px', fontSize: '2.5em', verticalAlign: 'middle' }} />
        <h2 style={{position: 'absolute', top: '370px', left: '870px', width:'700px', height:'167px', fontSize:'30px'}}> Play along your favorite music pieces, while stringly helps you play the correct note, with the correct posture.</h2>
        <i className="fa fa-leanpub" style={{ position: 'absolute', top: '520px', left: '820px', fontSize: '2.5em', verticalAlign: 'middle' }} />
        <h2 style={{position: 'absolute', top: '520px', left: '870px', width:'700px', height:'167px', fontSize:'30px'}}> Let stringly help practice your bowing and posture skills with exercises.</h2>
        <i className="fa fa-music" style={{ position: 'absolute', top: '620px', left: '820px', fontSize: '2.5em', verticalAlign: 'middle' }} />
        <h2 style={{position: 'absolute', top: '620px', left: '870px', width:'700px', height:'167px', fontSize:'30px', fontColor:'blue'}}> Let stringly help tune your violin.</h2>

    </div>
    );
}

export default HomePage