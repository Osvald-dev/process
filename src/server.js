import express from "express";
import mongoStore from 'connect-mongo';
import {product, cart, router} from './routes/index.js';
import session from 'express-session';
import {engine} from 'express-handlebars';
import path from 'path';
import {fileURLToPath} from 'url';
//import { Strategy } from "passport-facebook";
//import passport from "passport";
import minimist from 'minimist';


// const PORT = 3027;
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// passport.use(new Strategy({
//     clientID: process.env.FACEBOOK_ID,
//     clientSecret: process.env.FACEBOOK_SECRET,
//     callbackURL: '/auth/facebook/callback',
//     profileFields: ['id', 'displayName', 'photos'],
//     scope: ['email']
// },
// (accessToken, refreshToken, userProfile, done)=>{
//     return done(null, userProfile);
// }))


// passport.serializeUser((user, done)=>{
//     done(null, user.id)
// })
// passport.deserializeUser((id, done)=>{
//     done(null, id)
// })



app.use(express.static('public'));

app.set('views', './src/views');
app.set('view engine', 'hbs');

app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials'
}))

app.use(
    session({
        store: mongoStore.create({
            mongoUrl: process.env.MONGO_URI,
            options: {
                userNewParser: true,
                useUnifiedTopology: true,
            }
        }),
        secret: process.env.SECRET,
        resave: true,
        saveUninitialized: true,
        cookie: {maxAge: 600000} //10 min.
        
}))



app.use('/api/productos', product);
app.use('/api/carrito', cart);
//app.use('/api/usuario', user);
app.use('/test', router);


//** Session con Facebook */

// app.use(passport.initialize());
// app.use(passport.session());

// app.get('/fb-login', async (req, res)=>{
//     res.render('pages/fb')
// })



// app.get('/auth/facebook', passport.authenticate('facebook'))
// app.get('/auth/facebook/callback', passport.authenticate('facebook', {
//     successRedirect: '/',
//     failureRedirect:'/failLogin'
// }))

// app.get('/', (req, res)=>{
//     if(req.isAuthenticated()){
//         res.render('pages/home', {status: true})

//     }else{
//         res.render('pages/home', {status:false})
//     }
// })

// app.get('/fb-logout', (req, res)=>{
//     req.logout();
//     res.redirect('/api/usuario');
// })


/* --------------- Leer el puerto por consola o setear default -------------- */

const options = {
    alias:{
        "p": "PORT"
    },
    default: {
        "PORT": 8080
    }
};

const {PORT} = minimist(process.argv.slice(2), options);


const server = app.listen(PORT, () => {
    console.log(` >>>>> 🚀 Server iniciado : http://localhost:${PORT}`)
    })
    
server.on('error', (err) => console.log(err));

