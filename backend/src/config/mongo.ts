import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

export const DBconnect = (): void => {
    const { DATABASE, DATABASE_PASSWORD } = process.env
    if (DATABASE === undefined || DATABASE_PASSWORD === undefined) {
        throw new Error('DATABASE environment variable(s) not set')
    }

    const dbConnectionString = DATABASE.replace('<PASSWORD>', DATABASE_PASSWORD)

    void mongoose.connect(dbConnectionString)

    mongoose.connection
        .on('open', () => {
            console.log('connected to mongo')
        })
        .on('close', () => {
            console.log('disconnected from mongo')
        })
        .on('error', (error) => {
            console.log('connection failed', error)
        })
}
