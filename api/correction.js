const crypto = require('crypto');
const buckets = new Map();
module.exports = async function handler(req,res){
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
 if(!String(req.headers['content-type']||'').includes('application/json'))return res.status(415).json({error:'JSON required'});
 const ip=String(req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0].trim(),now=Date.now();
 const recent=(buckets.get(ip)||[]).filter(t=>now-t<3600000);if(recent.length>=5)return res.status(429).json({error:'Request limit reached. Try again later.'});recent.push(now);buckets.set(ip,recent);
 const clean=(v,n)=>typeof v==='string'?v.trim().slice(0,n):'';
 const requestType=clean(req.body?.requestType,80),recordId=clean(req.body?.recordId,180),name=clean(req.body?.name,120),email=clean(req.body?.email,254),message=clean(req.body?.message,5000);
 if(req.body?.consent!==true)return res.status(400).json({error:'Consent required'});
 if(!requestType||!recordId||!name||!message)return res.status(400).json({error:'All request fields are required'});
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return res.status(400).json({error:'Valid email required'});
 const reference='PB-'+crypto.randomBytes(6).toString('hex').toUpperCase();
 try{const upstream=await fetch('https://rn-api-rn-collins.vercel.app/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email,message:`Publication request ${reference}\nType: ${requestType}\nRecord: ${recordId}\n\n${message}`,source:'correction-psychonaut-bookworm'})});if(!upstream.ok)return res.status(502).json({error:'Correction service unavailable'});return res.status(200).json({success:true,reference})}catch(_){return res.status(502).json({error:'Correction service unavailable'})}
};