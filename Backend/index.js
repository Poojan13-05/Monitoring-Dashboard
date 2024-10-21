const express = require("express")
const app=express()
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const authRoute = require("./routes/auth")
const orderRoute = require("./routes/order")
const menuitemRoute = require("./routes/menuitem")
const reservationRoute = require("./routes/reservation")
const cors=require('cors');
const client = require("prom-client");
const responseTime=require('response-time');


const collectDefaultMetrics=client.collectDefaultMetrics;

collectDefaultMetrics({ register: client.register });

app.get('/metrics',async(req,res)=>{
    res.setHeader("Content-Type",client.register.contentType);
    const metrics = await client.register.metrics();
    res.send(metrics)

});



const reqResTime = new client.Histogram({
    name: 'http_express_req_res_time',
    help: 'This tells how much time is taken ny req and res',
    labelNames: ["method","route","status_code"],
    buckets: [1, 50, 100, 100,200,400,500,800,1000]
  });
  const totalReqCounter=new client.Counter({
    name:'total_req',
    help:'Tells total req'
  })

  app.use(responseTime((req,res,time)=>{
    totalReqCounter.inc();
    reqResTime.labels({
        method: req.method,
        route: req.url,
        status_code: res.statusCode
    }).observe(time)

  }));

 

dotenv.config();
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(()=>{
    console.log("DB Connection Successfull")
})
.catch((err)=>{
    console.error("error connecting to mongoDB ",err)
})

//middlewares
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute)
app.use("/api/order", orderRoute)
app.use("/api/menuitem", menuitemRoute)
app.use("/api/reservation", reservationRoute)



app.listen(8800,()=>{
    console.log("Backend server is running!");
});