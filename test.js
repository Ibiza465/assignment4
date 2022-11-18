const Bcrypt = require("bcryptjs");
const express = require("express");
const exphbs = require('express-handlebars');
const bodyParser = require("body-parser");
const port = 8080;
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'hbs');

const mongoose = require('mongoose');
const register = mongoose.createConnection("mongodb+srv://shankarthapa:Mongodb123@senecaweb.azk37kn.mongodb.net/web322_week8?retryWrites=true&w=majority");

const registerSchema = new mongoose.Schema({
    "First_name": String,
    "Last_name": String,
    "password": String,
    "username": {
        "type": String,
        "unique": true
    },
    "Email": {
        "type": String,
        "unique": true
    },
    "admin": {
        "type": Boolean,
        "default": false
    },
    "Ph_no": Number,
    "C_code": Number,
    "Nation": String,
    "S_address": String,
    "Zip": String,
    "City": String
});

const registers = register.model("registers", registerSchema);


const alph_check = (string) => {

    let regex = /[`~!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?" "]+/;

    if (regex.test(string)) {
        return true;
    }
    else {
        return false;
    }
}

const con_check = (string) => {

    let regex = /[a-zA-Z]{2,}/;

    if (regex.test(string)) {
        return true;
    }
    else {
        return false;
    }
}

const address_check = (string) => {

    let regex = /^\d+\s[A-z]+\s[A-z]+/;

    if (regex.test(string)) {
        return true;
    }
    else {
        return false;
    }
}

const city_check = (string) => {

    let regex = /^[a-zA-Z\u0080-\u024F]+(?:([\ \-\']|(\.\ ))[a-zA-Z\u0080-\u024F]+)*$/;

    if (regex.test(string)) {
        return true;
    }
    else {
        return false;
    }
}


const zip_check = (string) => {

    let regex = /^((\d{5}-\d{4})|(\d{5})|([A-Z]\d[A-Z]\s\d[A-Z]\d))$/;

    if (regex.test(string)) {
        return true;
    }
    else {
        return false;
    }
}




const cc_check = (numbers) => {

    let regex = /^\+(\d{1}\-)?(\d{1,3})$/;

    if (regex.test(numbers)) {
        return true;
    }
    else {
        return false;
    }
}

const ph_check = (numbers) => {

    let regex = /^[0-9]+$/;

    if (regex.test(numbers)) {
        return true;
    }
    else {
        return false;
    }
}

const pw_check = (string) => {
    let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (regex.test(string)) {
        return true;
    }
    else {
        return false;
    }
}


const email_check = (Email) => {

    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (regex.test(Email)) {
        return true;
    }
    else {
        return false;
    }
};

exports.alph_check = alph_check;
exports.ph_check = ph_check;
exports.pw_check = pw_check;
exports.email_check = email_check;
exports.cc_check = cc_check;
exports.con_check = con_check;
exports.address_check = address_check;
exports.zip_check = zip_check;
exports.city_check = city_check;






app.engine('hbs', exphbs.engine({
    extname: 'hbs',
    layoutsDir: __dirname + "/views/layouts",
    defaultLayout: 'index'
}))

app.get("/", (req, res) => {
    res.render('blog')
});

app.get("/blog", (req, res) => {
    res.render('blog')
});

app.get("/login", (req, res) => {
    res.render('login')
});

app.post("/login", async function (req, res) {
    var username = req.body.name_l;
    var password = req.body.pwd_l;

    if (username && password) {

        if (alph_check(username)) {
            var userErrorMsg = "Your Username can't have special characters or spaces!";
            res.render('login', { UserErrorMsg: userErrorMsg, UserName: username, Password: password });
        }
        else {
            const logdata = await registers.findOne({ "username": username });
            if (logdata) {
                if (Bcrypt.compareSync(password, logdata.password)) {
                    if (logdata.admin === true) {
                        res.render('admin_dashboard', { UserName: username, Name: (logdata.First_name + " " + logdata.Last_name), email: logdata.Email })
                    } else {
                        res.render('dashboard', { UserName: username, Name: (logdata.First_name + " " + logdata.Last_name), email: logdata.Email });
                    }
                }
            }
            else {
                var ErrorMsg = "Incorrect username or password!";
                res.render('login', { ErrorMsg: ErrorMsg, UserName: username, Password: password });
            }
        }
    }
    else if (!username && !password) {
        var ErrorMsg = "Please enter your username and password!";
        res.render('login', { ErrorMsg: ErrorMsg });
    }

    else {
        if (!username) {
            var userErrorMsg = "Please enter your username!";
            res.render('login', { UserErrorMsg: userErrorMsg, Password: password });
        }

        if (!password) {
            var pwdErrorMsg = "Please enter your password!";
            res.render('login', { PwdErrorMsg: pwdErrorMsg, UserName: username });
        }

    }
});


app.get("/article", (req, res) => {
    res.render('read_more')
});

app.get("/register", (req, res) => {
    res.render('register')
});

app.post("/register", async (req, res) =>{
    var First_name = req.body.f_name;
    var Last_name = req.body.l_name;
    var password = req.body.pw_r;
    var username = req.body.uname_r;
    var Email = req.body.email_r;
    var Ph_no = req.body.phNo_r;
    var C_code = req.body.c_code;
    var Nation = req.body.nation;
    var S_address = req.body.s_address;
    var Zip = req.body.zip;
    var City = req.body.city;


    var nameError;
    var u_nameError;
    var pwError;
    var emailError;
    var phoneError;
    var ccError;
    var natError;
    var saError;
    var zipError;
    var cityError;



    var registerData = {
        First_name: First_name,
        Last_name: Last_name,
        password: password,
        username: username,
        Email: Email,
        Ph_no: Ph_no,
        C_code: C_code,
        Nation: Nation,
        S_address: S_address,
        Zip: Zip,
        City: City
    }



    var NullError;
    var keys = Object.keys(registerData);


    keys.forEach(key => {
        var value = registerData[key];
        if (!value) {
            NullError = "Please fill all the fields";
        }

    })

    keys.forEach(key => {
        var value = registerData[key];
        switch (key) {
            case 'First_name', 'Last_name':
                if (alph_check(value)) {
                    nameError = "No special characters allowed";
                }
                break;

            case 'username':
                if (alph_check(value)) {
                    u_nameError = "No special characters or spaces allowed";
                }
                break;

            case 'Email':
                if (!(email_check(value))) {
                    emailError = "Invalid email";
                }
                break;

            case 'Ph_no':
                if (!ph_check(value)) {
                    phoneError = "Phone number can not have anything but numbers!";
                }
                break;

            case 'password':
                if (!pw_check(value)) {
                    pwError = "Password must contain atleast one of each: Uppercase letter, Lowercase letter, Number and a Special Character";
                }
                break;

            case 'Zip':
                if (!zip_check(value)) {
                    zipError = "Invalid Zip Code(ANA NAN where A-> capital alphabet & N-> number)";
                }
                break;


            case 'C_code':
                if (!cc_check(value)) {
                    ccError = "Invalid Country Code";
                }
                break;

            case 'Nation':
                if (!con_check(value)) {
                    natError = "Invalid Country Name";
                }
                break;

            case 'City':
                if (!city_check(value)) {
                    cityError = "Please Enter a valid city name";
                }
                break;

            case 'S_address':
                if (!address_check(value)) {
                    saError = "Invalid street address (ex: 19 southlawn dr)";
                }
                break;


        }
    })
    const un = registers.findOne({ "username": username });
    const un_ex = await un.exec();
    if (un_ex) {
        u_nameError = "This username is not available";
    }

    const em = registers.findOne({ "Email": Email });
    const em_ex = await em.exec();
    if (em_ex) {
        emailError = "Invalid email or email is already used";
    }

    var Errors = {
        nameError: nameError,
        u_nameError: u_nameError,
        emailError: emailError,
        phoneError: phoneError,
        pwError: pwError,
        ccError: ccError,
        natError: natError,
        saError: saError,
        zipError: zipError,
        cityError: cityError
    }
    let falses = 0;
    Object.keys(Errors).forEach(key => {
        if (Errors[key]) {
            falses = falses + 1;
        }
    })
    if (falses > 0) {

        res.render('register', { RegData: registerData, Errors: Errors, NullError });
    } else {
        registerData.password = Bcrypt.hashSync(password, 12);

        let userRegister = new registers(registerData).save((e, data) => {
            if (e) {
                console.log(e);
            } else {
                console.log("User Registered:\n\t" + data);
                res.render('dashboard', { UserName: username, Name: (data.First_name + " " + data.Last_name), email: data.Email });
            }
        })
    }

});


app.listen(port, () => {
    console.log(`LISTENING ON http://localhost:${port}`);
});