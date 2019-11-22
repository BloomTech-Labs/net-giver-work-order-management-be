import "dotenv/config"
import cors from "cors"
import morgan from "morgan"
import http from "http"
import jwt from "jsonwebtoken"
import DataLoader from "dataloader"
import { ApolloError } from "apollo-server"
import { ApolloServer, AuthenticationError } from "apollo-server-express"
import schema from "./schema"
import resolvers from "./resolvers"
import models, { sequelize } from "./models"
import loaders from "./loaders"
import express from "express"
const app = express()

app.use(cors())

app.use(morgan("dev"))

const getUser = token => {
    try {
        if (token) {
            return jwt.verify(token, process.env.SECRET)
        }
        // return null;
    } catch (err) {
        // throw new AuthenticationError("Your session expired. Sign in again.");
        return new ApolloError("Your token expired. Sign in again.")
        // return null;
    }
}

const server = new ApolloServer({
    introspection: true,
    playground: true,
    typeDefs: schema,
    resolvers,
    formatError: error => {
        const message = error.message.replace("SequelizeValidationError: ", "")
        if (message.startsWith("Database Error: ")) {
            return new Error("Internal server error")
        }

        return {
            ...error,
            message,
        }
    },
    context: ({ req, connection }) => {
        if (connection) {
            return {
                models,
                loaders: {
                    user: new DataLoader(keys =>
                        loaders.user.batchUsers(keys, models)
                    ),
                },
            }
        }

        if (req) {
            const token = req.headers["x-token"]
            const user = getUser(token)
            return {
                models,
                user,
                secret: process.env.SECRET,
            }
        }
    },
})

server.applyMiddleware({ app })

const httpServer = http.createServer(app)
server.installSubscriptionHandlers(httpServer)

const port = process.env.PORT || 4000

httpServer.listen({ port }, () => {
    console.log(`Apollo Server on http://localhost:${port}/graphql`)
})
