import React from 'react';
import { login } from '../api/client';
import { Redirect } from 'react-router-dom';
import { Users } from '../models/Users';

interface ILoginProps {
    setUser: (u: Users)=>void;
    logout: boolean;
}

interface ILoginState {
    username: string;
    password: string;
    failed: string;
    redirect: boolean;
    logout:boolean;
}

export class Login extends React.Component<ILoginProps, ILoginState> {
    constructor(props: any){
        super(props)
        this.state={
            username: '',
            password: '',
            failed: '',
            redirect: false,
            logout: props.logout
        };

        this.handleUsername = this.handleUsername.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
    }

    handleUsername(event: any){
        this.setState({username: event.target.value});
    }

    handlePassword(event: any){
        this.setState({password: event.target.value});
    }

    async submit(){
        console.log(this.state)
        try{
            let userInfo = await login(this.state.username, this.state.password);
            this.props.setUser(new Users(userInfo.userid, userInfo.username, userInfo.password, userInfo.firstname, userInfo.lastname, userInfo.email, userInfo.role));
            this.setState({failed: '', redirect: true});
            return;
        }
        catch(e){
            console.log(e.message)
        }
        this.setState({failed: 'Incorrect credentials'});
    }

    render(){
        if(this.state.logout){
            return(
                <Redirect to={'/logout'} />
            );
        }

        if(this.state.redirect){
            return(
                <Redirect to={'/userHome'} />
            );
        }

        return(
            <div className="col-3">
                <p style={{marginTop:20}}>Login:</p>
                <label>Username:
                    <input id="username" type="text" onChange={this.handleUsername}/>
                </label>
                <label>Password:
                    <input id="password" type="password" onChange={this.handlePassword}/>
                </label>
                <button className="btn btn-outline-dark" onClick={async ()=>{await this.submit()}}>Submit</button>
                
                <p></p>
                <p>{this.state.failed}</p>
            </div>
        );
    }
}
