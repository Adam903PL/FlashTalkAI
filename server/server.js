const express = require("express");
const app = express();
const PORT = process.env.PORT || 4444;
const path = require("path");
const CryptoJS = require("crypto-js");
const {Client} = require('pg');
const session = require('express-session'); 




const client = new Client({
    user:'flashtalkai_user',
    host:'dpg-csn4nc0gph6c73ft3neg-a.frankfurt-postgres.render.com',
    database:'flashtalkai',
    password:'HgFSozb5BSqc6EZDDau4uJy0gLV9uPTU',
    port:5432,
    ssl:{
        rejectUnauthorizedL:false
    }
});

(async () => {

    app.use(session({
        secret:"secret-key",
        resave:false,
        saveUninitialized:false
    }))


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
        res.json(datas);
        try{
            client.connect()
            const query = 'SELECT check_user_credentials($1, $2)';
            const values = [datas.email, datas.password];
            const response = await client.query(query, values)
            const databseResp = response.rows[0]?.check_user_credentials;
            if(databseResp !=null){
                if(req.session){
                    req.session.destroy()
                }
                req.session.user={
                    userid:databseResp,
                    role:'user'
                }
                req.session.save((err) => {
                    if (err) {
                        console.error("Błąd podczas zapisywania sesji:", err);
                        return res.status(500).json({ success: false, message: "Błąd serwera" });
                    }
                    res.json({ success: true, message: "Zalogowano pomyślnie" });
                });
            }
            
        }catch(err){
            console.log("Error during conection to databse:",err)
        }
    

    });

    app.get("/loginsucces", (req,res)=>{
        console.log(req.session.user.userid,"tooto")
        if (req.session.user && req.session.user.userid) {
            res.json({success: true, message: "Zalogowano pomyślnie", user: ""+req.session.user });
        }else{
            res.json({succes: false,message:"Błąd podczas logowania"})
        }
    })

    app.get("/logout",(req,res)=>{
        res.json({message:"Wylogowano"})
        req.session.destroy()
    })

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../dist', 'index.html'));
    });
    app.listen(PORT, () => {
        console.log(`Server started on http://localhost:${PORT}`);
    });
})();
