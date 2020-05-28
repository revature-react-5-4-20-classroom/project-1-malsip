import React from 'react';
import { Link } from 'react-router-dom';


export class Navigation extends React.Component{
    render(){
      return(
        <div className="col-md-2" style={{background: '#B77015', height: 75 + 'vh'}}>
            <div className="d-flex flex-column">
                <Link className="btn btn-outline-dark btn-lg" to={'/'}>Home</Link>
                <Link className="btn btn-outline-dark btn-lg" to={'/users'}>Users</Link>
                <Link className="btn btn-outline-dark btn-lg" to={'/reimbursements'}>Reimbursements</Link>
            </div>
            <div className="d-flex flex-column-reverse" style={{height: 59 + 'vh'}}>
            <Link className="btn btn-outline-dark btn-lg" to={'/login'}>Login/Logout</Link>
            </div>
        </div>
      );
    }
  }