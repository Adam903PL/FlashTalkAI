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
  
  
app.get('/api/test', (req, res) => {
    const files = getFlashcardFiles(path.join(__dirname, 'test'));
    res.json(files);
});




app.get('/api/flashcards', (req, res) => {
    const files = getFlashcardFiles(path.join(__dirname, 'flashcards'));
    res.json(files);
});

function generateFlashcardEndpoints(directory = './flashcards') {
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



generateFlashcardEndpoints(path.join(__dirname, 'flashcards'));
generateFlashcardEndpoints(path.join(__dirname, 'test'));
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
        
        console.log(databseResp)
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
    console.log(datas)
    try {
        const client = await pool.connect();
        const query = 'SELECT create_user($1, $2, $3, $4)';
        const values = [datas.email, datas.password,'USA California',true];
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
