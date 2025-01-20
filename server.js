import { readFile } from "fs/promises";
import {createServer} from "https"
import path from "path";
import { text } from "stream/consumers";

const serveFile=async(res,filepath, ContentType)=>{
    try{
        const data = await readFile(filepath);
        req.writeHead(200,{ "Content-Type":ContentType});
        req.end(data);
    }catch (error){
      res.writeHead(404,{"Content-Type":"text/html"})
      res.end("404 page not found")
    }
     
}


const server = createServer(async (req,res)=>{
    if(req.method=="GET"){
        if(req.url=="/"){
            return serveFile(res, path.join("public","index.html"),"text/html")
        }else if(req.method=="GET"){
            if(req.url=="/style.css"){
                return serveFile(res, path.join("public","style.css"),"text/css")
            }
        }
    }
});

const PORT = 5000;
server.listen(PORT,()=>{
    console.log(`server run on  http://localhost:5000`);
})
