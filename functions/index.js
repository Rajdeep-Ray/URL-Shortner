const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const shortid = require('shortid');

admin.initializeApp()
const db = admin.firestore();

const app = express()

app.get('/:id', (req, res) => {
    db.collection('urls').doc(req.params.id).get()
    .then((doc)=>{
        // eslint-disable-next-line promise/always-return
        if (doc.exists) {
            res.status(301).redirect(doc.data().url)
        }
        else{
            res.status(404).send("URL Not Found at /")
        }
    })
    .catch((err)=>console.log(err))

})

app.post('/api', (req, res) => {
    var uid = shortid.generate()
    const myData = {
        shortid: uid,
        url: req.body.url
    }
    // eslint-disable-next-line promise/always-return
    db.collection('urls').doc(uid).set(myData).then(() => {
        res.json(myData);

    }).catch((err) => console.log(err))

})

exports.url_short = functions.https.onRequest(app);
