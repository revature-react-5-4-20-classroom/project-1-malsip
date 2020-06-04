import React from 'react';
import { Link } from 'react-router-dom';

interface INavigationProps {
    username: string;
}

export class Navigation extends React.Component<INavigationProps>{

	shouldComponentUpdate(nextProps: any, nextState: any){
		return this.props.username !== nextProps.username;
	}

	componentDidUpdate(){
		this.setState({username: this.props.username})
	}

    render(){
        let loginText = this.props.username ? "Logout" : "Login";

      return(
        <div className="col-md-2" style={{background: '#B77015', height: 75 + 'vh'}}>
            <div className="d-flex flex-column">
                <Link className="btn btn-outline-dark btn-lg" to={'/'}>Home</Link>
                <Link className="btn btn-outline-dark btn-lg" to={'/users'}>Users</Link>
                <Link className="btn btn-outline-dark btn-lg" to={'/reimbursements'}>Reimbursements</Link>
            </div>
            <div className="d-flex flex-column-reverse" style={{height: 59 + 'vh'}}>
                <Link className="btn btn-outline-dark btn-lg" to={'/login'}>{loginText}</Link>
            </div>
        </div>
      );
    }
  }