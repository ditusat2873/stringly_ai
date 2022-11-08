import React from 'react';

const HomePage = () =>{

    return (
    <div>
        <h1 style={{marginBottom: '10px', paddingLeft: '550px', fontSize:'100px'}}>Welcome to Stringly</h1>
        <h2 style={{marginBottom: '10px', paddingLeft: '850px', fontSize:'40px'}}>your musical buddy.</h2>
        <img alt="The Violin Player" src="imgs/violin.png" style={{ marginRight:'600px',  width: '500px'}}/>
        <img alt="Melodies" src="imgs/music.png" style={{position: 'absolute', top: '170px', left: '400px', width:'180px', height:'167px'}}/>
        <i className="fa-solid fa-file-video" style={{ position: 'absolute', top: '370px', left: '600px', fontSize: '2.5em', verticalAlign: 'middle' }} />
        <h2 style={{position: 'absolute', top: '370px', left: '860px', width:'680px', height:'167px', fontSize:'35px'}}> Play along you favorite music pieces, while stringly helps you play to correct note with the correct posture.</h2>

    </div>
    );
}

export default HomePage