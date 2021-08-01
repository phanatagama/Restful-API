const { nanoid } = require('nanoid');
const books = require('./books');

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
  } = request.payload;

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
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (newBook.readPage > newBook.pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: newBook.id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Catatan gagal ditambahkan',
  });
  response.code(500);
  return response;
};
const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
  
    const index = books.findIndex((book) => book.id === bookId);
  
    if (index !== -1) {
      books.splice(index, 1);
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      });
      response.code(200);
      return response;
    }
  
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};
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
  
    const response = h.response({
      status: 'success',
      data: {
        books: bookList,
      },
    });
    response.code(200);
    return response;
};
const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
  
    const book = books.filter((n) => n.id === bookId)[0];
  
    if (book !== undefined) {
      return {
        status: 'success',
        data: {
          book,
        },
      };
    }
  
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};
const putBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
  
    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    } = request.payload;
  
    const updatedAt = new Date().toISOString();
  
    if (name === '' || name === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }
  
    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
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
  
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      });
      response.code(200);
      return response;
    }
  
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};
module.exports = {addBooksHandler,deleteBookByIdHandler,getAllBooksHandler,getBookByIdHandler,putBookByIdHandler};
