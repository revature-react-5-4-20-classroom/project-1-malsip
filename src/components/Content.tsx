import React from 'react';
import { Home } from './Home'
import { Login } from './Login'
import { Route } from 'react-router-dom'
import { UserHome } from './UserHome';
import { Users } from '../models/Users';
import { Logout } from './Logout';
import { ModifyUserInfo } from './ModifyUserInfo';
import { SuccessPage } from './SuccessPage';
import { CreateReimbursement } from './CreateReimbursement';


interface IContentProps{
    setUser: (u: Users)=>void;
    username: string;
    user: Users;
}

interface IContentState{
    logout: boolean;
    username: string;
}

export class Content extends React.Component<IContentProps, IContentState>{
    constructor(props: IContentProps){
        super(props);
        this.state = { 
            logout: false,
            username: props.username
        }
    }

    shouldComponentUpdate(nextProps: any, nextState: any){
		return this.state.username !== nextProps.username;
	}

	componentDidUpdate(){
        this.setState({username: this.props.username})
        if(this.props.username){
            this.setState({logout:true});
        }
        else{
            this.setState({logout:false});
        }
	}

    render(){
      return(
        <div className="container" style={{height: 75 + 'vh'}}>
            <Route exact={true} path="/" component={Home} />
            <Route path="/login" render={()=><Login setUser={(u:Users)=>this.props.setUser(u)} logout={this.state.logout}/>} />
            <Route path="/userHome" render={()=><UserHome user={this.props.user}/>}/>
            <Route path="/logout" render={()=><Logout setUser={(u:Users)=>this.props.setUser(u)} />} />
            <Route path="/modifyUserInfo" render={()=><ModifyUserInfo user={this.props.user} setUser={(u:Users)=>this.props.setUser(u)}/>} />
            <Route path="/success" component={SuccessPage} />
            <Route path="/createReimbursement" render={()=><CreateReimbursement user={this.props.user} />} />
        </div>
      );
    }
  }