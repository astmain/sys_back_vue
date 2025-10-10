var axios = require('axios');
                  

var config = {
   method: 'get',
   url: 'http://localhost:3000/users',
   headers: { 
      'Pragma': 'no-cache', 
      'Request-Origion': 'Knife4j', 
      'Content-Type': 'application/x-www-form-urlencoded'
   }
};

axios(config)
.then(function (response) {
   console.log(JSON.stringify(response.data));
})
.catch(function (error) {
   console.log(error);
});
