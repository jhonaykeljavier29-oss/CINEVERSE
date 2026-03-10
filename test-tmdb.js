const https = require('https');
const key = 'T7023f295dc41a6983013d567b133c601';
const url = `https://api.themoviedb.org/3/discover/movie?api_key=${key}&language=es-ES&page=1&sort_by=popularity.desc`;
https.get(url, res =>{
  let data='';
  res.on('data', chunk=>data+=chunk);
  res.on('end', ()=>{
    console.log('status',res.statusCode);
    try{ const json = JSON.parse(data);
      console.log('results',json.results && json.results.length);
    }catch(e){console.error('parse error',e,data)}
  });
}).on('error', e=>console.error(e));