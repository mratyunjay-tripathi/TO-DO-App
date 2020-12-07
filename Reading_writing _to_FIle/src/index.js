const express=require("express");
const fs=require("fs");
const app=express();
const cors=require('cors');

app.use(express.json());
app.use(cors());

app.get("/",(req,res)=>{
        res.send("Welcome!");
});

//creating file with data
app.post("/todo",(req,res)=>{
    const id=new Date().valueOf();
    const todo_task=req.body;
   console.log("id",id,"todo_task",todo_task);
    
    todo_task.task_id=id;

    fs.writeFile(`todo/${id}.json`,JSON.stringify(todo_task),"utf-8",function(err){

        if(err){
            console.log("File error while writing",err);
            res.sendStatus(500);
        }else{
            console.log("Wrting file successfull");
            // res.set("Access-Control-Allow-Origin","*");
                res.status(201).send(todo_task);
        }
    });
});

//updating file using id
app.put("/todo",(req,res)=>{
    const data=req.body;
    const id=data.task_id;
    
    fs.readFile(`todo/${id}.json`,"utf-8",function(err){
        if(err){
            console.log("Error while reading",err);
            res.sendStatus(500);
        }else{
                fs.writeFile(`todo/${id}.json`,JSON.stringify(data),"utf-8",function(err){
                 if(err){
                     console.log("error while updating",err);
                     res.sendStatus(500);
                    }else{
                     console.log("Updated");
                     res.send(JSON.stringify(data));
                 }   
                });
        }
    });
});

//deleting task
app.delete("/todo",(req,res)=>{
        const id=req.body.task_id;

        fs.unlink(`todo/${id}.json`,function(err){
            if(err){
               console.log("error while deleting file",err);
               res.sendStatus(404);
            }else{
                res.sendStatus(200);
            }
        });

});

//reading all task and send them to user
app.get("/todo",(req,res)=>{
    const arr=[];
    
    fs.readdir(`todo`,function(err,fileList){
        
        if(err){
            console.error("error while reading dir",err);
            res.sendStatus(500);
        }else{
            const no_of_files=fileList.length;

            console.log("no of file",no_of_files);
        fileList.forEach((file)=>{
            fs.readFile(`todo/${file}`,"utf-8",(err,filedata)=>{

                if(err){
                    console.error("error while readind file",err);
                    res.sendStatus(500);
                }else{
                    console.log(filedata);
                    arr.push(JSON.parse(filedata));
                    
                    if(no_of_files===arr.length){
                        res.send(arr);
                    }
                }
                });
       });
   }
    });
});

app.listen(9090);


