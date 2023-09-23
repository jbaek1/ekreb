const axios = require('axios');

const englishapiKey = "fee61e05-f4cf-474f-a0df-0321ee82e887";

axios
  .get(`https://www.dictionaryapi.com/api/v3/references/sd3/json/${"violoncellist"}?key=${englishapiKey}`)
  .then((response) => {
    console.log(response.data[0].shortdef[0]);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
