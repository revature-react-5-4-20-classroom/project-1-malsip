import React from 'react';
import { Users } from '../models/Users';
import { Reimbursement } from '../models/Reimbursement';
import { getReimbursementsByAdvancedSearch, updateReimbursement } from '../api/client';

interface IReimbursementSearchProps {
    user: Users;
}

interface IReimbursementSearchState {
    searchedReimbursements: Reimbursement[];
    selectedReimbursement: Reimbursement;
    detailedReimbursement: string;
    author: string;
    dateSubmitted: number;
    dateResolved: number;
    resolver: string;
    status: string;
    limit: number;
    offset: number;
}

export class ReimbursementSearch extends React.Component<IReimbursementSearchProps, IReimbursementSearchState> {
    constructor(props: IReimbursementSearchProps){
        super(props);
        this.state = {
            searchedReimbursements: [],
            selectedReimbursement: new Reimbursement(0,'',0,0,0,'','','',''),
            detailedReimbursement: '',
            author: '',
            dateSubmitted: 0,
            dateResolved: 0,
            resolver: '',
            status: 'none',
            limit: 0,
            offset: 0,
        }

        this.handleAuthor = this.handleAuthor.bind(this);
        this.handleDateSubmitted = this.handleDateSubmitted.bind(this);
        this.handleDateResolved = this.handleDateResolved.bind(this);
        this.handleResolver = this.handleResolver.bind(this);
        this.handleLimit = this.handleLimit.bind(this);
        this.handleOffset = this.handleOffset.bind(this);
    }



    handleAuthor(event: any){
        this.setState({author: event.target.value});
    }

    handleDateSubmitted(event: any){
        if(event.target.value === ''){
            this.setState({dateSubmitted: 0});
        }
        else{
            this.setState({dateSubmitted: event.target.value});
        }
    }

    handleDateResolved(event: any){
        if(event.target.value === ''){
            this.setState({dateResolved: 0});
        }
        else{
            this.setState({dateResolved: event.target.value});
        }
    }

    handleResolver(event: any){
        this.setState({resolver: event.target.value});
    }

    handleStatus(status: string){
        this.setState({status: status});
    }

    handleLimit(event: any){
        this.setState({limit: event.target.value});
    }

    handleOffset(event: any){
        this.setState({offset: event.target.value});
    }

    async search(){
        let searchResults: any[] = await getReimbursementsByAdvancedSearch(this.state.author, this.state.dateSubmitted, this.state.dateResolved, this.state.resolver, this.state.status, this.state.limit, this.state.offset);
        
        let reimbursementResults: Reimbursement[] = [];
        searchResults.forEach((e)=>{
            reimbursementResults.push(new Reimbursement(e.reimbursementid, e.author, e.amount, e.datesubmitted, e.dateresolved, e.description, e.resolver, e.status, e.type));
        });

        console.log(reimbursementResults);

        this.setState({searchedReimbursements: reimbursementResults});
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
            selectedReimbursement: reimbursement
            });
        }
        else{
            this.setState({detailedReimbursement: '',
                selectedReimbursement: reimbursement
            });
        }
    }

    async updateReimbursement(status: string){
        let localSelected = new Reimbursement(this.state.selectedReimbursement.reimbursementId, this.state.selectedReimbursement.author, this.state.selectedReimbursement.amount, this.state.selectedReimbursement.dateSubmitted, this.state.selectedReimbursement.dateResolved, this.state.selectedReimbursement.description, this.state.selectedReimbursement.resolver, this.state.selectedReimbursement.status, this.state.selectedReimbursement.type);
        this.updateDetails(new Reimbursement(0,'',0,0,0,'','','',''));

        //TODO: pass the current date for date resolved
        await updateReimbursement(localSelected.reimbursementId, 2020, this.props.user.userId, status);

        await this.search();
            
        console.log(status);
    }

    render(){
        let detailKey = 0;

        if(typeof(this.props.user.userId) == 'number' && this.props.user.userId !== 0){
            if(this.props.user.role === 'finance-manager'){
                return(
                    <div className="row">
                        <div className="col-4">
                            <p />
                            <div className="form-group">
                                <h5>Search Reimbursements:</h5>
                                <p />
                                <label><h6>Author:</h6>
                                    <input id="author" type="text" onChange={this.handleAuthor} />
                                </label>
                                <p />
                                <label><h6>Date Submitted:</h6>
                                    <input id="dateSubmitted" type="number" onChange={this.handleDateSubmitted} />
                                </label>
                                <p />
                                <label><h6>Date Resolved:</h6>
                                    <input id="dateResolved" type="number" onChange={this.handleDateResolved} />
                                </label>
                                <p />
                                <label><h6>Resolver:</h6>
                                    <input id="description" type="text" onChange={this.handleResolver} />
                                </label>
                                <p />
                                <h6>Status</h6>
                                <div className="input-group-prepend">
                                    <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{this.state.status}</button>
                                    <div className="dropdown-menu">
                                    <div className="dropdown-item" onClick={()=>this.handleStatus('none')}>None</div>
                                        <div className="dropdown-item" onClick={()=>this.handleStatus('complete')}>Complete</div>
                                        <div className="dropdown-item" onClick={()=>this.handleStatus('in-progress')}>In-Progress</div>
                                        <div className="dropdown-item" onClick={()=>this.handleStatus('on-hold')}>On-Hold</div>
                                        <div className="dropdown-item" onClick={()=>this.handleStatus('terminated')}>Terminated</div>
                                        
                                    </div>
                                </div>
                                <br />
                                <label><h6>Limit number of results:</h6>
                                    <input id="description" type="number"onChange={this.handleLimit} />
                                </label>
                                <p />
                                <label><h6>Offset limited results:</h6>(Must specify limit)<br />
                                    <input id="description" type="number" onChange={this.handleOffset} />
                                </label>
                                <p />
                                <button className="btn btn-outline-dark" onClick={async ()=>{await this.search()}}>Search</button>
                            </div>
                        </div>
                        <div className="col-4">
                            <p />
                            <h5>Results:</h5>
                            <div className="list-group rounded-lg" style={{height:650, overflowY: 'scroll', background: 'grey'}}>
                                {this.state.searchedReimbursements.map((e) => {
                                    return (<button className="btn btn-outline-dark btn-lg" onClick={() => this.updateDetails(e)} key={`rID${e.reimbursementId}`}>Id: {e.reimbursementId}<br />Status: {e.status}</button>);
                                })}
                            </div>
                        </div>
                        <div className="col-4">
                            <p />
                            <h5>Details:</h5>
                            <div className="list-group rounded-lg" style={{height:400, overflowY: 'scroll', background: 'grey'}}>
                                <h5 style={{marginLeft:15, lineHeight:1, marginTop:15}}>
                                    {this.state.detailedReimbursement.split('\n').map((e)=>{
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
                );
            }
            else{
                return(
                    <div className="container">
                        Only managers are allowed to search through all reimbursements.
                    </div>
                );
            }
        }
        else{
            return(
                <div className="container">
                    Please log in to search all reimbursments.
                </div>
            );
        }
    }
}