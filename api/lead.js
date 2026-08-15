module.exports = async function handler(req,res){
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
 if(!String(req.headers['content-type']||'').includes('application/json'))return res.status(415).json({error:'JSON required'});
 const clean=(v,n)=>typeof v==='string'?v.trim().slice(0,n):'';const name=clean(req.body?.name,120),email=clean(req.body?.email,254),message=clean(req.body?.message,3000);
 if(req.body?.consent!==true)return res.status(400).json({error:'Consent required'});
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return res.status(400).json({error:'Valid email required'});
 try{const upstream=await fetch('https://rn-api-rn-collins.vercel.app/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email,message,source:'contact-architect-psychonaut-bookworm'})});if(!upstream.ok)return res.status(502).json({error:'Inquiry service unavailable'});return res.status(200).json({success:true})}catch(_){return res.status(502).json({error:'Inquiry service unavailable'})}
};