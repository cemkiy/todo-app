const express = require('express')
const router = express.Router()
const Todo = require('./model')

// Create Todo
router.post('/', (req, res, next) => {
  const newTodo = new Todo(req.body)

  Todo.createTodo(newTodo, (err, todo) => {
    if (err) {
      return res.status(400).json({
        msg: err
      })
    } else {
      return res.status(201).json(todo)
    }
  })
})

// Get Todo by id
router.get('/:id', (req, res, next) => {
  Todo.getTodoById(req.params.id, (err, todo) => {
    if (err) {
      return res.status(400).json({
        msg: 'todo not found'
      })
    }

    return res.status(200).json(todo)
  })
})

// List Todos
router.get('/', (req, res, next) => {
  Todo.listTodos(req.query, (err, todos) => {
    if (err) {
      return res.status(400).json({
        msg: err.toString()
      })
    }

    if (todos.length === 0) {
      return res.status(404).json({
        msg: 'Todo not found'
      })
    }
    return res.status(200).json(todos)
  })
})

// Update Todo
router.patch('/:id', (req, res, next) => {
  Todo.updateTodo(req.params.id, req.body, (err, updatedTodo) => {
    if (err) {
      return res.status(400).json({
        msg: err.toString()
      })
    }

    if (!updatedTodo) {
      return res.status(400).json({
        msg: 'Todo not updated!'
      })
    }
    return res.status(200).json(updatedTodo)
  })
})

// Delete Todo
router.delete('/:id', (req, res, next) => {
  Todo.updateTodo(req.params.id, {
    deleted_at: new Date()
  }, (err, deletedTodo) => {
    if (err) {
      return res.status(400).json({
        msg: err.toString()
      })
    }

    if (!deletedTodo) {
      return res.status(400).json({
        msg: 'Todo not deleted!'
      })
    }
    return res.status(204).json()
  })
})

module.exports = router
