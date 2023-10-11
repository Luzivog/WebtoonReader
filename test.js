const axios = require('axios');

async function getBase64FromImageUrl(url) {
    const response = await axios.get(url, {responseType: 'arraybuffer'});
    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    return `data:${response.headers['content-type']};base64,${base64}`;
}

// Usage example:
const imageURL = "https://www.toonix.xyz/cdn_mangaraw/archmage-transcending-through-regression/chapter-1/1.jpg";
getBase64FromImageUrl(imageURL).then(base64 => {
    console.log("done");
}).catch(error => {
    console.error('Error:', error);
});