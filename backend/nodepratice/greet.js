
const fs = require('fs');



// function for exports
function greet(name)
{
    return `Hi ${name},Welcome `
}

// write  file
fs.writeFile('fileSystem.txt',"hello world",(err)=>{
    if(err) throw err;
    console.log("write file is successfull")
})

// read file

fs.readFile('fileSystem.txt','utf8',(err,data)=>{
    if(err) throw err
    console.log("data",data);
})


// appending

fs.appendFile('fileSystem.txt','\n Hello World',(err)=>{
    if(err) throw err
    console.log("appended")
})

// deletig file

// fs.unlink('hello.js',(err)=>{
//     if(err) throw err
//     console.log("deleted successfully")
// })

// creating the folder

// fs.mkdir('pratice',(err)=>{
//     if(err) throw err
//     console.log("Folder created successfully.")
// })


// fs.mkdir('task', (err) => {
//   if (err) throw err;
//   console.log("Folder Created.");

//   fs.writeFile('task/user.txt', 'Hello World', (err) => {
//     if (err) throw err;
//     console.log("File Created Successfully inside task folder.");
//   });
// });


fs.readFile('task/user.txt','utf8',(err,data)=>{
    if(err) throw err
    console.log("display text",data);
})


setTimeout(()=>{
    fs.unlink('hello.js',(err)=>{
    if(err) throw err
    console.log("deleted file");
})

},5000)


// fs.




// module.exports = greet