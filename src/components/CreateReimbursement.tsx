import React from 'react';
import { Users } from '../models/Users';
import { Reimbursement } from '../models/Reimbursement';
import { createReimbursement } from '../api/client';
import { Redirect } from 'react-router-dom';

interface ICreateReimbursmentProps{
    user: Users;
}

interface ICreateReimbursmentState{
    amount: number;
    description: string;
    type: string;
    redirect: boolean;
}

export class CreateReimbursement extends React.Component<ICreateReimbursmentProps, ICreateReimbursmentState> {
    constructor(props: ICreateReimbursmentProps){
        super(props);
        this.state = {
            amount: 0,
            description: '',
            type: 'none',
            redirect: false
        }

        this.handleAmount = this.handleAmount.bind(this);
        this.handleDescription = this.handleDescription.bind(this);
        this.handleType = this.handleType.bind(this);
    }

    shouldComponentUpdate(nextProps: any, nextState: any){
        return (this.props.user.username !== nextProps.user.username 
        || this.state.type !== nextState.type
        || this.state.redirect !== nextState.redirect);
	}

    handleAmount(event: any){
        if(event.target.value === ''){
            this.setState({amount: 0});
        }
        else{
            this.setState({amount: event.target.value});
        }  
    }

    handleDescription(event: any){
        this.setState({description: event.target.value});
    }

    handleType(type: string){
        this.setState({type: type});
    }

    async submit(){
        //TODO: change date submitted to current date
        await createReimbursement(new Reimbursement(0, this.props.user.username, +this.state.amount, 2020, 2020, this.state.description, this.props.user.username, 'in-progress', this.state.type), this.props.user.userId);
        this.setState({redirect: true});
    }

    render(){
        if(this.state.redirect){
            return(
                <Redirect to={'/success'} />
            );
        }
        if(typeof(this.props.user.userId) == 'number' && this.props.user.userId !== 0){
            return(
                <div className="form-group col-6">
                    Create Reimbursement:
                    <p />
                    <label>Amount:<br />
                        <input id="amount" type="number" onChange={this.handleAmount} defaultValue={0}/>
                    </label>
                    <p />
                    <label>Description:<br />
                        <textarea id="description" rows={6} onChange={this.handleDescription}  style={{width:500}}/>
                    </label>
                    <p />
                    <p>Type</p>
                    <div className="input-group-prepend">
                        <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{this.state.type}</button>
                        <div className="dropdown-menu">
                            <div className="dropdown-item" onClick={()=>this.handleType('none')}>None</div>
                            <div className="dropdown-item" onClick={()=>this.handleType('full')}>Full</div>
                            <div className="dropdown-item" onClick={()=>this.handleType('half')}>Half</div>
                            <div className="dropdown-item" onClick={()=>this.handleType('quarter')}>Quarter</div>
                            <div className="dropdown-item" onClick={()=>this.handleType('partial')}>Partial</div>
                        </div>
                    </div>
                    <p />
                    <br />
                    <button className="btn btn-outline-dark" onClick={async ()=>{await this.submit()}}>Submit</button>
                </div>
            );
        }
        else {
            return(
                <div className="container">
                    Please log in to create a new reimbursement
                </div>
            );
        }
    }
}