const mongoose = require('mongoose')
const util = require('util')

// Todo Schema
const TodoSchema = mongoose.Schema({
  header: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: 'incompleted',
    enum: ['completed', 'incompleted', 'in_progress']
  },
  last_activity_at: {
    type: Date,
    default: Date.now
  }
})

const Todo = module.exports = mongoose.model('Todo', TodoSchema)

// Get Todo by id
module.exports.getTodoById = function (id, callback) {
  Todo.findById(id, callback)
}

// List Todos
module.exports.listTodos = function (filter, callback) {
  var perPage = 25
  if (filter.per_page) { perPage = parseInt(filter.per_page, 10) }
  var pageNumber = 0
  if (filter.page_number) { pageNumber = parseInt(filter.page_number, 10) }

  var sort = {}
  if (filter.sort_field) {
    if (filter.sort_type) {
      sort[filter.sort_field] = parseInt(filter.sort_type, 10)
    } else {
      sort[filter.sort_field] = -1
    }
  } else {
    sort.last_activity_at = -1
  }

  let query = {}

  if (filter.header) {
    query.header = {
      $regex: util.format('.*%s.*', filter.header),
      $options: 'i'
    }
  }

  if (filter.status) {
    query.status = filter.status
  }

  if (filter.start_last_activity_at || filter.end_last_activity_at) {
    var createdAtQuery = {}
    if (filter.start_last_activity_at) { createdAtQuery.$gt = filter.start_last_activity_at }
    if (filter.end_last_activity_at) { createdAtQuery.$lt = filter.end_last_activity_at }
    query.last_activity_at = createdAtQuery
  }

  Todo.find(query, callback).skip(pageNumber > 0 ? ((pageNumber - 1) * perPage) : 0).limit(perPage).sort(sort)
}

// Update Todo
module.exports.updateTodo = function (id, updateTodo, callback) {
  Todo.findById(id, function (err, todo) {
    if (err) callback(new Error(err))
    updateTodo.updated_at = new Date()
    todo.set(updateTodo)
    todo.save(callback)
  })
}

// Create Todo
module.exports.createTodo = function (newTodo, callback) {
  newTodo.save(callback)
}
