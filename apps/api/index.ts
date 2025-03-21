import express from "express";
import {authMiddleware} from "./middleware.ts";
import {prismaClient} from "db/client";
import cors from "cors"

const app = express();

app.use(cors());

app.use(express.json());

app.post("/api/v1/website",authMiddleware,async (req, res) => {
    const userId = req.userId!;
    const  { websiteurl }   = req.body;



    if(!userId || !websiteurl){
        res.status(403).send("Not logged in!");
    }

    const data = await prismaClient.website.create({
        data : {
            userId,
            url : websiteurl
        }
    })

    res.status(200).json({
        status: "success",
      id: data.id,
    });


})

app.get("/api/v1/website/status",authMiddleware,async (req, res) => {
    const websiteId  = req.params.websiteId;
    const userId = req.userId!;

    const data = await prismaClient.website.findFirst({
        where: {
            id : websiteId,
            userId,
            disabled : false
        },
        include : {
            websiteTick : true,
        }
    })

    res.status(200).json({
        status: "success",
        data: data
    })
})


app.get("/api/v1/websites",authMiddleware,async (req, res) => {
    const userId = req.userId!;


   const websites = await prismaClient.website.findMany({
       where: {
           userId,
           disabled : false
       },
       include : {
           websiteTick : true,
       }
   })

    res.status(200).json({
        status: "success",
        data: websites
    })
})

app.delete("/api/v1/websites",authMiddleware,async (req, res) => {
    const websiteId = req.body.websiteId;
    const userId = req.userId!;

    await prismaClient.website.update({
        where : {
            id : websiteId,
            userId
        },
        data : {
            disabled : true
        }
    })

    res.status(200).json({
        status: "success",
        data: "Deleted the website"
    })


})

app.listen(8000, () => {
    console.log("App listening on port 3000");
})