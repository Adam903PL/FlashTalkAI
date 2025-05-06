const express = require("express");
const app = express();
const PORT = process.env.PORT || 4444;
const path = require("path");
const CryptoJS = require("crypto-js");
const { Pool } = require('pg');
const session = require('express-session');
const fs = require('fs');
const cors = require('cors');
const { default: axios } = require("axios");
const nodemailer = require("nodemailer");
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
require('dotenv').config();
const bodyParser = require("body-parser");


const pool = new Pool({
    user: 'flashtalkai_user',
    host: 'dpg-csn4nc0gph6c73ft3neg-a.frankfurt-postgres.render.com',
    database: 'flashtalkai',
    password: 'HgFSozb5BSqc6EZDDau4uJy0gLV9uPTU',
    port: 5432,
    ssl: { rejectUnauthorized: false }
});



app.use(session({
    secret: "secret-key",
    resave: false,  
    saveUninitialized: false,
    cookie: {
        domain: 'localhost',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }
}));



app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: "GET,POST,PUT,DELETE"
}));



app.use(bodyParser.json());

function getFlashcardFiles(directory = '../flashcards') {
    try {
        const files = fs.readdirSync(directory);
        return files.filter(file => fs.statSync(path.join(directory, file)).isFile());
    } catch (err) {
        console.error(`Error reading directory: ${err}`);
        return [];
    }
}
  
  
app.get('/api/test', (req, res) => {
    const files = getFlashcardFiles(path.join(__dirname, '../test'));
    res.json(files);
});


const storageMulter = multer.memoryStorage();
const upload = multer({ storage: storageMulter });

app.post("/upload-profile-picture", upload.single('profilePicture'), async (req, res) => {
    try {
        console.log("Received file:", req.file);
        console.log("Received body:", req.body);
        if (!req.file) {
          return res.status(400).json({ success: false, message: "No file uploaded." });
        }
        const projectId = 661203166313;
        const keyFilename = path.join(__dirname, 'passwords-437219-b892ec591698.json');
        const storage = new Storage({ projectId, keyFilename });

        const bucket = storage.bucket("flashtalkai");
        const file = req.file; 
        const userId = req.body.userid || 'default'; 
        const destination = `ProfilePictures/user${req.session.user.userid}.png`;
        console.log(`${bucket},${file},${req.session.user.userid},${destination}`) 
        const blob = bucket.file(destination);
        const blobStream = blob.createWriteStream({
            resumable: false,
            metadata: {
                cacheControl: 'no-cache, max-age=0',
                contentType: file.mimetype, 
            },
        });

        blobStream.on('error', (err) => {
            console.error("BlobStream error:", err);
            res.status(500).json({ success: false, message: 'File upload error', error: err.message });
        });

        
        blobStream.on('finish', () => {
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            console.log(`File uploaded to ${publicUrl}`);
            res.status(200).json({ success: true, message: 'File uploaded successfully', url: publicUrl });
        });


        blobStream.end(file.buffer);
    } catch (error) {
        console.error("Error during file upload:", error);
        res.status(500).json({ success: false, message: 'Server error during upload' });
    }
});

app.get('/api/flashcards', (req, res) => {
    const files = getFlashcardFiles(path.join(__dirname, '../flashcards'));
    res.json(files);
});

function generateFlashcardEndpoints(directory = '../flashcards') {
    const files = fs.readdirSync(directory);
    const fileList = files.filter(file => fs.statSync(path.join(directory, file)).isFile());

    fileList.forEach(file => {
        const filePath = path.join(directory, file);
        const apiPath = `/api/${path.basename(directory)}/${file}`;

        app.get(apiPath, (req, res) => {
            fs.readFile(filePath, 'utf-8', (err, data) => {
                if (err) {
                    return res.status(404).json({ error: 'Plik nie znaleziony' });
                }
                try {
                    const jsonData = JSON.parse(data);
                    res.json(jsonData);
                } catch (parseError) {
                    return res.status(500).json({ error: 'Błąd przy przetwarzaniu pliku JSON' });
                }
            });
        });
    });
}



generateFlashcardEndpoints(path.join(__dirname, '../flashcards'));
generateFlashcardEndpoints(path.join(__dirname, '../test'));


function sendVerificationEmail(receiverEmail) {
    const AUTH_TOKEN = process.env.GOOGLE_AUTH 
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let verificationCode = '';
    for (let i = 0; i < 8; i++) {
      verificationCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const transporter = nodemailer.createTransport({
      service: "gmail", 
      auth: {
        user: "pukaluk.adam505@gmail.com", 
        pass: "", 
      },
    });
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verification Code</title>
          <style>
              body {
                  margin: 0;
                  padding: 0;
                  background-color: #000;
                  font-family: Arial, sans-serif;
                  color: #fff;
                  text-align: center;
              }
              .container {
                  max-width: 500px;
                  margin: 50px auto;
                  background: linear-gradient(145deg, #0d1f33, #112b4d);
                  border: 2px solid #007bff;
                  border-radius: 15px;
                  box-shadow: 0 0 15px rgba(0, 123, 255, 0.5), 0 0 30px rgba(0, 123, 255, 0.3);
                  padding: 20px;
              }
              h1 {
                  font-size: 24px;
                  margin-bottom: 20px;
                  color: #00bfff;
                  text-shadow: 0 0 5px #00bfff, 0 0 10px #00bfff;
              }
              p {
                  font-size: 16px;
                  margin-bottom: 30px;
                  color: #d9d9d9;
              }
              .code {
                  font-size: 32px;
                  font-weight: bold;
                  color: #007bff;
                  text-shadow: 0 0 10px #007bff, 0 0 20px #007bff;
                  padding: 10px 20px;
                  border: 2px solid #007bff;
                  border-radius: 10px;
                  display: inline-block;
                  background: rgba(0, 0, 0, 0.5);
              }
              .footer {
                  margin-top: 20px;
                  font-size: 12px;
                  color: #777;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>Verification Code</h1>
              <p>Use the code below to complete your verification process. This code is valid for the next 10 minutes.</p>
              <div class="code">${verificationCode}</div>
              <p>If you did not request this code, please ignore this email or contact support.</p>
              <div class="footer">© 2025 FlashTalkAI. All rights reserved.</div>
          </div>
      </body>
      </html>
    `;
  
    const mailOptions = {
      from: "FlashTalkAI <pukaluk.adam505@gmail.com>", 
      to: receiverEmail, 
      subject: "Your Verification Code", 
      html: htmlContent, 
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Błąd podczas wysyłania e-maila:", error);
      } else {
        console.log("E-mail został wysłany:", info.response);
      }
    });
    return verificationCode
  }
  

app.post("/needverification",async (req,res)=>{
    let datas = {
        email: req.body.email,
        password: CryptoJS.SHA256(req.body.password).toString(),
    };
    try{
        const client = await pool.connect();
        const query1 = 'select twostepverification from users where password = $1 and email = $2'
        const values1 = [datas.password,datas.email];
        console.log(values1,"values1")
        const response1 = await client.query(query1, values1);
        const databseResp1 = response1.rows[0]?.twostepverification;
        console.log("wykonywanie neefverify post",databseResp1)
        res.json({needverify:databseResp1})
        client.release();  
    }catch(err){
        console.error("Error during connection to database needverification:", err);
        res.json({ success: false, message: "Błąd serwera" });
    }
})

app.post("/generateverificationcode", async (req, res) => {
    console.log("wykonuje się");

    let datas = {
        email: req.body.email,
    };

    try {
        console.log("Wykonywanie generowania kodu weryfikacyjnego");
        
        const code = sendVerificationEmail(datas.email);
        console.log(code,"ksks")
        res.json({ success: true, message: code });
    } catch (err) {
        console.error("Błąd serwera:", err);
        res.json({ success: false, message: "Błąd serwera" });
    }
});

app.post("/changepassword",async (req,res)=>{
    console.log("wykonwyanie changepassword")
    let datas = {
        email: req.body.email,
        password: CryptoJS.SHA256(req.body.password).toString(),
    };
    try{
        const client = await pool.connect();
        const query1 = 'UPDATE users SET password = $1 where email = $2'
        const values1 = [datas.password,datas.email];
        const response1 = await client.query(query1, values1);
        if (response1.rowCount > 0) {
            res.json({ success: true, message: "Hasło zostało zmienione pomyślnie." });
          } else {
            res.json({ success: false, message: "Nie znaleziono użytkownika o podanym adresie email." });
          }
        client.release();  
    }catch(err){
        console.error("Error during connection to database changepassword:", err);
        res.json({ success: false, message: "Błąd serwera" });
    }
})

app.post("/loginData", async (req, res) => {
    let datas = {
        email: req.body.email,
        password: CryptoJS.SHA256(req.body.password).toString(),
    };

    try {
        const client = await pool.connect();
        const query = 'SELECT check_user_credentials($1, $2)';
        const values = [datas.email, datas.password];
        console.log(values)
        const response = await client.query(query, values);
        const databseResp = response.rows[0]?.check_user_credentials;
        
        console.log(databseResp,"databaseResp")
        if (databseResp != null) {
            req.session.user = { userid: databseResp, role: 'user' };
            console.log('Sesja po zalogowaniu:', req.session);  
            res.json({ success: true, message: "Zalogowano pomyślnie", user: req.session.user });
        } else {
            res.json({ success: false, message: "Błąd logowania - złe dane" });
        }
        client.release();  
    } catch (err) {
        console.error("Error during connection to database:", err);
        res.json({ success: false, message: "Błąd serwera" });
    }
});

app.get("/usersettings", async (req, res) => {
    console.log(req.session)
    if (!req.session.user || !req.session.user.userid) {
        return res.status(401).json({ success: false, message: "Brak autoryzacji" });
      }
  
    try {
      const client = await pool.connect();
      const query = 'SELECT email, password, twostepverification,profiletype FROM users WHERE id = $1';
      const values = [req.session.user.userid];
      console.log(values);
  
   
      const response = await client.query(query, values);
      if (response.rows.length > 0) {
        const userData = response.rows[0]; 
        console.log(userData, "databaseResp");
  
        res.json({ success: true, data: userData });
      } else {
        res.status(404).json({ success: false, message: "Nie znaleziono użytkownika" });
      }
  
      client.release();
    } catch (err) {
      console.error('Błąd podczas pobierania danych o ustawieniach użytkownika:', err);
      res.status(500).json({ success: false, message: 'Błąd serwera', error: err });
    }
  });

  app.get("/cancelpremiumplan", async (req, res) => {
    try {
      const client = await pool.connect();
  
      const updateQuery = 'UPDATE users SET profiletype = $1 WHERE id = $2';
      const deleteQuery = 'DELETE FROM creditcard WHERE user_id = $1';
  
      const values = [ "normal", req.session.user.userid ];
  

      await client.query(updateQuery, values);

      await client.query(deleteQuery, [req.session.user.userid]);
  
      res.status(200).json({ success: true, message: 'Premium plan anulowany i dane usunięte' });
  
      client.release();
    } catch (err) {
      console.error('Błąd podczas anulowania planu premium', err);
      res.status(500).json({ success: false, message: 'Błąd serwera', error: err });
    }
  });
  



  async function listFilesInFolder(folderName) {
    try {
        const projectId = 661203166313;
        const keyFilename = path.join(__dirname, 'passwords-437219-b892ec591698.json');
        const storage = new Storage({ projectId, keyFilename });

        const [files] = await storage.bucket("flashtalkai").getFiles({
            prefix: folderName, 
        });
        
        let result = []; 
        if (files.length > 0) {
            files.forEach(file => {
                result.push(file.name);
            });
        } else {
            console.log('No files found in folder.');
        }

        return result;
    } catch (err) {
        console.error("Error:", err);
    }
}

// Funkcja wywołująca listowanie plików
async function getFiles() {
    const files = await listFilesInFolder('ProfilePictures/'); // Wywołujemy listFilesInFolder z odpowiednim folderem
    console.log(files); // Wypisujemy wynik w konsoli
    return files; 
}

// Wywołanie getFiles, aby uzyskać listę plików
getFiles().then(files => {
    console.log('Lista plików:', files); 
});


app.get('/google-cloud-storm-files', async (req, res) => {
    try {
        const files = await getFiles();
        if(files.length > 0 ){
            res.json({succes:true,files }); 
        }else{
            res.json({succes:false})
        }
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});










 
  app.post("/delete-account", async (req, res) => {
    const { password } = req.body;
    const pass = CryptoJS.SHA256(password).toString();
  
    try {
      const client = await pool.connect();
  
      const updateQuery = "SELECT id FROM users WHERE id = $1 AND password = $2";
      const deleteQuery = "SELECT usun_dane_z_baz($1)";
  
      const updateValues = [req.session.user.userid, pass];
  
      // Weryfikacja użytkownika
      const updateResult = await client.query(updateQuery, updateValues);
  
      if (updateResult.rows.length === 0) {
        return res.status(400).json({ success: false, message: "Invalid password or user does not exist." });
      }
  
      // Usuwanie danych użytkownika
      const deleteValues = [req.session.user.userid];
      await client.query(deleteQuery, deleteValues);
  
      // Niszczymy sesję użytkownika
      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session after account deletion:", err);
          return res.status(500).json({ success: false, message: "Account deleted, but failed to destroy session." });
        }
  
        // Zwracamy sukces, jeśli wszystko się powiodło
        return res.status(200).json({
          success: true,
          message: "Your account has been successfully deleted, and your session has been destroyed.",
        });
      });
  
      client.release();
    } catch (err) {
      console.error("Error deleting account:", err);
      res.status(500).json({
        success: false,
        message: "Server error. Please try again later.",
        error: err,
      });
    }
  });
  
  

  app.post("/update-credit-card", async (req, res) => {
    const {
      newCardNumber,
      newExpirationDate,
      newCvv,
      newBillingAddress,
      newCardType,
    } = req.body;
  
    try {
      const client = await pool.connect();
  

      const query = 'SELECT update_credit_card($1, $2, $3, $4, $5, $6)';
      const values = [
        req.session.user.userid,      
        newCardNumber,                
        newExpirationDate,            
        newCvv,                       
        newBillingAddress,           
        newCardType                  
      ];
  
      console.log(query); 
      console.log(values); 
  

      const result = await client.query(query, values);


      const query2 = 'update users set profiletype = premium where id = $1'
      const values2 = [req.session.user.userid]

      const result2 = await client.query(query2,values2)
      client.release();
  
      if (result.rows && result.rows.length > 0) {
        res.json({ success: true, message: "Card details updated successfully." });
      } else {
        res.json({ success: false, message: "Failed to update card details." });
      }
    } catch (err) {
      console.error("Error during card update:", err);
      res.status(500).json({ success: false, message: "Server error", error: err });
    }
  });
  

app.post("/changebasicsettings", async (req, res) => {
    console.log(req.body,"this")
    const data = {
      email: req.body.email, 
      password: req.body.password === '' ? null : CryptoJS.SHA256(req.body.password).toString(), 
      twostepverification: req.body.isTwoStepVerificationEnabled === true ? true : null, 
    };
    console.log(data,"this")
    try {
      const client = await pool.connect();
      const query = 'SELECT update_user_basic_settings($1, $2, $3, $4);';
      const values = [req.session.user.userid, data.email, data.password, data.twostepverification]; // Zmienione na data.twostepverification
      console.log(values);
      const response = await client.query(query, values);
      const databaseResp = response.rows[0]?.update_user_basic_settings;
      
      if (databaseResp) {
        res.json({ success: databaseResp, message: "Zmieniono dane użytkownika" });
      } else {
        res.json({ success: databaseResp, message: "Błąd podczas zmieniania danych użytkownika" });
      }
      client.release();
    } catch (err) {
      console.error('Błąd podczas zmieniania basic danych:', err);
      res.status(500).json({ success: false, message: 'Błąd serwera', error: err });
    }
  });
  

app.get("/loginsucces", async (req, res) => {
    try { 
        if (req.session.user) { 
            res.json({ succes:true, message: req.session });
        } else {
            res.json({ succes:false, message: "Waiting for data" });
        }
    } catch (error) {
        console.error('Błąd podczas pobierania danych sesji:', error);
        res.status(500).json({ message: 'Błąd serwera', error: error });
    }
});

app.post("/registerData", async (req, res) => {
    console.log(req.body);
    let response;
    try {
        if (req.body.profileType === "premium") {
            const client = await pool.connect();
            const query = 'SELECT create_user($1::VARCHAR, $2::VARCHAR, $3::BOOLEAN, $4::VARCHAR, $5::VARCHAR, $6::VARCHAR, $7::VARCHAR, $8::VARCHAR, $9::VARCHAR)';
            const values = [
                req.body.email,
                CryptoJS.SHA256(req.body.password).toString(),
                req.body.enable2FA,
                req.body.profileType,
                req.body.card_number,
                req.body.expiration_date,
                req.body.cvv,
                req.body.billing_address,
                req.body.card_type
            ];            
            response = await client.query(query, values);
            client.release();
        } else if (req.body.profileType === "normal") {
            const client = await pool.connect();
            const query = 'SELECT create_user($1, $2, $3, $4)';
            const values = [
                req.body.email,
                CryptoJS.SHA256(req.body.password).toString(), // poprawienie wartości
                req.body.enable2FA,
                req.body.profileType
            ];
            response = await client.query(query, values);
            client.release();
        }

        if (response && response.rows && response.rows[0].create_user === true) {
            res.json({ success: true, message: "Dodano użytkownika pomyślnie" });
        } else {
            res.json({ success: false, message: "Błąd podczas rejestracji użytkownika" });
        }
    } catch (err) {
        console.error("Błąd podczas połączenia z bazą danych:", err);
        res.json({ success: false, message: "Błąd serwera" });
    }
});

app.get("/logout", (req, res) => {
    
    req.session.destroy((err) => {
        if (err) {
            return res.json({ success: false, message: "Błąd podczas wylogowywania" });
        }
    });
});







app.post("/changeKnown", async (req, res) => {
    console.log("Wykonywanie changeKnown post");
    if (!req.session.user || !req.session.user.userid) {
        return res.status(401).json({ success: false, message: "Brak autoryzacji1" });
    }
    if (!req.body.wordId || req.body.falseOrTrue === undefined) {  
        return res.status(400).json({ success: false, message: "Brak wordId lub falseOrTrue w danych" });
    }

    try {
        const client = await pool.connect();
        let query;
        if (req.body.falseOrTrue === true) {
            query = 'SELECT set_flashcard_known_true($1, $2)';
        } else if (req.body.falseOrTrue === false) {
            query = 'SELECT set_flashcard_known_false($1, $2)';
        }
    
        console.log(query, "changeknown");
        const values = [req.session.user.userid, req.body.wordId];
        console.log(values, "changeknown values");

        const response = await client.query(query, values);
        console.log(response);

        if (response.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Słowo nie zostało znalezione." });
        }

        res.status(200).json({
            success: true,
            message: "Status słowa został zaktualizowany.",
            known: response.rows[0]
        });

        client.release();
    } catch (err) {
        console.error("Błąd bazy danych:", err);
        res.status(500).json({ success: false, message: "Wystąpił błąd podczas przetwarzania zapytania." });
    }
});





app.post('/getAllWords', async (req, res) => {
    if (!req.session.user || !req.session.user.userid) {
        return res.status(401).json({ success: false, message: "Brak autoryzacji2" });
    }

    const { from, to } = req.body; 
    console.log(from,to,"heresssss")
    try {
        const client = await pool.connect();
        const query = "SELECT * FROM user_flashcards WHERE user_id = $1 AND flashcard_id BETWEEN $2 AND $3 ORDER BY flashcard_id ASC";
        const values = [req.session.user.userid, from, to];
        
        console.log("Wykonane zapytanie:", query);
        console.log("Wartości:", values);

        const response = await client.query(query, values);


        res.json({ success: true, data: response.rows });
        
        client.release(); 

    } catch (err) {
        console.error("Błąd bazy danych:", err);
        res.status(500).json({ success: false, message: "Wystąpił błąd podczas przetwarzania zapytania." });
    }
});



















app.get("/get-userid", async (req, res) => { 
    if (!req.session.user || !req.session.user.userid) {
        return res.status(401).json({ success: false, message: "Brak autoryzacji" });
    }

    try {   
        res.json({ success: true, userId: req.session.user.userid });
    } catch (err) {
        console.log("getUserId:", err);
        res.status(500).json({ success: false, message: "Błąd serwera" });
    }
});


 
app.get("/checkpfppossession",async(req,res)=>{
    try{
        const files = getFiles(); 
        const checkingArr = files.forEach(file=>{
            checkingArr.push(parseInt(file.name.replace('user','').replace(".png",'')))

        })
        if(req.session.user.userid in checkingArr){
            res.json({success:true,pfpPossession:true})
        }else{res.json({success:false,pfpPossession:true})}
    }catch (err) {
        console.error("Error:", err);
    }
})


app.post('/getKnownWordsByUnitId', async (req, res) => {
    console.time("start")
    const { from, to } = req.body; 
    console.log(from,to,"heresssss")
    try {

        const client = await pool.connect();
        const query = "SELECT flashcard_id FROM user_flashcards WHERE user_id = $1 AND flashcard_id BETWEEN $2 AND $3 AND known = false ORDER BY flashcard_id ASC"
        
        const values = [req.session.user.userid, from, to];
        
        console.log("Wykonane zapytanie:", query);
        console.log("Wartości:", values);

        const response = await client.query(query, values);

        console.log(response.rowCount,"very important much")
        res.json({ success: true, data: response.rows });
        
        client.release(); 

    } catch (err) {
        console.error("Błąd bazy danych:", err);
        res.status(500).json({ success: false, message: "Wystąpił błąd podczas przetwarzania zapytania." });
    }
    console.timeEnd("start")
});
























app.get('/api/tematData', async (req,res)=>{
    
    try{
        const client = await pool.connect();
        const query = "select * from public.conversation_topics"
        const response = await client.query(query);
        res.json({data:response.rows})

        client.release(); 
    } catch (err){
        res.json({messsage:err})
    }
} )


app.get('/getAllTopics', async (req,res)=>{
    if (!req.session.user || !req.session.user.userid) {
        return res.status(401).json({ success: false, message: "Brak autoryzacji3" });
    }
    try{
        const client = await pool.connect();
        const query = "SELECT lat.topicid, lat.topicdescription,lap.point FROM learn_ai_topics AS lat LEFT JOIN learn_ai_points AS lap ON lap.topicid = lat.topicid AND lap.userid = $1 order by topicid asc"
        console.log(query,"ksks")
        const values = [req.session.user.userid];
        const response = await client.query(query,values);
        res.json({data:response.rows})

        client.release(); 
    } catch(err){
        console.log(err)
    }
})




app.get('/getuserdatas', async (req, res) => {
    if (!req.session.user || !req.session.user.userid) {
        return res.status(401).json({ success: false, message: "Brak autoryzacji4" });
    }

    try {
        const client = await pool.connect();
        const query = "SELECT points,userlevel FROM user_points_and_levels where userid = $1";
        const values = [req.session.user.userid];
        
        console.log("Wykonane zapytanie:", query);
        console.log("Wartości:", values);
        
        const response = await client.query(query, values);
        
        if (response.rows.length > 0) {
            const { points, userlevel } = response.rows[0]; 
            console.log(points, userlevel, "kskskskServer");
            res.json({ points, level: userlevel });
        } else {
            res.status(404).json({ success: false, message: "No data found for user." });
        }
        
        client.release();
        
    } catch (err) {
        console.error("Error during query:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});


app.post('/addpointlearwithai', async (req, res) => {
    if (!req.session.user || !req.session.user.userid) {
        return res.status(401).json({ success: false, message: "Brak autoryzacji5" });
    }
    try {
        const client = await pool.connect();

        const updateQuery = "UPDATE learn_ai_points SET point = 4 WHERE topicid = $1 AND userid = $2";
        const updateValues = [parseInt(req.body.topicid.lesson), req.session.user.userid];
        console.log(updateValues,"take bambo take pete eko teka  ")
        const updateResponse = await client.query(updateQuery, updateValues);

        if (updateResponse.rowCount > 0) {
            res.json({ success: true, message: "Points updated successfully." });
        } else {
            res.json({ success: false, message: "No matching topic or user found." });
        }

        client.release();

    } catch (err) {
        console.error("Error during query:", err);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
});


app.get('/checkislogedin', (req, res) => {
    if (!req.session.user || !req.session.user.userid) {
        return res.status(401).json({ success: false, message: "Brak autoryzacji6" });
    } else {
        return res.status(200).json({ 
            success: true, 
            message: "Użytkownik jest zalogowany", 
            session: req.session 
        });
    }
});



app.get('/getuserpoint', async (req, res) => {
    try {
        const client = await pool.connect();

        const query = `
        SELECT 
            (SELECT COUNT(known) 
            FROM user_flashcards 
            WHERE user_id = $1) AS User_Flash_Card_Points,
            u.points as user_learn_ai_points,
            u.userlevel as user_learn_ai_level
        FROM 
            user_points_and_levels u
        WHERE 
            u.userid = $1;`;


        const values = [1];


        const result = await client.query(query, values);


        client.release();

        if (result.rows.length > 0) {
            const data = result.rows[0]; 
            return res.status(200).json({
                success: true,
                message: "Dane użytkownika zostały pobrane",
                data: {
                    UserLearnAiPoints: data.user_learn_ai_points || 0,
                    UserLearnAiLevel: data.user_learn_ai_level || 0,
                    UserFlashCardPoints: data.user_flash_card_points || 0

                }
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "Nie znaleziono punktów dla tego użytkownika"
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Wystąpił błąd serwera",
            error: err.message
        });
    }
});






app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});