const fs = require('fs')

const textIn = fs.readFileSync('./txt/input.txt', 'utf-8')

console.log(textIn)

const textOut = `This is textOut : ${textIn} , created on ${Date.now()}`
fs.writeFileSync('./txt/output.txt', textOut)
console.log('read')