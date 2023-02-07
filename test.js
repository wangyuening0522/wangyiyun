 import request from './template.js';
 let btn=document.querySelector('button');
 btn.addEventListener('click',request('/top/playlist/highquality?cat="古风"&limit=10',{
    methods:'GET',
}).then(data=>console.log(data))
.catch(error=>console.error(error))
)
// postData('/api/users', 
// { method: "POST",
//  body: JSON.stringify({name: 'John', age: 30 })
// })
// .then(data => console.log(data))
//   .catch(error => console.error(error));