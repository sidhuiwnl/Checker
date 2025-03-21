import {prismaClient} from "../index.ts";

const USER_ID = "4";


async function seed(){
    await prismaClient.user.create({
       data : {
           id : USER_ID,
           firstName : "sidhartbabu",
           lastName : "babu"
       }
    })

    const website = await prismaClient.website.create({
        data : {
            url : "https://googl.com",
            userId : USER_ID
        }
    })

    const validator = await prismaClient.validator.create({
        data: {
            publickey: "0x12341223123",
            location: "Delhi",
            ip: "127.0.0.1",
        }
    })

    await prismaClient.websiteTicksTable.create({
        data : {
            createdAt : new Date(),
            websiteId : website.id,
            status : "GOOD",
            latency : 100,
            validatorId : validator.id
        }
    })
    await prismaClient.websiteTicksTable.create({
        data: {
            websiteId: website.id,
            status: "GOOD",
            createdAt: new Date(Date.now() - 1000 * 60 *10),
            latency: 100,
            validatorId: validator.id
        }
    })
    await prismaClient.websiteTicksTable.create({
        data: {
            websiteId: website.id,
            status: "BAD",
            createdAt: new Date(Date.now() - 1000 * 60 * 20),
            latency: 100,
            validatorId: validator.id
        }
    })

}


seed();