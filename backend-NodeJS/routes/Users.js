const express = require('express');
const users = express.Router();
const cors = require('cors');
const mysql = require('mysql');
const crypto = require('crypto');
const async = require('async');
const jwt = require('jsonwebtoken');
const moment = require('moment');
users.use(cors());
const pool = require('../database/db');

process.env.SECRET_KEY = 'secret';

users.post('/savedonation', (req,res) => {
    let data= req.body;
    donation = JSON.parse(req.body.donation);
    donor = JSON.parse(req.body.donor);
    const time = moment(Date.now()).format('YYYY-MM-DDTHH:mm:ss');
    async.parallel([
        function(callback) {
            let sql = 'CALL addoreditsupporter(?,?,?,?,?,?)';
            let inserts = [donor.fullname, donor.email, time, time, donation.amount, donation.campaignID];
            let query = mysql.format(sql, inserts);
            pool.query(query, function(err, result) {
                callback(err,result);
            });
        },
        function(callback) {
            let sql = "CALL adddonation(?,?,?,?,?,?,?,?)";
            let inserts = [donation.amount, donation.fee, time, donor.fullname, donation.payment_method, donation.isRecurring, donation.isFeeCovered, donation.campaignID];
            let query = mysql.format(sql, inserts);
            pool.query(query, function(err, result) {
                callback(err,result);
            });
        }
    ], function(err, results) {
        if(err) res.send(err);
        res.send({msg:'ok'});
    });
})
users.post('/change', (req,res) => {
    try {
        var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    }
    catch(err) {
        res.sendStatus(401);
    }
    let data = req.body;
    let sql = "UPDATE USERS SET campaignName = ?, userName = ? WHERE email = ?";
    let inserts = [data.campaignName,data.userName, data.email];
    let query = mysql.format(sql,inserts);
    pool.query(query, function(err, query_result) {
        if(err) {
            return res.send({err: "Already taken"});
        }
        res.json({msg: "ok"});
    })
})
users.post('/register', (req,res)=> {
    let data = req.body;
    let sql = "INSERT INTO USERS(email, password) VALUES (?,?)";
    let inserts = [data.email,crypto.createHash('sha256').update(data.password).digest('hex')];
    let query = mysql.format(sql, inserts);
    pool.query(query, function(err,query_result) {
        if(err) {
            return res.sendStatus(409);
        }
        res.json({msg: "ok"});
    });
});

users.post('/login', (req,res)=> {
    let data = req.body;
    let sql = "SELECT email, campaignName, userName FROM USERS WHERE email=? AND password=?";
    let inserts = [data.email, crypto.createHash('sha256').update(data.password).digest('hex')];
    let query = mysql.format(sql, inserts);
    pool.query(query, function(err, query_result) {
        if(query_result.length === 0) {
            return res.sendStatus(400);
        }
        query_result = JSON.parse(JSON.stringify(query_result).replace(/]|[[]/g, ''));
        let token = jwt.sign(query_result, process.env.SECRET_KEY, {expiresIn: 60*60});
        res.json({token: token});
    });
});

users.get('/userdata', (req,res)=> {
    try {
        var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    }
    catch(err) {
        res.sendStatus(401);
    }
    async.parallel([
        function(callback) {
            let sql = "SELECT ROUND(SUM(donation_without_fee),2) as total_donations_amount, COUNT(donation_without_fee) as total_num_donations FROM DONATIONS WHERE campaignID=? AND isRecurring=0";
            let inserts = decoded.email;
            let query = mysql.format(sql, inserts);
            pool.query(query, function(err, result) {
                callback(err,JSON.parse(JSON.stringify(result).replace(/]|[[]/g, '')));
            });
        },
        function(callback) {
            let sql = "SELECT ROUND(SUM(donation_without_fee),2) as total_recurring_amount, COUNT(donation_without_fee) as total_num_recurring FROM DONATIONS WHERE campaignID=? AND isRecurring=1";
            let inserts = decoded.email;
            let query = mysql.format(sql, inserts);
            pool.query(query, function(err, result) {
                callback(err,JSON.parse(JSON.stringify(result).replace(/]|[[]/g, '')));
            });
        },
        function(callback) {
            let sql = "SELECT UNIX_TIMESTAMP(timestamp)*1000 as time, ROUND(donation_without_fee) as y1, ROUND(fee) as y2 FROM DONATIONS WHERE campaignID = ?";
            let inserts = decoded.email;
            let query = mysql.format(sql, inserts);
            pool.query(query, function(err, result) {
                callback(err, result);
            });
        }
    ], function(err, results) {
        if(err) res.send(err);
        res.send(results);
    })
});

users.get('/supporters', (req,res)=> {
    try {
        var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    }
    catch(err) {
        res.sendStatus(401);
    }
    let sql = "SET @cnt=0;SELECT (@cnt:=@cnt+1) as row_num, fullname, email, total_donations, DONATIONS.isRecurring as status, date_format(first_donation, '%Y-%m-%d %h:%m') as createdAt,date_format(last_donation, '%Y-%m-%d %h:%m') as updatedAt, total_donations from SUPPORTERS, DONATIONS WHERE SUPPORTERS.fullname = DONATIONS.supporter_fullname and DONATIONS.campaignID = ? ORDER BY last_donation DESC";
    let inserts = decoded.email;
    let query = mysql.format(sql, inserts);
    pool.query(query, function(err,result) {
        if(err) res.send(err);
        res.send(result[1]);
    });
});

users.get('/donations', (req,res)=> {
    try {
        var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    }
    catch(err) {
        res.sendStatus(401);
    }
    let sql = "SET @cnt=0;SELECT (@cnt:=@cnt+1) as row_num, date_format(timestamp, '%M %d,%Y, %h:%m %p') as date, donation_without_fee as amount, isRecurring, FLOOR(RAND() * (4-1+1)+1) as num_recurring, isFeeCovered, supporter_fullname as name, U.campaignName as campaign_name from DONATIONS AS D, USERS AS U WHERE U.email = ? AND D.campaignID = ? ORDER BY timestamp DESC";
    let inserts = [decoded.email, decoded.email];
    let query = mysql.format(sql, inserts);
    pool.query(query, function(err,result) {
        if(err) res.send(err);
        res.send(result[1]);
    });
});

module.exports = users;