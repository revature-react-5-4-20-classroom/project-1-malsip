import React from 'react';
import { Users } from '../models/Users';
import { Reimbursement } from '../models/Reimbursement';
import { getAllReimbursements, updateReimbursement } from '../api/client';
import { isNull } from 'util';

interface IManagerHomeProps{
    user: Users;
    updateDetails: (reimbursement: Reimbursement)=>void;
    updateUserLists: (reimbursement: Reimbursement)=>void;
    selected: Reimbursement;
}

interface IManagerHomeState{
    allPendingReimbursements: Reimbursement[];
}

export class ManagerHome extends React.Component<IManagerHomeProps, IManagerHomeState>{
    constructor(props: IManagerHomeProps){
        super(props)
        this.state={
            allPendingReimbursements: []
        }
        this.getAllReimbursements();
    }

    shouldComponentUpdate(nextProps: any, nextState: any){
        return (this.state.allPendingReimbursements.length !== nextState.allPendingReimbursements.length 
            || this.props.selected.reimbursementId !== nextProps.selected.reimbursementId
            || this.props.selected.status !== nextProps.selected.status 
            );      
	}

	componentDidUpdate(){
        this.getAllReimbursements();
	}

    async getAllReimbursements(){
        try{
            let all = await getAllReimbursements();
            all.forEach((element: any)=>{
                if(isNull(element.resolver)){
                    element.resolver = 'none';
                }
                if(isNull(element.type)){
                    element.type = 'none';
                }
                
                const reimbursement = new Reimbursement(element.reimbursementid, element.author, element.amount, element.datesubmitted, element.dateresolved, element.description, element.resolver, element.status, element.type);
                
                if(reimbursement.status !== 'complete' && reimbursement.status !== 'terminated'){
                    let exists = false;
                    this.state.allPendingReimbursements.forEach((p)=>{
                        if(p.reimbursementId === reimbursement.reimbursementId){
                            exists = true;
                        }
                    });
                    if(!exists){
                        this.setState({allPendingReimbursements: [...this.state.allPendingReimbursements, reimbursement]});
                    }
                }
                

                //console.log(reimbursement);
            });
        }
        catch(e){
            console.log(e.message);
        }
    }

    async update(status: string){
        let localSelected = new Reimbursement(this.props.selected.reimbursementId, this.props.selected.author, this.props.selected.amount, this.props.selected.dateSubmitted, this.props.selected.dateResolved, this.props.selected.description, this.props.selected.resolver, this.props.selected.status, this.props.selected.type);
        this.props.updateDetails(new Reimbursement(0,'',0,0,0,'','','',''));

        //TODO: pass the current date for date resolved
        await updateReimbursement(localSelected.reimbursementId, 2020, this.props.user.userId, status);

        let newReimTemp: Reimbursement[] = [];
        this.state.allPendingReimbursements.forEach((e)=>{
            if(e.reimbursementId !== localSelected.reimbursementId){
                newReimTemp.push(e);
            }
        });
        this.setState({allPendingReimbursements: newReimTemp})

        this.props.updateUserLists(localSelected);

            
        
        console.log(status);
    }


    render(){
        if(this.props.user.userId !== 0){
            return(
                <div className="container">
                    <h6>Currently pending reimbursements:</h6>
                    <div className="list-group rounded-lg" style={{height:600, overflowY: 'scroll', background: 'grey'}}>
                        {this.state.allPendingReimbursements.map((p) => {
                            return (<button className="btn btn-outline-dark btn-lg" onClick={() => this.props.updateDetails(p)} key={`rID${p.reimbursementId}`}>Id: {p.reimbursementId}<br />Status: {p.status}</button>);
                        })}
                    </div>
                    <div>
                        <button className="btn btn-outline-dark btn-lg" onClick={() => this.update('complete')} disabled={this.props.selected.status === 'complete' || this.props.selected.status === 'terminated' || this.props.selected.status === ''}>Confirm</button>
                        <button className="btn btn-outline-dark btn-lg" onClick={() => this.update('terminated')} disabled={this.props.selected.status === 'complete' || this.props.selected.status === 'terminated' || this.props.selected.status === ''}>Deny</button>
                    </div>
                </div>
            );
        }
        else{
            return(
                <div className="container">
                    Please log in to view your home page
                </div>
            );
        }
    }
}