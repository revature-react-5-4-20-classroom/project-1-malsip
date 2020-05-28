import React from 'react';
import { Home } from './Home'
import { Login } from './Login'
import { Route } from 'react-router-dom'

export class Content extends React.Component{
    render(){
      return(
        <div className="container" style={{height: 75 + 'vh'}}>
            <Route exact={true} path="/" render={()=> {return(<Home/>);}} />
            <Route path="/login" render={()=> {return(<Login/>);}} />
        </div>
      );
    }
  }