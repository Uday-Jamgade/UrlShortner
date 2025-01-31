import { readFile } from "fs/promises";
import {createServer} from "https"
import path from "path";
import http from "http"
import crypto from "crypto"
import  { writeFile } from "fs/promises"
import { json, text } from "stream/consumers";

const Data_file = path.join("data","links.json")

const serveFile= async (res,filepath, ContentType)=>{
    try{
        const data =await readFile(filepath);
        res.writeHead(200,{ "Content-Type":ContentType});
        res.end(data);
    }catch (error){
      res.writeHead(404,{"Content-Type":"text/plain"})
      res.end(`<h1>404 page not found</h1>`)
    }

}

const loadlinks = async ()=>{
    try {
        const data = await readFile(Data_file,"utf-8")
        return JSON.parse(data)
    } catch (error) {
        if(error.code==="ENOENT"){
            await writeFile(Data_file, JSON.stringify({}));
            return{}
        } 
        throw error;
    }
}

const saveLinkes= async (links)=>{
 await writeFile(Data_file,JSON.stringify(links))
};

const server = http.createServer(async (req,res)=>{
    if(req.method==="GET"){
        if(req.url==="/"){

            return serveFile(res, path.join("public","index.html"),"text/html")

        }else if(req.url==="/style.css"){

                return serveFile(res, path.join("public","style.css"),"text/css")
            
            } else if(req.url==="/links"){
                const links =await loadlinks();

                res.writeHead(200,{"Content-Type":"application/json"})
               return res.end(JSON.stringify(links))
            }
        
    };

    if(req.method==="POST" && req.url==="/Short"){
     
        const links = await loadlinks()

        let body = "";
        req.on("data",(chunk)=>(body=body+chunk))

        req.on("end", async()=>{
            console.log(body);
            
            const {url,shortcode}=JSON.parse(body);

            if(!url){
                res.writeHead(404,{"Content-Type":"text/plain"})
                return res.end("url is required")
            }
            const finalcode = shortcode || crypto.randomBytes(4).toString("hex");

            if(links[finalcode]){
                res.writeHead(400,{"Content-Type":"text/plain"});
                return res.end("Short code already exists. Please choose another")
            }
            
            links[finalcode]=url;

            await saveLinkes(links) ;

            res.writeHead(400,{"Content-Type":"text/plain"});
             res.end(JSON.stringify({success:true,shortcode:finalcode}))
        })
    }
});



const PORT = 3002;
server.listen(PORT,()=>{
    console.log(`server run on  http://localhost:${PORT}`);
})