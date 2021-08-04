/* 1. Book Class */
class Book{
// the constructor...
  constructor(
    title = '',
    author = '',
    pageNum = 0,
    isRead = false
    ){
    this.title = title
    this.author = author
    this.pageNum = pageNum
    this.isRead = isRead
    } 
}

/* 2. DisplayBooks Class */
class DisplayBooks {
  static displayBooks(){
     const myLibrary = Store.getBooks()
     myLibrary.forEach((book) => DisplayBooks.addBookToLibrary(book)) 
  }
  static addBookToLibrary(book){
    const list = document.querySelector('#book-list')
    const row = document.createElement('tr')
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.pageNum}</td>
      <td><button class="btn btn-info btn-sm" id="read" >${book.isRead}</button></td>
      <td><a href="#" class="btn btn-danger btn-sm delete"  id="delete">DEL</a></td>
      `

    list.appendChild(row)
  }

  static deleteBook(element) {
    if(element.classList.contains('delete')) {
      element.parentElement.parentElement.remove()
    }
  }

  static showAlert(message, className) {
    const div = document.createElement('div')
    div.className = `alert alert-${className} text-center`
    div.appendChild(document.createTextNode(message))
    const container = document.querySelector('.container')
    const form = document.querySelector('#book-form')
    container.insertBefore(div, form)
    // set timer
    setTimeout(() => 
      document.querySelector('.alert').remove(), 2000)
  }

  static clearInputs() {
    document.querySelector('#title').value = ''
    document.querySelector('#author').value = ''
    document.querySelector('#pagenum').value = ''
  }
}

/* 3. Store Class */
class Store {
  static getBooks(){
    let books 
    if(localStorage.getItem('books') === null) {
      books = []
    } else {
      books = JSON.parse(localStorage.getItem('books'))
    }
    return books
  }

  static addBook(book){
    const books = Store.getBooks()
    books.push(book)
    localStorage.setItem('books', JSON.stringify(books))
  }

  static removeBook(title){
    const books = Store.getBooks()
    books.forEach((book, index) => {
      if (book.title === title) {
        books.splice(index, 1)
      }
    })
    localStorage.setItem('books', JSON.stringify(books))
  }
}

/* 4. Event: Display Books */
document.addEventListener('DOMContentLoaded', DisplayBooks.displayBooks )

/* 5. Event Add a Book */
document.querySelector('#book-form').addEventListener('submit', (e) => {
  e.preventDefault()
  // get values
  const title = document.querySelector('#title').value
  const author = document.querySelector('#author').value
  const pageNum = document.querySelector('#pagenum').value
  // Validate
  if(title === '' || author === '' || pageNum === '') {
    DisplayBooks.showAlert('Please fill all fields', 'danger')
  } else {
  // instantiate Books
    const book = new Book(title, author, pageNum)
    // Add to display
    DisplayBooks.addBookToLibrary(book)
    // Add book to Storage
    Store.addBook(book)
    // Alert confirmation
    DisplayBooks.showAlert('the book was added to your library', 'success')

    // Clear input feilds
    DisplayBooks.clearInputs()
  }
  })

/* 6. Event: Remove a Book */
document.querySelector('#book-list').addEventListener('click', (e) => {
  e.preventDefault()
    // remove from display
  DisplayBooks.deleteBook(e.target)

    // remove from Storage
  Store.removeBook(e.target.parentElement.parentElement.firstChild.nextElementSibling.textContent)
    // Alert confirmation
  DisplayBooks.showAlert('the book has been removed', 'danger')
})

