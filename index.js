const inquirer = require('inquirer');
const db = require('./db/connection')
require('console.table')

const init = () => {
  inquirer.prompt({
    name: "selection",
    type: "list",
    choices: ['Add a book', 'Add an author', 'View all books', 'View all authors']
  })
  .then(data => {
    if (data.selection === 'Add a book') {
      enterBook()
    } else if (data.selection === 'View all books') {
      viewBooks()
    } else if (data.selection === 'Add an author') {
      addAuthor()
    }
    else if (data.selection === 'View all authors') {
      viewAuthors()
    }
  })
}

const viewBooks = () => {
  db.query(`SELECT * FROM book`, (err, data) => {
    if (err) {
      throw err
    } else {
      console.table(data)
      init()
    }
  })
}

const viewAuthors = () => {
  db.query(`SELECT * FROM authors`, (err, data) => {
    if (err) {
      throw err
    } else {
      console.table(data)
      init()
    }
  })
}

const enterBook = () => {
  inquirer.prompt({
    name: "book_title",
    type: "input",
    message: "What is the title of the book?"
  })
  .then(data => {
    db.query(`INSERT INTO book (title) VALUES (?);`, data.book_title, (err) => {
      if (err) {
        throw err
      } else {
        console.log('book successfully added')
        init();
      }
    })
  })
}

const addAuthor = () => {
  db.query(`SELECT * FROM book`, (err, data) => {
    if (err) {
      throw err
    } else {
    inquirer.prompt([
    {
      name: "firstName",
      type: "input",
      message: "What is the Author's first name?"
    },
    {
      name: "lastName",
      type: "input",
      message: "What is the Author's last name?"
    },
    {
      name: "book_id",
      type: "list",
      message: "What is the Author's book id?",
      choices() {
        let booksArr = [];
        data.forEach(({ title }) => {
          booksArr.push(title)
        })
        return booksArr;
      }
    },
  ])
    .then(result => {
      db.query(`SELECT id FROM book WHERE title=?`, result.book_id, (err, data) =>{
        if (err) {
          throw err
        } else {
          let newBookId = JSON.stringify(data[0].id)
          db.query(`INSERT INTO authors (first_name, last_name, book_id) VALUES (?,?,?)`, [result.firstName, result.lastName, newBookId], (err) => {
            if (err) {
              throw err
            } else {
              console.log('Author successfully added')
              init()
            }
          })
        }
      })
    })
  }})
}

init();