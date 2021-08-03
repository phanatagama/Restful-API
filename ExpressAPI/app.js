const express = require('express')
const bodyParser = require('body-parser')
const {addBooksHandler,getAllBooksHandler,getBookByIdHandler,deleteBookByIdHandler,putBookByIdHandler} = require('./src/handler')
const app = express()
const port = 3000

// Third package
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: false })) // for parsing application/x-www-form-urlencoded

app.post('/books',addBooksHandler )

app.put('/books/:bookId', putBookByIdHandler)

app.delete('/books/:bookId', deleteBookByIdHandler)

app.get('/books', getAllBooksHandler)

app.get('/books/:bookId', getBookByIdHandler )

app.use('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})