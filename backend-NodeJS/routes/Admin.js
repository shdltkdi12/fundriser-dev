const express = require('express');
const admin = express.Router();
const cors = require('cors');
const mysql = require('mysql');
const crypto = require('crypto');
const async = require('async');
const jwt = require('jsonwebtoken');
const moment = require('moment');
admin.use(cors());
const pool = require('../database/db');

process.env.SECRET_KEY = 'secret';

admin.get('/userdata', (req,res)=> {
    try {
        var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    }
    catch(err) {
        res.sendStatus(401);
    }
    async.parallel([
        function(callback) {
            let sql = "SELECT ROUND(SUM(donation_without_fee),2) as total_donations_amount, COUNT(donation_without_fee) as total_num_donations FROM DONATIONS WHERE isRecurring=0";
            let query = mysql.format(sql);
            pool.query(query, function(err, result) {
                callback(err,JSON.parse(JSON.stringify(result).replace(/]|[[]/g, '')));
            });
        },
        function(callback) {
            let sql = "SELECT ROUND(SUM(donation_without_fee),2) as total_recurring_amount, COUNT(donation_without_fee) as total_num_recurring FROM DONATIONS WHERE isRecurring=1";
            let query = mysql.format(sql);
            pool.query(query, function(err, result) {
                callback(err,JSON.parse(JSON.stringify(result).replace(/]|[[]/g, '')));
            });
        },
        function(callback) {
            let sql = "SELECT UNIX_TIMESTAMP(timestamp)*1000 as time, ROUND(donation_without_fee) as y1, ROUND(fee) as y2 FROM DONATIONS";
            let query = mysql.format(sql);
            pool.query(query, function(err, result) {
                callback(err, result);
            });
        }
    ], function(err, results) {
        if(err) res.send(err);
        res.send(results);
    })
});

admin.get('/supporters', (req,res)=> {
    try {
        var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    }
    catch(err) {
        res.sendStatus(401);
    }
    let sql = "SET @cnt=0;SELECT (@cnt:=@cnt+1) as row_num, fullname, email, total_donations, DONATIONS.isRecurring as status, date_format(first_donation, '%Y-%m-%d %h:%m') as createdAt,date_format(last_donation, '%Y-%m-%d %h:%m') as updatedAt, total_donations from SUPPORTERS, DONATIONS WHERE SUPPORTERS.fullname = DONATIONS.supporter_fullname ORDER BY last_donation DESC";
    let query = mysql.format(sql);
    pool.query(query, function(err,result) {
        if(err) res.send(err);
        res.send(result[1]);
    });
});

admin.get('/donations', (req,res)=> {
    try {
        var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    }
    catch(err) {
        res.sendStatus(401);
    }
    let sql = "SET @cnt=0;SELECT (@cnt:=@cnt+1) as row_num, date_format(timestamp, '%M %d,%Y, %h:%m %p') as date, donation_without_fee as amount, isRecurring, FLOOR(RAND() * (4-1+1)+1) as num_recurring, isFeeCovered, supporter_fullname as name, U.campaignName as campaign_name from DONATIONS AS D, USERS AS U WHERE D.campaignID=U.email ORDER BY timestamp DESC";
    let query = mysql.format(sql);
    pool.query(query, function(err,result) {
        if(err) res.send(err);
        res.send(result[1]);
    });
});
module.exports = admin;