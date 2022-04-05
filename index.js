import express from 'express'
import aws from "aws-sdk"
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const app = express()
const port = process.env.PORT || 9999

app.use(cors())

const region = process.env.AWS_REGION
const bucketName = process.env.BUCKET_NAME
const accessKeyId = process.env.ACCESS_KEY_ID
const secretAccessKey = process.env.SECRET_ACCESS_KEY

const s3 = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: 'v4'
})

async function generateUploadUrl() {
    const imageName = Date.now().toString()
    const params = ({
        Bucket: bucketName,
        Key: imageName,
    })

    return await s3.getSignedUrlPromise('putObject', params)
}

app.get('/', async (req, res) => {
    const url = await generateUploadUrl()
    res.send({ url })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})