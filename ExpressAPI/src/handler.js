const { nanoid } = require('nanoid');
const books = require('./books')

const nameFilter = (bookList, queryName) => bookList.filter(
    (book) => book.name.toLowerCase().includes(queryName.toLowerCase()),
);
  
const readFilter = (bookList, readQuery) => {
    if (readQuery === '1') {
      return bookList.filter((book) => book.reading === true);
    } if (readQuery === '0') {
      return bookList.filter((book) => book.reading === false);
    }
    return bookList;
};
  
const finishFilter = (bookList, finishQuery) => {
    if (finishQuery === '1') {
      return bookList.filter((book) => book.finished === true);
    } if (finishQuery === '0') {
      return bookList.filter((book) => book.finished === false);
    }
    return bookList;
};

const addBooksHandler = (request, h) => {
    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    } = request.body;
  
    const id = nanoid(16);
  
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
  
    const finished = (pageCount === readPage);
  
    const newBook = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      insertedAt,
      updatedAt,
    };
  
    if (newBook.name === undefined) {
    //   const response = h.response({
    //     status: 'fail',
    //     message: 'Gagal menambahkan buku. Mohon isi nama buku',
    //   });
    //   response.code(400);
    //   return response;
    return  h.status(400).json({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
          });
    }

    if (newBook.readPage > newBook.pageCount) {
    //   const response = h.response({
        //     status: 'fail',
        //     message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        //   });
        //   response.code(400);
        //   return response;
        return  h.status(400).json({
                status: 'fail',
                message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
              });
    }
  
    books.push(newBook);
    const isSuccess = books.filter((book) => book.id === id).length > 0;
  
    if (isSuccess) {
      return h.status(201).json({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
              bookId: newBook.id,
            },
          })
    }

    return h.status(500).json({
          status: 'error',
          message: 'Catatan gagal ditambahkan',
        })
  }

const getAllBooksHandler = (request, h) => {
    let bookList = books;
  
    const { name: queryName, reading: readQuery, finished: finishQuery } = request.query;

    if (readQuery !== undefined) {
      bookList = readFilter(bookList, readQuery);
    }

    if (finishQuery !== undefined) {
      bookList = finishFilter(bookList, finishQuery);
    }

    if (queryName !== undefined) {
      bookList = nameFilter(bookList, queryName);
    }
  
    bookList = bookList.map((book) => {
      const { id, name, publisher } = book;
      return { id, name, publisher };
    });
  
    return h.status(200).json({
        status: 'success', 
        data: {
            books: bookList,
        },
    })
}
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.filter((n) => n.id === bookId)[0];

  if (book !== undefined) {
    return h.status(200).json({
      status: 'success',
      data: {
        book,
      },
    })
  }

  return h.status(404).json({      
      status: 'fail',
      message: 'Buku tidak ditemukan',})
}
const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
      return h.status(200).json({
          status: 'success',
          message: 'Buku berhasil dihapus',
      })
  }
  
  return h.status(404).json({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
  })
}
const putBookByIdHandler = (request, h, next) => {
  const { bookId } = request.params;
  // curl -H 'Content-Type: application/json' -X PUT -d "{name : 'njir', year : 2021, author : 'Aga', summary : 'lorem' , publisher : 'gramedia', pageCount : 12, readPage : 3, reading : false,}" 'http://localhost:3000'
  let userData = null; 
  try {
    // Parse a JSON
    userData = JSON.parse(JSON.stringify(request.body)); 
  } catch (e) {
    // You can read e for more info
      // Let's assume the error is that we already have parsed the payload
      // So just return that
      userData = request.body;
  }
  const {name,year,author,summary,publisher,pageCount,readPage,reading} = request.body;

  const updatedAt = new Date().toISOString();

  if (name === '' || name === undefined) {
      return h.status(400).json({
              status: 'fail',
              message: 'Gagal memperbarui buku. Mohon isi nama buku',
            })
  }
  
  if (readPage > pageCount) {
      return h.status(400).json({
              status: 'fail',
              message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
          })
  }

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    return h.status(200).json({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    })
  }
  
  return h.status(404).json({
          status: 'fail',
          message: 'Gagal memperbarui buku. Id tidak ditemukan',
      })
  next();
}
module.exports = {addBooksHandler,getAllBooksHandler,getBookByIdHandler,deleteBookByIdHandler,putBookByIdHandler};