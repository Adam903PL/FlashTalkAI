const {Storage} = require('@google-cloud/storage')
require("dotenv").config();
const projectId = process.env.PROJECT_ID

const keyFilename = process.env.KEYFILENAME
const storage = new Storage({projectId,keyFilename})

console.log(projectId,keyFilename,storage)
// async function uploadFiles(bucketName,file,fileOutputNmae){
//     try{

//         const bucket = storage.bucket(bucketName)
//         const ret = await bucket.upload(file,{
//             destination:fileOutputNmae
//         })
//         return ret
//     }catch(err){
//         console.error("Error:",err)
//     }
// }

// (async()=>{
//     const ret = await uploadFiles(process.env.BUCKET_NAME,'cos.txt','ProfilePictures/cos.txt')
//     console.log(ret)
// })();


async function listFilesInFolder(folderName) {
    try {
        const [files] = await storage.bucket(process.env.BUCKET_NAME).getFiles({
            prefix: folderName, // Dodajemy prefix folderu
        });
        let result = []
        if (files.length > 0) {
            files.forEach(file => {
                result.push(file.name)
            });
        } else {
            console.log('No files found in folder.');
        }
        return result
    } catch (err) {
        console.error("Error:", err);
    }
}

async function getFiles() {
    const files = await listFilesInFolder('ProfilePictures/');
    console.log(files); 
}

getFiles(); 

