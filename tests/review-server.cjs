/* Local review server: node tests/review-server.cjs /absolute/site/root 8080.
   Applies actual _redirects; excludes dotfiles and unknown file types. */
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(process.argv[2]||'.'),port=Number(process.argv[3]||8080);
const rules=fs.readFileSync(path.join(root,'_redirects'),'utf8').trim().split('\n').map(l=>l.split(/\s+/));
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2','.json':'application/json','.webmanifest':'application/manifest+json','.md':'text/plain'};
http.createServer((req,res)=>{let route;try{route=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400);return res.end()}
if(route.split('/').some(p=>p.startsWith('.'))){res.writeHead(403);return res.end()}
const rule=rules.find(r=>r[0]===route);if(rule&&rule[2]!=='200'){res.writeHead(Number(rule[2]),{Location:rule[1]});return res.end()}
route=rule?rule[1]:route;if(!path.extname(route)&&fs.existsSync(path.join(root,route+'.html')))route+='.html';if(route.endsWith('/'))route+='index.html';const file=path.resolve(root,'.'+route);
if(!file.startsWith(root+'/')||!mime[path.extname(file)]){res.writeHead(404);return res.end()}
fs.readFile(file,(err,data)=>{res.writeHead(err?404:200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(err?'Not found':data)});
}).listen(port,'127.0.0.1',()=>console.log('Review server '+port));
