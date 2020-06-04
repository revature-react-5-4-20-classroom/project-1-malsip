import axios from 'axios';
import { Reimbursement } from '../models/Reimbursement';

const client = axios.create({
    baseURL: 'http://3.133.86.196:3000',
    withCredentials: true
  });
  
  export async function getAllReimbursements() {
    return await (await client.get('/reimbursements')).data;
  }

  export async function getReimbursementsByAuthor(userId: number) {
    return await (await client.get(`/reimbursements/author/userId/${userId}`)).data;
  }

  export async function getReimbursementsByAdvancedSearch(author: string, dateSubmitted: number, dateResolved: number, resolver: string, status: string, limit: number, offset: number) {
    //console.log(`/reimbursements/advanced/orders?author=${author !== '' ? author : '0'}${dateSubmitted !== 0 ? `&datesubmitted=${dateSubmitted}` : ``}${dateResolved !== 0 ? `&dateresolved=${dateResolved}` : ``}${resolver !== '' ? `&resolver=${resolver}` : ``}${status !== 'none' ? `&status=${status}` : ``}${limit !== 0 ? `&limit=${limit}&offset=${offset}` : ``}`);
    return await (await client.get(`/reimbursements/advanced/orders?author=${author !== '' ? author : '0'}${dateSubmitted !== 0 ? `&datesubmitted=${dateSubmitted}` : ``}${dateResolved !== 0 ? `&dateresolved=${dateResolved}` : ``}${resolver !== '' ? `&resolver=${resolver}` : ``}${status !== 'none' ? `&status=${status}` : ``}${limit !== 0 ? `&limit=${limit}&offset=${offset}` : ``}`)).data;
  }

  export async function updateReimbursement(reimbursementId: number, dateResolved: number, resolver: number, status: string) {
    return await (await client.patch('/reimbursements', {reimbursementId: reimbursementId, dateResolved: dateResolved, resolver: resolver, status: status})).data;
  }

  export async function createReimbursement(reimbursement: Reimbursement, author: number) {
    return await client.post('/reimbursements', {reimbursementId: reimbursement.reimbursementId, author: author, amount: reimbursement.amount, dateSubmitted: reimbursement.dateSubmitted, dateResolved: reimbursement.dateResolved, description: reimbursement.description, status: reimbursement.status, type: reimbursement.type});
  }
  
  export async function getAllUsers() {
    return await (await client.get('/users')).data;
  }

  export async function getUserById(userId: number) {
    return await (await client.get(`/users/${userId}`)).data;
  }

  export async function getUserByAdvancedSearch(limit: number, offset: number) {
    return await (await client.get(`/users/orders?limit=${limit}&offset=${offset}`)).data;
  }

  export async function login(username: string, password: string) {
    return await (await client.post('/login', {username: username, password: password})).data;
  }

  export async function getCredentials(){
      return await (await client.get('/credentials')).data;
  }

  export async function logout(){
      return await client.get('/logout');
  }

  export async function updateUserInfo(userId : number, username : string, password : string, firstName : string, lastName : string, email : string, role : string,){
      return await (await client.patch('/users', {userId : userId, username : username, password : password, firstname : firstName, lastname : lastName, email : email, role : role})).data;
  }