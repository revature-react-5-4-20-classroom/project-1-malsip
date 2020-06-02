import React from 'react';
import { Link } from 'react-router-dom';

export class SuccessPage extends React.Component {
    render(){
        return(
            <div>
                Success!
                <p />
                <Link className="btn btn-outline-dark btn-lg" to={'/userHome'}>Back</Link>
            </div>
            

        );
    }
}