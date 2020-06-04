import React from 'react';
import { Users } from '../models/Users';
import { Link } from 'react-router-dom';
import { getUserById, getUserByAdvancedSearch, getAllUsers, getReimbursementsByAuthor, updateReimbursement } from '../api/client';
import { Reimbursement } from '../models/Reimbursement';
import { isNull } from 'util';

interface IUserSearchProps {
    user: Users;
}

interface IUserSearchState {
    allMatchingUsers: Users[];
    selectedUser: Users;
    selectedReimbursement: Reimbursement;
    searchId: number;
    searchLimit: number;
    searchOffset: number;
    userPendingReimbursements: Reimbursement[];
    userHistoryReimbursements: Reimbursement[];
    reimbursementDetails: string;
    doOnce: boolean;
    updateReimbursements: boolean;
    forceUpdate: boolean;
}

export class UserSearch extends React.Component<IUserSearchProps, IUserSearchState> {
    constructor(props: IUserSearchProps){
        super(props);
        this.state = {
            allMatchingUsers: [],
            selectedUser: this.props.user,
            selectedReimbursement: new Reimbursement(0,'',0,0,0,'','','',''),
            searchId: 0,
            searchLimit: 0,
            searchOffset: 0,
            userPendingReimbursements: [],
            userHistoryReimbursements: [],
            reimbursementDetails: '',
            doOnce: true,
            updateReimbursements: true,
            forceUpdate: false
        }

        this.handleUserId = this.handleUserId.bind(this);
        this.handleLimit = this.handleLimit.bind(this);
        this.handleOffset = this.handleOffset.bind(this);
    }

    shouldComponentUpdate(nextProps: any, nextState: any){
        if(nextState.forceUpdate){
            this.setState({forceUpdate: false});
            return true;
        }

        return (this.props.user.userId !== nextProps.user.userId 
            || this.state.selectedUser.userId !== nextState.selectedUser.userId
            || this.state.reimbursementDetails !== nextState.reimbursementDetails);
	}

	async componentDidUpdate(){
        if(this.state.doOnce){
            this.setState({selectedUser: this.props.user, doOnce: false});
        }
        if(this.state.updateReimbursements){
            await this.populateReimbursements();
        }
    }

    async componentDidMount(){
        if(this.state.updateReimbursements){
            await this.populateReimbursements();
        }
    }

    handleUserId(event: any){
        if(event.target.value === ''){
            this.setState({searchId: 0});
        }
        else{
            this.setState({searchId: event.target.value});
        }
    }

    handleLimit(event: any){
        if(event.target.value === ''){
            this.setState({searchLimit: 0});
        }
        else{
            this.setState({searchLimit: event.target.value});
        }
    }

    handleOffset(event: any){
        if(event.target.value === ''){
            this.setState({searchOffset: 0});
        }
        else{
            this.setState({searchOffset: event.target.value});
        }
    }

    async searchUsers(){
        let searchResults: any[];
        if(this.state.searchId !== 0){
            searchResults = await getUserById(this.state.searchId);
        }
        else{
            if(this.state.searchLimit !== 0){
                searchResults = await getUserByAdvancedSearch(this.state.searchLimit, this.state.searchOffset);
            }
            else{
                searchResults = await getAllUsers();
            }
        }

        let organizedResults: Users[] = [];
        searchResults.forEach((e)=>{
            organizedResults.push(new Users(e.userid, e.username, e.password, e.firstname, e.lastname, e.email, e.role));
        });


        //console.log(searchResults);

        this.setState({allMatchingUsers: organizedResults, forceUpdate: true});
    }
    
    updateselectedUser(user: Users){
        this.setState({selectedUser: user, userPendingReimbursements: [], userHistoryReimbursements: [], updateReimbursements: true, forceUpdate: true});
    }

    async populateReimbursements(){
        try{
            if(this.state.updateReimbursements){
                let all = await getReimbursementsByAuthor(this.state.selectedUser.userId);
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
                        this.state.userPendingReimbursements.forEach((p)=>{
                            if(p.reimbursementId === reimbursement.reimbursementId){
                                exists = true;
                            }
                        });
                        if(!exists){
                            this.setState({userPendingReimbursements: [...this.state.userPendingReimbursements, reimbursement]});
                        }
                    }
                    else{
                        //history
                        let exists = false;
                        this.state.userHistoryReimbursements.forEach((h)=>{
                            if(h.reimbursementId === reimbursement.reimbursementId){
                                exists = true;
                            }
                        });
                        if(!exists){
                            this.setState({userHistoryReimbursements: [...this.state.userHistoryReimbursements, reimbursement]}); 
                        }
                    }
                });
                console.log(this.state.userPendingReimbursements);
                console.log(this.state.userHistoryReimbursements);
                if(this.state.userPendingReimbursements.length > 0 || this.state.userHistoryReimbursements.length > 0){
                    this.setState({updateReimbursements: false, forceUpdate: true});
                }
            }
        }
        catch(e){
            console.log(e.message);
        }
    }

    updateReimbursementDetails(reimbursement: Reimbursement){
        if(reimbursement.reimbursementId !== 0){
            this.setState({reimbursementDetails: `ID: ${reimbursement.reimbursementId}\n
            Author: ${reimbursement.author}\n
            Amount: ${reimbursement.amount}\n
            Date Submitted: ${reimbursement.dateSubmitted}\n
            Date Resolved: ${reimbursement.dateResolved}\n
            Description: ${reimbursement.description}\n
            Resolver: ${reimbursement.resolver}\n
            Status: ${reimbursement.status}\n
            Type: ${reimbursement.type}\n`,
            selectedReimbursement: reimbursement
            });
        }
        else{
            this.setState({reimbursementDetails: '',
                selectedReimbursement: reimbursement
            });
        }
    }

    async updateReimbursement(status: string){
        let localSelected = new Reimbursement(this.state.selectedReimbursement.reimbursementId, this.state.selectedReimbursement.author, this.state.selectedReimbursement.amount, this.state.selectedReimbursement.dateSubmitted, this.state.selectedReimbursement.dateResolved, this.state.selectedReimbursement.description, this.state.selectedReimbursement.resolver, this.state.selectedReimbursement.status, this.state.selectedReimbursement.type);
        this.updateReimbursementDetails(new Reimbursement(0,'',0,0,0,'','','',''));

        //TODO: pass the current date for date resolved
        await updateReimbursement(localSelected.reimbursementId, 2020, this.props.user.userId, status);

        let newReimTemp: Reimbursement[] = [];
        this.state.userPendingReimbursements.forEach((e)=>{
            if(e.reimbursementId !== localSelected.reimbursementId){
                newReimTemp.push(e);
            }
        });
        this.setState({userPendingReimbursements: newReimTemp,
            userHistoryReimbursements: [...this.state.userHistoryReimbursements, localSelected],
            forceUpdate: true
        })

            
        console.log(status);
    }

    render(){
        let detailKey = 0;

        if(typeof(this.props.user.userId) == 'number' && this.props.user.userId !== 0){
            return(
                <div className="container">
                    <div className="row" >   
                        <div className="col-4">       
                        <p />
                            <h5>User information:<br /></h5>
                            <h5>
                                ID: {this.state.selectedUser.userId}<br />
                                Username: {this.state.selectedUser.username}<br />
                                First Name: {this.state.selectedUser.firstName}<br />
                                Last Name: {this.state.selectedUser.lastName}<br />
                                Email: {this.state.selectedUser.email}<br />
                                Role: {this.state.selectedUser.role}<br />
                            </h5>
                            <p />
                            <div className={this.props.user.userId === this.state.selectedUser.userId ? 'd-flex flex-row' : 'invisible'}>
                                <Link className="btn btn-outline-dark btn-lg" to={'/modifyUserInfo'} >Change Information</Link>
                            </div>
                        </div>
                        <div className={this.props.user.role === 'finance-manager' ? 'col-4' : 'invisible'}>
                            <p />
                            <h5>Search for a user:<br /></h5>
                            <p />
                            <br />
                            <label><h6>UserId</h6>(Search all users by leaving UserId as 0):<br />
                                <input id="amount" type="number" onChange={this.handleUserId}/>
                            </label>
                            <p />
                            <label><h6>Limit number of searched users</h6>(Not available if searching by Id):<br />
                                <input id="amount" type="number" onChange={this.handleLimit}/>
                            </label>
                            <p />
                            <label><h6>Offset searched users</h6>(Must specify limit):<br />
                                <input id="amount" type="number" onChange={this.handleOffset}/>
                            </label>
                            <button className="btn btn-outline-dark" onClick={async ()=>{await this.searchUsers()}}>Search</button>
                        </div>
                        <div className={this.props.user.role === 'finance-manager' ? 'col-4' : 'invisible'}>
                            <p />
                            <h5>Matching Users:<br /></h5>
                            <div className="list-group rounded-lg" style={{height:300, overflowY: 'scroll', background: 'grey'}}>
                                <h5 style={{marginLeft:15, lineHeight:1, marginTop:15}}>
                                {this.state.allMatchingUsers.map((e) => {
                                    return (<button className="btn btn-outline-dark btn-lg" onClick={() => this.updateselectedUser(e)} key={`uID${e.userId}`} style={{width:290}}>Id: {e.userId}<br />Username: {e.username}</button>);
                                })}
                                </h5>
                            </div>
                        </div>
                    </div>
                    <p />
                    <div className={this.props.user.role === 'finance-manager' ? 'row' : 'invisible'}>
                        <div className="col-4">
                            <h6>User's pending reimbursements:</h6>
                            <div className="list-group rounded-lg" style={{height:250, overflowY: 'scroll', background: 'grey'}}>
                                {this.state.userPendingReimbursements.map((e) => {
                                    return (<button className="btn btn-outline-dark btn-lg" onClick={() => this.updateReimbursementDetails(e)} key={`rID${e.reimbursementId}`}>Id: {e.reimbursementId}<br />Status: {e.status}</button>);
                                })}
                            </div>
                        </div>
                        <div className="col-4">
                        <h6>Reimbursement history:</h6>
                            <div className="list-group rounded-lg" style={{height:250, overflowY: 'scroll', background: 'grey'}}>
                                {this.state.userHistoryReimbursements.map((e) => {
                                return (<button className="btn btn-outline-dark btn-lg" onClick={() => this.updateReimbursementDetails(e)} key={`rID${e.reimbursementId}`}>Id: {e.reimbursementId}<br />Status: {e.status}<br /></button>);
                                })}
                            </div>
                        </div>
                        <div className="col-4">
                            <h6>Reimbursement Details:</h6>
                            <div className="list-group rounded-lg" style={{height:250, overflowY: 'scroll', background: 'grey'}}>
                                <h5 style={{marginLeft:15, lineHeight:1, marginTop:15}}>
                                    {this.state.reimbursementDetails.split('\n').map((e)=>{
                                        return <div key={`dKey${detailKey++}`}>{e}<br /></div>
                                    })}
                                </h5>
                            </div>
                            <div>
                                <button className="btn btn-outline-dark btn-lg" onClick={() => this.updateReimbursement('complete')} disabled={this.state.selectedReimbursement.status === 'complete' || this.state.selectedReimbursement.status === 'terminated' || this.state.selectedReimbursement.status === ''}>Confirm</button>
                                <button className="btn btn-outline-dark btn-lg" onClick={() => this.updateReimbursement('terminated')} disabled={this.state.selectedReimbursement.status === 'complete' || this.state.selectedReimbursement.status === 'terminated' || this.state.selectedReimbursement.status === ''}>Deny</button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        else{
            return(
                <div className="container">
                    Please log in to view user information. Only managers can search through Users.
                </div>
            );
        }
        
    }
}