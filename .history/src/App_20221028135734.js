
import './App.css';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import '@trendmicro/react-breadcrumbs/dist/react-breadcrumbs.css';
import React from 'react';
//import ReactDOM from 'react-dom';
import DefaultSideNav from './Default';


function App() {

  return (
    <div>
    <div style={{ position: 'relative', minHeight: '48px', border: '1px solid transparent', backgroundColor: '#f8f8f8' , borderColor: '#e7e7e7'}}>
      <div style={{ float: 'left', height: '48px', padding: '15px 15px', fontSize: '20px', lineHeight: '20px'}}>
      <a href="/" style={{
          float: 'left',
          height: '48px',
          fontSize: '34px',
          lineHeight: '20px',
          textDecoration: 'none'
        }}>stringly.ai</a>
      <a href="/" style={{
          float: 'left',
          height: '48px',
          fontSize: '18px',
          fontColor: "black",
          lineHeight: '20px',
          textDecoration: 'none'
        }}>beta</a>
      </div>
    </div>
    <div
      style={{
        position: 'relative',
        height: 'calc(100vh - 48px)'
      }}
    >
        <DefaultSideNav />
    </div>

    </div>
);
}

export default App;
