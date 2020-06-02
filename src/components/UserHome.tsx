import React from 'react';
import { Users } from '../models/Users';
import { Link } from 'react-router-dom';
import { ManagerHome } from './ManagerHome';
import { Reimbursement } from '../models/Reimbursement';
import { getReimbursementsByAuthor } from '../api/client';
import { isNull } from 'util';

interface IUserHomeProps{
    user: Users;
}

interface IUserHomeState{
    userPending: Reimbursement[];
    userHistory: Reimbursement[];
    detailedReimbursement: string;
    updateReimbursements: boolean;
    selected: Reimbursement;
}

export class UserHome extends React.Component<IUserHomeProps, IUserHomeState>{
    constructor(props: IUserHomeProps){
        super(props);
        this.state={
            userPending: [],
            userHistory: [],
            detailedReimbursement: '',
            updateReimbursements: true,
            selected: new Reimbursement(0,'',0,0,0,'','','','')
        }
        this.getReimbursementsByAuthor();
    }

    shouldComponentUpdate(nextProps: any, nextState: any){
        return (this.props.user.username !== nextProps.user.username 
            || this.state.userPending.length < nextState.userPending.length 
            || this.state.userHistory.length < nextState.userHistory.length
            || this.state.detailedReimbursement !== nextState.detailedReimbursement);
	}

	async componentDidUpdate(){
        await this.getReimbursementsByAuthor();
	}

    async getReimbursementsByAuthor(){
        try{
            if(this.state.updateReimbursements){
                let all = await getReimbursementsByAuthor(this.props.user.userId);
                all.forEach((element: any)=>{
                    if(isNull(element.resolver)){
                        element.resolver = 'none';
                    }
                    if(isNull(element.type)){
                        element.type = 'none';
                    }
                    
                    const reimbursement = new Reimbursement(element.reimbursementid, element.author, element.amount, element.datesubmitted, element.dateresolved, element.description, element.resolver, element.status, element.type);


                    if(reimbursement.status !== 'complete' && reimbursement.status !== 'terminated'){
                        //active
                        let exists = false;
                        this.state.userPending.forEach((p)=>{
                            if(p.reimbursementId === reimbursement.reimbursementId){
                                exists = true;
                            }
                        });
                        if(!exists){
                            this.setState({userPending: [...this.state.userPending, reimbursement]});
                        }
                    }
                    else{
                        //history
                        let exists = false;
                        this.state.userHistory.forEach((h)=>{
                            if(h.reimbursementId === reimbursement.reimbursementId){
                                exists = true;
                            }
                        });
                        if(!exists){
                            this.setState({userHistory: [...this.state.userHistory, reimbursement]}); 
                        }
                    }
                });
                //console.log(this.state.userPending);
                //console.log(this.state.userHistory);
                if(this.state.userPending.length > 0 || this.state.userHistory.length > 0){
                    this.setState({updateReimbursements: false});
                }
            }
        }
        catch(e){
            console.log(e.message);
        }
    }

    updateDetails(reimbursement: Reimbursement){
        if(reimbursement.reimbursementId !== 0){
            this.setState({detailedReimbursement: `ID: ${reimbursement.reimbursementId}\n
            Author: ${reimbursement.author}\n
            Amount: ${reimbursement.amount}\n
            Date Submitted: ${reimbursement.dateSubmitted}\n
            Date Resolved: ${reimbursement.dateResolved}\n
            Description: ${reimbursement.description}\n
            Resolver: ${reimbursement.resolver}\n
            Status: ${reimbursement.status}\n
            Type: ${reimbursement.type}\n`,
            selected: reimbursement
            });
        }
        else{
            console.log('emptying...')
            this.setState({detailedReimbursement: '',
            selected: reimbursement
        });
        }

        this.setState({detailedReimbursement: `ID: ${reimbursement.reimbursementId}\n
        Author: ${reimbursement.author}\n
        Amount: ${reimbursement.amount}\n
        Date Submitted: ${reimbursement.dateSubmitted}\n
        Date Resolved: ${reimbursement.dateResolved}\n
        Description: ${reimbursement.description}\n
        Resolver: ${reimbursement.resolver}\n
        Status: ${reimbursement.status}\n
        Type: ${reimbursement.type}\n`,
        selected: reimbursement
        });
    }

    updateUserLists(reimbursement: Reimbursement){

        let newReimTemp: Reimbursement[] = [];
        this.state.userPending.forEach((e)=>{
            if(e.reimbursementId !== reimbursement.reimbursementId){
                newReimTemp.push(e);
            }
        });
        this.setState({userPending: newReimTemp,
            userHistory: [...this.state.userHistory, reimbursement]})
    }

    render(){
        let detailKey = 0;

        if(typeof(this.props.user.userId) == 'number' && this.props.user.userId !== 0){
            return(
                <div className="container">
                    <div className="text-center">
                        <h3>Hello {this.props.user.firstName} {this.props.user.lastName}</h3>
                    </div>
                    <p />
                    <div className="row">
                        <div className="col-4">
                            <h6>Your pending reimbursements:</h6>
                            <div className="list-group rounded-lg" style={{height:200, overflowY: 'scroll', background: 'grey'}}>
                                {this.state.userPending.map((p) => {
                                    return (<button className="btn btn-outline-dark btn-lg" onClick={() => this.updateDetails(p)} key={`rID${p.reimbursementId}`}>Id: {p.reimbursementId}<br />Status: {p.status}<br /></button>);
                                })}
                            </div>
                            <p />
                            <Link className="btn btn-outline-dark btn-lg" to={'/createReimbursement'}>New Reimbursement</Link>
                        </div>
                        <div className="col-4">
                            <h6>Reimbursement history:</h6>
                            <div className="list-group rounded-lg" style={{height:200, overflowY: 'scroll', background: 'grey'}}>
                                {this.state.userHistory.map((p) => {
                                return (<button className="btn btn-outline-dark btn-lg" onClick={() => this.updateDetails(p)} key={`rID${p.reimbursementId}`}>Id: {p.reimbursementId}<br />Status: {p.status}<br /></button>);
                                })}
                            </div>
                            <p />
                            <h6>Reimbursement Details:</h6>
                            <div className="list-group rounded-lg" style={{height:400, overflowY: 'scroll', background: 'grey'}}>
                                <h5 style={{marginLeft:15, lineHeight:1, marginTop:15}}>
                                    {this.state.detailedReimbursement.split('\n').map((e)=>{
                                        return <div key={`dKey${detailKey++}`}>{e}<br /></div>
                                    })}
                                </h5>
                            </div>
                        </div>
                        <div className={this.props.user.role === 'finance-manager' ? 'col-4' : 'invisible'} >
                            <ManagerHome user={this.props.user} updateDetails={(reimbursement: Reimbursement)=>this.updateDetails(reimbursement)} updateUserLists={(reimbursement: Reimbursement)=>this.updateUserLists(reimbursement)} selected={this.state.selected}/>
                        </div>
                    </div>
                    <p />
                    <div className="d-flex flex-row-reverse">
                        <Link className="btn btn-outline-dark btn-lg" to={'/modifyUserInfo'}>Change Information</Link>
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