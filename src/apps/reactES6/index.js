/*
* reactES6 Demo 
* */
import './inc/css/index.scss';
import React,{Component} from 'react';
import {render} from 'react-dom';
import { Router, Route,IndexRoute, hashHistory } from 'react-router';
import App from './compronents/index.jsx';
import Channel from './compronents/channel/index.jsx';
import Content from './compronents/content/index.jsx';

render(
    <Router history={hashHistory}>
        <Route path="/" component={App} >
            <IndexRoute component={Channel} />
            <Route path="channel(/:parentId(/:id))" component={Channel} />
            <Route path="content(/:channelId(/:id))" component={Content} />
        </Route>
    </Router>
, document.getElementById("app"));
