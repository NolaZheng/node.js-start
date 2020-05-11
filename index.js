const fs = require('fs')
const http = require('http')
const url = require('url')

// blocking
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8')
// console.log(textIn)
// const textOut = `This is textOut : ${textIn} , created on ${Date.now()}`
// fs.writeFileSync('./txt/output.txt', textOut)
// console.log('read')


// non blocking
// fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
//     console.log(data)
// })


//SERVER

const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName)
    output = output.replace(/{%IMAGE%}/g, product.image)
    output = output.replace(/{%PRICE%}/g, product.price)
    output = output.replace(/{%FROM%}/g, product.from)
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients)
    output = output.replace(/{%QUANTITY%}/g, product.quantity)
    output = output.replace(/{%DESCRIPTION%}/g, product.description)
    output = output.replace(/{%ID%}/g, product.id)
  
    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic')
    return output;
}

const temCard = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8')
const temOverview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8')
const temProduct = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8')

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data)

const server = http.createServer((req, res) => {
    // console.log(req)
    const {query, pathname} = url.parse(req.url, true)
    
    //overview
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-Type': 'text/html'})
        
        const cardsHtml = dataObj.map(el => replaceTemplate(temCard,el)).join('')
        const output = temOverview.replace(`{%PRODUCT_CARDS%}`, cardsHtml)
        res.end(output)
        
        //product
    } else if (pathname === '/product') {
        res.writeHead(200, { 'Content-Type': 'text/html'})
        
        const product = dataObj[query.id]
        const output = replaceTemplate(temProduct,product)
        
        res.end(output)
        
        //api
    } else if (pathname === '/api') {
        res.writeHead(200, { 'Content-Type': 'application/json'})
        res.end(data)
        
        //error
    } else {
        res.writeHead(404, { 
            'Content-Type': 'text/html'
        })
        res.end('<h1>page not found</h1>')
    }
    
})

server.listen(8000, '127.0.0.1', () => {
    console.log('server listening')
})