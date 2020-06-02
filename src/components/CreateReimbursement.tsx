import React from 'react';
import { Users } from '../models/Users';

interface ICreateReimbursmentProps{
    user: Users;
}

interface ICreateReimbursmentState{
    amount: number;
    description: string;
    type: string;
}

export class CreateReimbursement extends React.Component<ICreateReimbursmentProps, ICreateReimbursmentState> {
    constructor(props: ICreateReimbursmentProps){
        super(props);
        this.state = {
            amount: 0,
            description: '',
            type: 'none'
        }

        this.handleAmount = this.handleAmount.bind(this);
        this.handleDescription = this.handleDescription.bind(this);
        this.handleType = this.handleType.bind(this);
    }

    shouldComponentUpdate(nextProps: any, nextState: any){
        return this.state.type !== nextState.type;
	}

    handleAmount(event: any){
        this.setState({amount: event.target.value});
    }

    handleDescription(event: any){
        this.setState({description: event.target.value});
    }

    handleType(type: string){
        this.setState({type: type});
    }

    submit(){

    }

    render(){
        return(
            <div className="form-group col-4">
                Create Reimbursement:
                <p />
                <label>Amount:
                    <input id="amount" type="number" onChange={this.handleAmount}/>
                </label>
                <p />
                <label>Description:
                    <input id="description" type="text" onChange={this.handleDescription}/>
                </label>
                <p />
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
                <button className="btn btn-outline-dark" onClick={async ()=>{await this.submit()}}>Submit</button>
            </div>
        );
    }
}