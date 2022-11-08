import React from 'react';

const HomePage = () =>{

    return (
    <div>
        <h1 style={{marginBottom: '10px', paddingLeft: '550px', fontSize:'100px'}}>Welcome to Stringly</h1>
        <h2 style={{marginBottom: '10px', paddingLeft: '850px', fontSize:'40px'}}>your musical buddy.</h2>
        <img alt="The Violin Player" src="imgs/violin.png" style={{ marginRight:'600px',  width: '500px'}}/>
        <img alt="Melodies" src="imgs/music.png" style={{position: 'absolute', top: '170px', left: '400px', width:'180px', height:'167px'}}/>
        <img alt="Melodies" src="imgs/music.png" style={{position: 'absolute', top: '370px', left: '400px', width:'180px', height:'167px'}}/>
        <h2 style={{marginBottom: '10px', paddingLeft: '850px', fontSize:'40px'}}>your musical buddy.</h2>

    </div>
    );
}

export default HomePage