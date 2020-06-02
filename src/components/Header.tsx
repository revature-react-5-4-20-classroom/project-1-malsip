import React from 'react';
import { Link } from 'react-router-dom';

interface IHeaderProps {
	//getUser: ()=>Promise<Users>;
	username: string;
}

interface IHeaderState {
	username: string;
}

export class Header extends React.Component<IHeaderProps, IHeaderState>{
	constructor(props: IHeaderProps){
		super(props)
		this.state={
			username: props.username
		}
	}

	shouldComponentUpdate(nextProps: any, nextState: any){
		return this.state.username !== nextProps.username;
	}

	componentDidUpdate(){
		this.setState({username: this.props.username})
	}

    render(){
      	return (
			<div className="jumbotron" style={{background: '#FFB60A', marginBottom: 0, marginTop: 10}} >
				<div className="d-flex flex-row-reverse" style={{marginBottom: 20, marginTop: -55}}>
		  			<Link to={'/userHome'} style={{color: 'black'}}><h4>{this.state.username}</h4></Link>
				</div>
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