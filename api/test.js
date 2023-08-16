const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        username: 'hoi',
        password: 'hoi',
        bookmarks: [],
        viewed: {},
    })
};

fetch('http://localhost:5000/updateUser?id=64bff0dd8c969a8dc613cc01', options)
    .then(response => response.json())
    .then(data => {
    console.log('Response:', data);
    })
    .catch(error => {
    console.error('Error:', error);
});