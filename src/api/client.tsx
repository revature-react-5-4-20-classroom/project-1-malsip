import axios from 'axios';

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

  export async function updateReimbursement(reimbursementId: number, dateResolved: number, resolver: number, status: string) {
    return await (await client.patch('/reimbursements', {reimbursementId: reimbursementId, dateResolved: dateResolved, resolver: resolver, status: status})).data;
  }
  
  export async function getAllUsers() {
    return await (await client.get('/users')).data;
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