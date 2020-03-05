// Express
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

// Dependencies
const api = require('./api')
const auth = require('./auth')
const middleware = require('./middleware')

// environmental variables settings
const port = process.env.PORT || 1337

//binds express api to the app variable
const app = express()

// setting middle_wares
app.use(middleware.cors)
app.use(bodyParser.json())
app.use(cookieParser())

// Health check Route
app.get('/health', api.checkHealth)

// Login route
app.post('/login', auth.authenticate, auth.login)

// Products route
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)
app.post('/products', auth.ensureUser, api.createProduct)
app.put('/products/:id', auth.ensureUser, api.editProduct)
app.delete('/products/:id', auth.ensureUser, api.deleteProduct)

// Orders route
app.get('/orders', auth.ensureUser, api.listOrders)
app.post('/orders', auth.ensureUser, api.createOrder)

// User Route
app.post('/users', api.createUser)


app.use(middleware.handleValidationError)
app.use(middleware.handleError)
app.use(middleware.notFound)


const server = app.listen(port, () => console.log(`Server listening on port ${port}`))

if (require.main !== module) {
    module.exports = server
}
