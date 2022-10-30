import Breadcrumbs from '@trendmicro/react-breadcrumbs';
import ensureArray from 'ensure-array';
import React, { PureComponent, useRef } from 'react';
import styled from 'styled-components';
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import ReactDOM from 'react-dom';
import LearnMainPanel from './LearnMainPanel';
import HomePage from './HomePage';
import TunerPanel from './TunerPanel';

const Main = styled.main`
    position: relative;
    overflow: hidden;
    transition: all .15s;
    padding: 0 20px;
    margin-left: ${props => (props.expanded ? 240 : 64)}px;
`;

function iframe() {
    return {
        __html: '<iframe src="https://sites.google.com/view/projectresearchviolin/home" width="540" height="450"></iframe>'
    }
}


export default class extends PureComponent {
    state = {
        expanded: false,
        page: null
    };

    onSelect = (selected) => {
        this.setState({ selected: selected });
        if (['learn/bowexercises', 'learn/posture', 'learn/playalong', 'learn/recordings'].some(a => a === selected)) 
        {
            const learnMainPanelDiv = <LearnMainPanel name={selected}/>
            ReactDOM.render(learnMainPanelDiv, document.getElementById('learn_main_panel'));
        }
        else if (['tune'].some(a => a === selected)) 
                ReactDOM.render(<TunerPanel/>, document.getElementById('learn_main_panel'));
        else if (['fun'].some(a => a === selected)) 
        {
            const learnMainPanelDiv = <LearnMainPanel name={selected}/>
            ReactDOM.render(learnMainPanelDiv, document.getElementById('learn_main_panel'));
        }
        else if (['help'].some(a => a === selected)) 
        {
            const otherDataDiv = <div>Coming soon!!!</div>
            ReactDOM.render(otherDataDiv, document.getElementById('learn_main_panel'));
        }
        else if (['about'].some(a => a === selected)) 
        {
            //const otherDataDiv = <div>Aditya Satish, ditu.sat@gmail.com.</div>
            const otherDataDiv = <div>dangerouslySetInnerHTML={iframe()} </div>
            ReactDOM.render(otherDataDiv, document.getElementById('learn_main_panel'));
        }
    };
    onToggle = (expanded) => {
        this.setState({ expanded: expanded });
    };

    pageTitle = {
        'learn/bowexercises': ['Learn', 'Bow Exercises'],
        'learn/posture': ['Learn', 'Posture'],
        'learn/playalong': ['Learn', 'Play Along'],
        'learn/recordings': ['Learn', 'Recordings'],
        'tune': 'Tune',
        'fun': ['Fun'],
        'help': 'Help',
        'about': 'About'
    };

    renderBreadcrumbs() {
        const { selected } = this.state;
        const list = ensureArray(this.pageTitle[selected]);

        return (
            <Breadcrumbs>
                {list.map((item, index) => (
                    <Breadcrumbs.Item
                        active={index === list.length - 1}
                        key={`${selected}_${index}`}
                    >
                        {item}
                    </Breadcrumbs.Item>
                ))}
            </Breadcrumbs>
        );
    }

    navigate = (pathname) => () => {
        this.setState({ selected: pathname });
    };



    render() {
        const { expanded, selected, page } = this.state;

        return (
            <div>
                <SideNav onSelect={this.onSelect} onToggle={this.onToggle} style={{background: '#db3d44'}}>
                    <SideNav.Toggle />
                    <SideNav.Nav selected={selected}>
                        <NavItem eventKey="learn">
                            <NavIcon>
                                <i className="fa fa-fw fab fa-leanpub" style={{ fontSize: '2.15em', verticalAlign: 'middle' }} />
                            </NavIcon>
                            <NavText style={{ paddingRight: 32 }} title="Learn" style={{fontSize: '16px'}}>
                                Learn
                            </NavText>
                            <NavItem eventKey="learn/bowexercises">
                                <NavText title="Bow Exercises" style={{fontSize: '16px'}}>
                                &nbsp;&nbsp;&nbsp;Bow Exercises
                                </NavText>
                            </NavItem>
                            <NavItem eventKey="learn/posture">
                                <NavText title="Posture" style={{fontSize: '16px'}}>
                                &nbsp;&nbsp;&nbsp;Posture
                                </NavText>
                            </NavItem>
                            <NavItem eventKey="learn/playalong">
                                <NavText title="Play Along" style={{fontSize: '16px'}}>
                                &nbsp;&nbsp;&nbsp;Play Along
                                </NavText>
                            </NavItem>
                            <NavItem eventKey="learn/recordings">
                                <NavText title="Recordings" style={{fontSize: '16px'}}>
                                &nbsp;&nbsp;&nbsp;Recordings
                                </NavText>
                            </NavItem>
                        </NavItem>
                        <NavItem eventKey="tune">
                            <NavIcon>
                                <i className="fa fa-music" style={{ fontSize: '2.5em', verticalAlign: 'middle' }} />
                            </NavIcon>
                            <NavText style={{ paddingRight: 32 }} title="Tune" style={{fontSize: '16px'}}>
                                Tune
                            </NavText>
                        </NavItem>
                        {/*<NavItem eventKey="fun">
                            <NavIcon>
                                <i className="far fa-smile" style={{ fontSize: '2.5em', verticalAlign: 'middle' }} />
                            </NavIcon>
                            <NavText style={{ paddingRight: 32 }} title="Fun" style={{fontSize: '16px'}}>
                                Fun
                            </NavText>
        </NavItem>*/}
                        <NavItem eventKey="help">
                            <NavIcon>
                                <i className="fa fa-question-circle" style={{ fontSize: '2.5em', verticalAlign: 'middle' }} />
                            </NavIcon>
                            <NavText style={{ paddingRight: 32 }} title="Help" style={{fontSize: '16px'}}>
                                Help
                            </NavText>
                        </NavItem>
                        <NavItem eventKey="about">
                            <NavIcon>
                                <i className="fa fa-address-card" style={{ fontSize: '2.5em', verticalAlign: 'middle' }} />
                            </NavIcon>
                            <NavText style={{ paddingRight: 32 }} title="About" style={{fontSize: '16px'}}>
                                About
                            </NavText>
                        </NavItem>
                    </SideNav.Nav>
                </SideNav>
                <Main expanded={expanded}>
                    {this.renderBreadcrumbs()}
                </Main>
                <div id="learn_main_panel"
                    style={{
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all .15s',
                        padding: '0 20px',
                        marginLeft: expanded ? '240px' : '64px'
                    }}
                >
                    <HomePage/>
                </div>
                <div style={{ position: 'fixed',
                                left: '0',
                                bottom: '0',
                                width: '100%',
                                backgroundColor: '#f8f8f8',
                                color: 'black',
                                textAlign: 'center'
                                }}>
                    <p>&copy; Copyright 2022. By Aditya Satish. Made to help you learn 🎻 with AI.</p>
                </div>  
            </div>
        );
    }
}
