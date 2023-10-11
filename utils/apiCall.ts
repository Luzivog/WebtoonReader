import { API_URL } from "../env";

export async function createUser(username: string, password: string): Promise<any> {

    const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    };

	fetch(API_URL+'users', options)
        .then(response => response.json())
        .then(data => {
            console.log('Response:', data);
        })
        .catch(error => {
        console.error('Error:', error);
    });
};

export async function getUser(options : string[]): Promise<any> {


};