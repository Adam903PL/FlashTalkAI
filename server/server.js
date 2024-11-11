const express = require("express");
const app = express();
const PORT = process.env.PORT || 4444;
const path = require("path");
const CryptoJS = require("crypto-js");
const { Pool } = require('pg');
const session = require('express-session');

const pool = new Pool({
    user: 'flashtalkai_user',
    host: 'dpg-csn4nc0gph6c73ft3neg-a.frankfurt-postgres.render.com',
    database: 'flashtalkai',
    password: 'HgFSozb5BSqc6EZDDau4uJy0gLV9uPTU',
    port: 5432,
    ssl: {
        rejectUnauthorized: false
        
    }
});

app.use(session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 }  
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, "../dist")));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

app.post("/loginData", async (req, res) => {
    console.log("Otrzymano dane:", req.body);
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
            req.session.user = {
                userid: databseResp,
                role: 'user'
            };
            console.log(databseResp);
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

app.get("/loginsucces", (req, res) => {
    console.log(req.session.user ? req.session.user.userid : "Brak użytkownika w sesji");
    if (req.session.user && req.session.user.userid) {
        res.json({ success: true, message: "Zalogowano pomyślnie", user: req.session.user });
    } else {
        res.json({ success: false, message: "Błąd podczas logowania" });
    }
});


app.post("/registerData", async (req, res) => {
    console.log("Otrzymano dane:", req.body);
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
            console.log("Użytkownik dodany pomyślnie");
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

app.use("/login",(req,res,next)=>{
    if (req.session.user && req.session.user.userid) {
        return res.redirect('/home');
    } else {
        return next()
    }
})



app.use("/home",(req,res,next)=>{
    if (req.session.user && req.session.user.userid) {
        return next()
    } else {
        return res.redirect('/login');
    }
})

app.use("/home/flashcards",(req,res,next)=>{
    if (req.session.user && req.session.user.userid) {
        return next()
    } else {
        return res.redirect('/login');
    }
})








app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
