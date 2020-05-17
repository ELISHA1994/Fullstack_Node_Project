const db = require('./db')
const Orders = require('./models/orders')
const Products = require('./models/products')
const Users = require('./models/users')
const autoCatch = require('./lib/auto-catch')

module.exports = autoCatch({
    checkHealth,
    getProduct,
    listProducts,
    createProduct,
    editProduct,
    deleteProduct,
    createOrder,
    listOrders,
    createUser
})

async function checkHealth (req, res, next) {
    await db.checkHealth()
    res.json({ status: 'OK' })
}

/**
 * Product route handlers
 */

async function getProduct(req, res, next) {
    const { id } = req.params

    const product = await Products.get(id)
    if(!product) return next()

    res.json(product)
}

async function listProducts(req, res, next) {
    const { offset = 0, limit = 25, tag } = req.query

    const products = await Products.list({
        offset: Number(offset),
        limit: Number(limit),
        tag
    })

    res.json(products)
}

async function createProduct (req, res, next) {
    if (!req.isAdmin) return forbidden(next)

    const product = await Products.create(req.body)
    res.json(product)
}

async function editProduct (req, res, next) {
    if (!req.isAdmin) return forbidden(next)

    const change = req.body
    const product = await Products.edit(req.params.id, change)
    res.json(product)
}

async function deleteProduct (req, res, next) {
    if (!req.isAdmin) return forbidden(next)

    await Products.remove(req.params.id)
    res.json({ success: true })
}


/**
 * Order route handlers
 */

async function createOrder (req, res, next) {
    const fields = req.body
    if (!req.isAdmin) fields.username = req.user.username

    const order = await Orders.create(req.body)
    res.json(order)
}

async function listOrders (req, res, next) {
    const { offset = 0, limit = 25, productId, status } = req.query

    const opts = {
        offset: Number(offset),
        limit: Number(limit),
        productId,
        status
    }

    if (!req.isAdmin) opts.username = req.user.username

    const orders = await Orders.list(opts)

    res.json(orders)
}

async function createUser (req, res, next) {
    const user = await Users.create(req.body)
    const { username, email } = user
    req.log.info({ username, email }, 'user created')
    res.json({ username, email })
}

function forbidden (next) {
    const err = new Error('Forbidden')
    err.statusCode = 403
    return next(err)
}






































// ck6t9rsc50001rxtg7euralhz
// ck6tcjcpj0000j2tge4emaum7

// curl -s http://localhost:1337/products/cjv32mizi0000c9gl8lxa75sd | jq
// curl -I http://localhost:1337/productsD
// curl http://localhost:1337/not-products | jq

// curl -sX POST http://localhost:1337/products -H 'Content-Type: application/json' -d '{   "description": "Rug that really ties the room together", "imgThumb": "https://images.unsplash.com/photo-1534889156217-d643df14f14a?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjY0MjAxfQ", "img": "https://images.unsplash.com/photo-1534889156217-d643df14f14a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjY0MjAxfQ",   "link": "https://unsplash.com/photos/Vra_DPrrBlE", "userId": "GPlq8En0xhg", "userName": "Ryan Christodoulou", "userLink": "https://unsplash.com/@misterdoulou", "tags": [ "rug", "room", "home", "bowling" ] }' | jq
// curl -sX POST http://localhost:1337/products -H 'Content-Type: application/json' -d '{   "description": "Creedence Clearwater Revival", "imgThumb": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Creedence_Clearwater_Revival_1968.jpg/315px-Creedence_Clearwater_Revival_1968.jpg", "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Creedence_Clearwater_Revival_1968.jpg/788px-Creedence_Clearwater_Revival_1968.jpg",   "userId": "thedude", "userName": "Jeffrey Lebowski" }' | jq

// curl -iX POST -H 'Content-Type: application/json' -d '{"username": "admin", "password": "iamthewalrus"}' --cookie-jar cookies http://localhost:1337/login
// curl -i --cookie cookies http://localhost:1337/orders
// curl -sX POST http://localhost:1337/orders -H 'Content-Type: application/json' -d '{"buyerEmail": "walter@sobchak.io", "products": ["ck6t9rsc50001rxtg7euralhz"]}' | jq
// curl -X POST -H 'content-type: application/json' -d '{"username": "admin", "password": "iamthewalrus"}' http://localhost:1337/login | jq -r .token > admin.jwt
// curl -iX POST -H 'content-type: application/json' -d '{"username": "mary", "email": "mary@fullstack.io", "password": "I love surfing"}' http://localhost:1337/users
// Excerpt From: Nate Murray. “Fullstack Node.js”. Apple Books.



// curl -X POST http://localhost:1337/products -H 'Content-Type: application/json' -d '{   "description": "Rug that really ties the room together", "imgThumb": "https://images.unsplash.com/photo-1534889156217-d643df14f14a?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjY0MjAxfQ", "img": "https://images.unsplash.com/photo-1534889156217-d643df14f14a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjY0MjAxfQ",   "link": "https://unsplash.com/photos/Vra_DPrrBlE", "userId": "GPlq8En0xhg", "userName": "Ryan Christodoulou", "userLink": "https://unsplash.com/@misterdoulou", "tags": [ "rug", "room", "home", "bowling" ] }' | jq
// curl -X PUT  http://localhost:1337/products/ck6qxj6y60000qltgdyq0g26c -H 'Content-Type: application/json' -d '{ "description": "A new Corvette" }'
// mv products.json products.json.hidden \ && curl http://localhost:1337/products \ && mv products.json.hidden products.json

// curl -sX POST http://localhost:1337/products -H 'Content-Type: application/json' -d '{"description": "Creedence Clearwater Revival", "imgThumb": "not-a-url", "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Creedence_Clearwater_Revival_1968.jpg/788px-Creedence_Clearwater_Revival_1968.jpg", "userId": "thedude", "userName": "Jeffrey Lebowski" }' | jq



// Deployment data
// https://fullstack-node-book-by-elisha.herokuapp.com/ | https://git.heroku.com/fullstack-node-book-by-elisha.git