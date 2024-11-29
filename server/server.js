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
const dotenv = require('dotenv').config();

  
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

// Konfiguracja CORS
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));


app.use(express.json());

function getFlashcardFiles(directory = './flashcards') {
    try {
        const files = fs.readdirSync(directory);
        return files.filter(file => fs.statSync(path.join(directory, file)).isFile());
    } catch (err) {
        console.error(`Error reading directory: ${err}`);
        return [];
    }
}

app.get('/api/flashcards', (req, res) => {
    const files = getFlashcardFiles(path.join(__dirname, 'flashcards'));
    res.json(files);
});

function generateFlashcardEndpoints(directory = './flashcards') {
    const files = fs.readdirSync(directory);
    const fileList = files.filter(file => fs.statSync(path.join(directory, file)).isFile());

    fileList.forEach(file => {
        const filePath = path.join(directory, file);
        app.get(`/api/flashcards/${file}`, (req, res) => {
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



generateFlashcardEndpoints(path.join(__dirname, 'flashcards'));
app.post("/loginData", async (req, res) => {
    let datas = {
        email: req.body.email,
        password: CryptoJS.SHA256(req.body.password).toString(),
    };

    try {
        const client = await pool.connect();
        const query = 'SELECT check_user_credentials($1, $2)';
        const values = [datas.email, datas.password];
        const response = await client.query(query, values);
        const databseResp = response.rows[0]?.check_user_credentials;

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
    let datas = {
        email: req.body.email,
        password: CryptoJS.SHA256(req.body.password).toString(),
    };

    try {
        const client = await pool.connect();
        const query = 'SELECT create_user($1, $2)';
        const values = [datas.email, datas.password];
        const response = await client.query(query, values);

        if (response.rows[0].create_user === true) {
            res.json({ success: true, message: "Dodano użytkownika pomyślnie" });
        } else {
            res.json({ success: false, message: "Błąd podczas rejestracji użytkownika" });
        }

        client.release();  
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
        res.redirect('/login');
    });
});








app.post("/changeKnown", async (req, res) => {
    // Sprawdzenie, czy przekazano wordId w danych
    if (!req.body.wordId) {
        return res.status(400).json({ success: false, message: "Brak wordId w danych" });
    }

    try {
        const client = await pool.connect();
        const query = 'SELECT toggle_known_status($1, $2)';
        const values = [req.session.user.userid,req.body.wordId];
        
        console.log(values)
        const response = await client.query(query, values);
        console.log(response)
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
        return res.status(401).json({ success: false, message: "Brak autoryzacji" });
    }

    const { from, to } = req.body; 

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
    try{
        const client = await pool.connect();
        const query = "select * from learn_ai_topics"
        const response = await client.query(query);
        res.json({data:response.rows})

        client.release(); 
    } catch(err){
        console.log(err)
    }
})




app.get('/getuserdatas', async (req, res) => {
    if (!req.session.user || !req.session.user.userid) {
        return res.status(401).json({ success: false, message: "Brak autoryzacji" });
    }

    try {
        const client = await pool.connect();
        const query = "SELECT points, userlevel FROM Learn_ai_points WHERE userid = $1";
        const values = [req.session.user.userid];

        console.log("Wykonane zapytanie:", query);
        console.log("Wartości:", values);

        const response = await client.query(query, values);

        if (response.rows.length > 0) {
            const { point, userlevel } = response.rows[0]; 
            console.log(point,userlevel,"ksksksk")
            res.json({ point, level: userlevel });
        } else {
            res.status(404).json({ success: false, message: "No data found for user." });
        }

        client.release(); 
    } catch (err) {
        console.error("Error during query:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});




app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});


