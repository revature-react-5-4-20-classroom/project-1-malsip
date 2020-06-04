import React from 'react';
import { Users } from '../models/Users';
import { updateUserInfo } from '../api/client';
import { Redirect } from 'react-router-dom';

interface IModifyUserInfoProps {
    setUser: (u: Users)=>void;
    user: Users;
}

interface IModifyUserInfoState {
    userId : number;
    username : string;
    password : string;
    confirmPassword : string;
    firstName : string;
    lastName : string;
    email : string;
    role : string;
    matchingPasswords: string
    redirect: boolean;
}

export class ModifyUserInfo extends React.Component <IModifyUserInfoProps, IModifyUserInfoState> {
    constructor(props: IModifyUserInfoProps){
        super(props);
        this.state={
            userId : props.user.userId,
            username : props.user.username,
            password : props.user.password,
            confirmPassword : '',
            firstName : props.user.firstName,
            lastName : props.user.lastName,
            email : props.user.email,
            role : props.user.role,
            matchingPasswords: '',
            redirect: false
        }

        this.handleUsername = this.handleUsername.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleConfirmPassword = this.handleConfirmPassword.bind(this);
        this.handleFirstName = this.handleFirstName.bind(this);
        this.handleLastName = this.handleLastName.bind(this);
        this.handleEmail = this.handleEmail.bind(this);
    }

    shouldComponentUpdate(nextProps: any, nextState: any){
		return (this.state.username !== nextProps.user.username) || this.state.redirect !== nextState.redirect;
	}

	componentDidUpdate(){
        this.setState({
            userId : this.props.user.userId,
            username : this.props.user.username,
            password : this.props.user.password,
            firstName : this.props.user.firstName,
            lastName : this.props.user.lastName,
            email : this.props.user.email,
            role : this.props.user.role,});
	}

    handleUsername(event: any){
        this.setState({username: event.target.value});
    }

    handlePassword(event: any){
        this.setState({password: event.target.value});
        if(event.target.value === this.state.confirmPassword){
            this.setState({matchingPasswords: ''});
        }
        else{
            this.setState({matchingPasswords: 'Passwords do not match'});
        }
    }

    handleConfirmPassword(event: any){
        this.setState({confirmPassword: event.target.value});
        if(event.target.value === this.state.password){
            this.setState({matchingPasswords: ''});
        }
        else{
            this.setState({matchingPasswords: 'Passwords do not match'});
        }
    }

    handleFirstName(event: any){
        this.setState({firstName: event.target.value});
    }

    handleLastName(event: any){
        this.setState({lastName: event.target.value});
    }

    handleEmail(event: any){
        this.setState({email: event.target.value});
    }

    async submit(){
        if(typeof(this.state.username) == 'string' && this.state.username === ''){
            this.setState({username: this.props.user.username});
        }
        if(typeof(this.state.username) == 'string' && this.state.password === ''){
            this.setState({password: this.props.user.password});
        }
        if(typeof(this.state.username) == 'string' && this.state.firstName === ''){
            this.setState({firstName: this.props.user.firstName});
        }
        if(typeof(this.state.username) == 'string' && this.state.lastName === ''){
            this.setState({lastName: this.props.user.lastName});
        }
        if(typeof(this.state.username) == 'string' && this.state.email === ''){
            this.setState({email: this.props.user.email});
        }
        console.log(this.state);
        try{
            let userInfo = await updateUserInfo(this.state.userId, this.state.username, this.state.password, this.state.firstName, this.state.lastName, this.state.email, this.state.role);
            this.props.setUser(new Users(userInfo[0].userid, userInfo[0].username, userInfo[0].password, userInfo[0].firstname, userInfo[0].lastname, userInfo[0].email, userInfo[0].role));
            this.setState({matchingPasswords: '', redirect: true});
            console.log(userInfo)
        }
        catch(e){
            console.log(e.message);
        }
        

    }

    render(){
        if(this.state.redirect){
            return(
                <Redirect to={'/success'} />
            );
        }

        return(
            <div className="col-4">
                Submit to update your information:
                <p />
                <label>Username:<br/>
                    <input id="username" type="text" onChange={this.handleUsername}/>
                </label>
                <label>Password:<br/>
                    <input id="password" type="text" onChange={this.handlePassword}/>
                </label>
                <label>Confirm Password:<br/>
                    <input id="confirmPassword" type="text" onChange={this.handleConfirmPassword}/>
                </label>
                <label>First Name:<br/>
                    <input id="firstName" type="text" onChange={this.handleFirstName}/>
                </label>
                <label>Last Name:<br/>
                    <input id="lastName" type="text" onChange={this.handleLastName}/>
                </label>
                <label>Email:<br/>
                    <input id="email" type="email" onChange={this.handleEmail}/>
                </label>
                <p />
                <button className="btn btn-outline-dark" onClick={async ()=>{await this.submit()}} disabled={!(this.state.matchingPasswords === '')}>Submit</button>
                
                <p></p>
                <p>{this.state.matchingPasswords}</p>
            </div>
        );
    }
}