//export const routes: Map<string, string> = new Map()
//export const actions: Map<string, Function> = new Map()
//require('../config/routes.js')
import express from 'express'
const cookies = require('cookie-parser')
import { Ratelimit } from './ratelimit'
import got from 'got'
import url from 'url'
import path from 'path'
import { v4 as uuid } from 'uuid'
import firebase from 'firebase'
//@ts-ignore
import * as config from '../config/auth.json'
firebase.initializeApp(config.firebase)
const db = firebase.firestore()
const ratelimits: Map<string, Ratelimit> = new Map()
const codes: Map<string, string> = new Map()
let permits: Array<string> = []

const genericRoutes = ["gc", "gc-spotify", "gc-handle"]

const genericHTML = (name: string) => {
    app.get('/' + name, async (req, res) => {
        if (permit(req, res)) {
            res.sendFile('./public/' + name.replace("-", "_") + ".html", { root: "./app/" })
        }
    })
}

setInterval(async () => {
    ratelimits.forEach((k, v) => {
        if (Date.now() - k.getMs >= 60000) {
            ratelimits.delete(v)
        }
    })
}, 1000)

const removeArr = <T>(arr: Array<T>, item: T): Array<T> => {
    return arr.filter(i => i != item)
}

const permit = (req: any, res: any): boolean => {
    /*if (req.connection.remoteAddress) {
        if (!req.url.endsWith(".css") && !req.url.endsWith(".ico")) {
            if (!ratelimits.has(req.connection.remoteAddress)) {
                ratelimits.set(req.connection.remoteAddress, new Ratelimit(1, Date.now()))
                return true
            } else {
                //@ts-ignore
                if (ratelimits.get(req.connection.remoteAddress).getCount == 4 && !permits.includes(req.connection.remoteAddress)) {
                    res.redirect(config.base_url + "/ratelimit")
                    return false
                } else {
                    if (!permits.includes(req.connection.remoteAddress)) {
                        ratelimits.get(req.connection.remoteAddress)?.add()
                    } else {
                        permits = removeArr(permits, req.connection.remoteAddress)
                    }
                    return true
                }
            }
        } else {
            return true
        }
    } else {
        res.sendFile("./public/badcon.html", { root: "./app/" })
        return false
    }*/
    return true
}

const redirect = (res: any, req: any, uri: string) => {
    permits.push(req.connection.remoteAddress)
    res.redirect(uri)
}

const app = express()

app.use(express.static("./app/public/"))
app.use((req, res, next) => {
    console.log(`Connecting ${req.connection.remoteAddress} to ${req.url}`)
    next()
})
app.get('/summary', async (req, res) => {
    if (permit(req, res)) {
        res.sendFile("./public/summary.html", { root: "./app/" })
    }
})
app.get('/', async (req, res) => {
    if (permit(req, res)) {
        res.sendFile("./public/home.html", { root: "./app/" })
    }
})
app.get('/create-summary', async (req, res) => {
    if (permit(req, res)) {
        if (req.connection.remoteAddress) {
            //@ts-ignore
            const urlp = url.parse(req.url, true).query
            const uid = uuid()
            await db.collection('summaries').add({
                uuid: uid,
                gay: pbool(urlp.gay),
                name: urlp.name,
                percent: Number(urlp.percent),
                age: firebase.firestore.Timestamp.fromDate(new Date())
            })
            redirect(res, req, config.base_url + "/summary?uuid=" + uid)
        } else {
            redirect(res, req, config.base_url + "/ratelimit")
        }
    }
})
const scopes = "user-read-private user-read-email"
app.get('/authorize-spotify', async (req, res) => {
    if (permit(req, res)) {
        redirect(res, req, 'https://accounts.spotify.com/authorize'
            + "?response_type=code"
            + "&client_id=" + config.client_id
            + (scopes ? '&scope=' + encodeURIComponent(scopes) : '')
            + '&redirect_uri=' + encodeURIComponent('https://notjacob-dev.github.io/gc-spotify-authorized'))
    }
})
app.get('/gc-spotify-authorized', async (req, res) => {
    if (permit(req, res)) {
        const urlp = url.parse(req.url, true).query
        //@ts-ignore
        codes.set(req.connection.remoteAddress, urlp.code)
        got.post("https://accounts.spotify.com/api/token")
    }
})
genericRoutes.forEach(r => {
    genericHTML(r)
})
app.get("/ratelimit", (req, res) => {
    res.status(429)
    res.sendFile("./public/ratelimit.html", { root: "./app/" })
})
app.get("*", (req, res) => {
    res.status(404)
    res.sendFile("./public/404.html", { root: "./app/" })
})
app.listen(3000, "0.0.0.0")

const pbool = (str: string | string[] | undefined ): boolean => {
    //@ts-ignore
    if (str.toLowerCase() == "true") {
        return true
    }
    return false
    // Boolean() doesn't work????
}
/*const urlp = url.parse(req.url, true).query
const doc = await db.collection('summaries').where("uuid", "==", urlp.uuid).get()
if (doc.size > 0) {
    const data = doc.docs[0]
}*/