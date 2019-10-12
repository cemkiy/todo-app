const todos = require('./route')

function initTodos (app) {
  app.use('/todos', todos)
}

module.exports = initTodos
