import React from 'react';
import { login } from '../api/client';

export class Login extends React.Component {


    render(){
        return(
            <div className="col-3">
                <p style={{marginTop:20}}>Login:</p>
                <label >Username:
                    <input type="text" />
                </label>
                <label >Password:
                    <input type="text" />
                </label>
                <button className="btn btn-outline-dark">Submit</button>
            </div>
        );
    }
}