const { render } = require('ejs');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const request = require('request');
const Person = require('./models/person');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views')))

const dbURI = 'mongodb://naisenshi:naisenshi@cluster0-shard-00-00.lxeus.mongodb.net:27017,cluster0-shard-00-01.lxeus.mongodb.net:27017,cluster0-shard-00-02.lxeus.mongodb.net:27017/mongodb?ssl=true&replicaSet=atlas-76ykff-shard-0&authSource=admin&retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));


console.dir(
    app.locals.date
)
console.dir(
    app.locals.nationality
) 
console.dir(
    app.locals.detect
)

app.set('view engine' , 'ejs')


function timezoneformat(objects){
    var timeFormat = {
        hour: 'numeric',
        minute: 'numeric', 
        second: 'numeric', 
        hour12: true, 
        timeZone: objects["timezone"]
    }
    
    var dateFormat = {
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        timeZone: objects["timezone"]
    }

    var dateTime = new Date(objects["datetime"])
    var time = new Intl.DateTimeFormat('en-US', timeFormat).format(dateTime)
    var date = new Intl.DateTimeFormat('en-US', dateFormat).format(dateTime)

    return [time, date];
}

function detectTimeZone (area) {
    if (area == "America/Los_Angeles"){
        nationality = 'American';   
        timezoneflag = 'america.png';
    }
    else if(area == "Asia/Singapore"){
        nationality = 'Singaporean';
        timezoneflag = 'singapore.png';
    }
    else if(area == "Europe/Paris"){
        nationality = 'French';
        timezoneflag = 'paris.png';
    }
    else if(area == "Asia/Bangkok"){
        nationality = 'Thai';
        timezoneflag = 'thailand.png';
    }
    else if(area == "Asia/Dubai"){
        nationality = 'Arabic';
        timezoneflag = 'dubai.png';
    }
}

app.get('/', function(req,res){
    res.render("index", {title: 'Index'});
});

app.get('/listperson', (req, res) => {
    request('http://worldtimeapi.org/api/timezone/'+detect.location, function(error, response, body) {
        const input = JSON.parse(body)
        data = timezoneformat(input)
        detectTimeZone(detect.location)

        Person.find()
            .then((result) => {
                res.render('listperson', {title: 'Person List', time: data[0], date: data[1], person: result, flag: timezoneflag})
            }).catch((err) => {
                console.log(err);
            })
    })
    console.log(detect.location)
});

app.post('/listperson', (req, res) => {
    detect = req.body
    res.redirect('listperson')    
});

app.post('/append', (req, res) => {
    const person = new Person(req.body);
    console.log(req.body);

    person.save()
    .then((result) => {
        res.redirect('listperson');
    }).catch((err) => {
        console.log(err);
    })
});

app.get('/newperson', function(req,res){
    res.render("newperson", {title: 'Add New Person', nationality: nationality});
});

app.get('/viewperson/:id', (req, res) => {
    const id = req.params.id;
    Person.findById(id)
    .then(result => {
        console.log(result);
        res.render('viewperson', {title: 'View Person', person: result});
    }).catch(err => {
        console.log(err);
    })
});
app.post('/lookup', (req, res) => {
    res.render('viewperson');
});









      


