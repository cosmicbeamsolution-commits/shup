const path = require("path")
const bson = require('bson')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const moment = require('moment')
const tokenExpires = 86400 * 30 * 12 // 1 year
const saltRounds = 10
const emailHelper = require('../email/helper')
const emailClient = emailHelper()
const ObjectId = require('mongodb').ObjectId
const { exec } = require('child_process')
/* clock for checking online users */
/*
setInterval(() => {
  Object.keys(online).forEach(e => {
    Object.keys(online[e]).forEach(i => {
      if (moment(online[e][i]).isBefore(moment().subtract(1, 'minutes').format())) {
        delete online[e][i]
      }
      if (Object.keys(online[e]).length === 0) {
        delete online[e]
      }
    })
  })
}, 1000 * 60)
*/

module.exports = {
  saveEvent: (db, data, ip) => {
    const now = moment().format()
    let evtObject = {
      created: now
    }

    for (var i in data) {
      evtObject[i] = data[i]
    }
    evtObject.ip = ip

    exec(`./iplookup ${ip}`, (err, stdout, stderr) => {
    // exec(`./iplookup 181.209.106.242`, (err, stdout, stderr) => {
      if (err) {
        console.log(err)
      } else {
        const parts = stdout.split("\t")
        evtObject.geo = {
          country: parts[0].split(' ')[1],
          country_iso: parts[1],
          city: parts[2],
          region: parts[3],
          location: {
            lat: parts[4],
            lng: parts[5].replace('\n', '')
          }
        }
      }
      db.collection('shops').findOne({
        id: data.shop_name
      }, (err, shop) => {
        if (shop) {
          evtObject.shop = shop._id.toString()
        } else {
          console.log(`Error: Shop not found ${data.shop_name}`)
        }
        db.collection('events').findOneAndUpdate({
          shop: evtObject.shop
        },
        {
          "$push": { history: evtObject }
        },{ 
          upsert: true, 
          'new': true, 
          returnOriginal:false 
        })
      })
    })
  },
  online: (req, res) => {
    let count = 0
    if (online[req.params.shop]) {
      count = Object.keys(online[req.params.shop]).length
    }
    return res.json({ online: count })
  }
}

