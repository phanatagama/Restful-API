const express = require('express')
const {addBooksHandler,getAllBooksHandler,getBookByIdHandler,deleteBookByIdHandler,putBookByIdHandler} = require('./src/handler')
const app = express()
const port = 3000

app.use(express.urlencoded({
   extended: false
}));

app.use(express.json());

app.get('/books', getAllBooksHandler)

app.get('/books/:bookId', getBookByIdHandler )

app.post('/books',addBooksHandler )

app.put('/books/:bookId', putBookByIdHandler)

app.delete('/books/:bookId', deleteBookByIdHandler)

app.use('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})