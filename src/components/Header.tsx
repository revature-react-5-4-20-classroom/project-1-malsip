import React from 'react';

export class Header extends React.Component{
    render(){
      return (
        <div className="jumbotron" style={{background: '#FFB60A', marginBottom: 0, marginTop: 10}} >
          <div className="row">
            <div className="col-1">
            </div>
            <div className="col-2">
              <h1>ERS</h1>
            </div>
          </div>
          <div className="row">
            <div className="col-1">
            </div>
            <div className="col-3">
              <h4>Expense Reimbusement System</h4>
            </div>
          </div>
        </div>
      );
    }
  }