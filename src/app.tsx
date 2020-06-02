import React from 'react';
import { Header } from './components/Header'
import { Navigation } from './components/Navigation'
import { Content } from './components/Content'
import { BrowserRouter } from 'react-router-dom';
import { getCredentials } from './api/client';
import { Users } from './models/Users';
import { isNull } from 'util';

interface IAppState {
    user: Users;
}

export class App extends React.Component<{}, IAppState>{
    constructor(props: any){
        super(props);
        this.state = {
            user: {
                userId: 0,
                username: '',
                password: '',
                firstName: '',
                lastName: '',
                email: '',
                role: ''
            }
        }
        this.getUser()
    }

    setUser(u: Users){
        this.setState({user: u});
        console.log(this.state.user);
    }

    async getUser(): Promise<Users>{
        let credentials = await getCredentials();
        if(!isNull(credentials)){
            this.setState({user: {
                userId: credentials.userid,
                username: credentials.username,
                password: credentials.password,
                firstName: credentials.firstname,
                lastName: credentials.lastname,
                email: credentials.email,
                role: credentials.role
            }});
        }
        console.log(this.state.user);
        return  this.state.user;
    }

    render() {
        return (
            <div>
                <BrowserRouter>
                <div className="container-fluid">
                    <Header username={this.state.user.username}/>
                </div>
                <div className="container-fluid">
                    <div className="row" style={{margin: 0}}>
                            <Navigation username={this.state.user.username}/>
                            <Content setUser={(u: Users)=>this.setUser(u)} username={this.state.user.username} user={this.state.user}/>
                    </div>
                </div>
                </BrowserRouter>
            </div>
         );
    };
}


//TODO

// An Employee can submit a reimbursement request

// An Employee can view their pending reimbursement requests

// An Employee can view their resolved reimbursement requests

// An Employee can view their information

// An Employee can update their information


// A Manager can approve/deny pending reimbursement requests

// A Manager can view all pending requests from all employees

// A Manager can view all resolved requests from all employees and see which manager resolved it

// A Manager can view all Employees

// A Manager can view reimbursement requests from a single Employee


// An Employee can upload an image of his/her receipt as part of the reimbursement request (optional)

// An Employee receives an email when one of their reimbursement requests is resolved (optional)

// A Manager can view images of the receipts from reimbursement requests (optional)