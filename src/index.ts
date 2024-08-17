import express from 'express'
import authRoute from "./routes/authRoute";
import authorize from "./middlewares/authMiddleware";
import cookieParser from 'cookie-parser'
import cors from 'cors'
import {startup} from "./utils/startup";





startup()
const app = express();

app.use(cors({
    origin: true,
    credentials: true,
}))
app.use(cookieParser());
app.use(express.json({ limit: '25mb' }));
// app.use(authorize);
app.use(express.static('src/public/'))

app.get('/backend-status', (req,res)=>{
    res.send('STATUS:RUNNING')
})

app.use('/auth', authRoute);


app.listen(process.env.PORT || 8080,
    () => {
        console.log(`[INFO] Server started on http://localhost:${process.env.PORT}`);
    }
);

