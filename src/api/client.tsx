import axios from 'axios';

const client = axios.create({
    baseURL: 'http://3.133.86.196:3000',
    withCredentials: true
  });
  
  //Library-express is running on my EC2 with public IP 18.232.125.207
  export async function getAllBooks() {
    return await client.get('/books');
  }
  
  export async function getAllUsers() {
    return await client.get('/users');
  }
  
  export async function login(username: string, password: string) {
    return await client.post('/login', {username: username, password: password});
  }