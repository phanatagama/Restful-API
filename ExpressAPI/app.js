const express = require('express')
const books = require('./src/books')
const {addBooksHandler,getAllBooksHandler,getBookByIdHandler,deleteBookByIdHandler,putBookByIdHandler} = require('./src/handler')
const app = express()
const port = 3000

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