import { readFile } from "fs/promises";
import {createServer} from "https"
import path from "path";

const server = createServer(async (req,res)=>{
    if(req.method=="GET"){
        if(req.url=="/"){
            try{
                const data = await readFile(path.join("public","index.html"));
                req.writeHead(200,{ "Content-Type":"text/html"});
                req.end(data);
            }catch (error){
              res.writeHead(404,{"Content-Type":"text/html"})
              res.end("404 page not found")
            }
        }
    }
});

server.listen(3000,()=>{
    console.log(`server run on  http://localhost:3000`);
    
})
