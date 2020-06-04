import React from 'react';
import { logout } from '../api/client';
import { Users } from '../models/Users';

interface ILogoutProps{
    setUser: (u: Users)=>void;
}

interface ILogoutState{
    logout: boolean;
}

export class Logout extends React.Component<ILogoutProps, ILogoutState>{
    constructor(props: ILogoutProps){
        super(props)
        this.state = {
            logout: true
        }
    }

    async logout(){
        this.setState({logout: false});
        await logout();
        let userInfo: Users= {
            userId: 0,
            username: '',
            password: '',
            firstName: '',
            lastName: '',
            email: '',
            role: ''
        }
        
        this.props.setUser(userInfo);
        
    }
    
    render(){        
        if(this.state.logout){
            this.logout();
            console.log('logged out')
        }
        return(
            <div>
                Successfully logged out.
            </div>
        );
    }
}