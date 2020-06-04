import React from 'react';

export class Home extends React.Component {
    render(){
        return(
            <div className="row">
                <div className="col-4"></div>
                <div className="col-4">
                    <h1>Welcome to ERS!</h1>
                    <p>Through this website you'll be able to:</p>
                    <ul>
                        <li>create reimbursements</li>
                        <li>view/update your user information</li>
                        <li>view pending requests</li>
                    </ul>
                    <p>Managers will also be able to:</p>
                    <ul>
                        <li>view all users</li>
                        <li>approve/deny requests</li>
                        <li>view all past and present requests</li>
                    </ul>
                </div>
            </div>
        );
    }
}