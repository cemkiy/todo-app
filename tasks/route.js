const express = require('express')
const router = express.Router()
const Task = require('./model')

// Create Task
router.post('/', (req, res, next) => {
  var newTask = new Task(req.body)

  Task.createTask(newTask, (err, task) => {
    if (err) {
      return res.status(400).json({
        msg: err
      })
    } else {
      return res.status(201).json(task)
    }
  })
})

// Get Task by id
router.get('/:id', (req, res, next) => {
  Task.getTaskById(req.params.id, (err, task) => {
    if (err) {
      return res.status(400).json({
        msg: 'task not found'
      })
    }

    return res.status(200).json(task)
  })
})

// List Tasks
router.get('/', (req, res, next) => {
  Task.listTasks(req.query, (err, tasks) => {
    if (err) {
      return res.status(400).json({
        msg: err.toString()
      })
    }

    if (tasks.length === 0) {
      return res.status(404).json({
        msg: 'Task not found'
      })
    }
    return res.status(200).json(tasks)
  })
})

// Update Task
router.put('/:id', (req, res, next) => {
  Task.updateTask(req.params.id, req.body, (err, updatedTask) => {
    if (err) {
      return res.status(400).json({
        msg: err.toString()
      })
    }

    if (!updatedTask) {
      return res.status(400).json({
        msg: 'Task not updated!'
      })
    }
    return res.status(200).json(updatedTask)
  })
})

// Delete Task
router.delete('/:id', (req, res, next) => {
  Task.updateTask(req.params.id, {
    deleted_at: new Date()
  }, (err, deletedTask) => {
    if (err) {
      return res.status(400).json({
        msg: err.toString()
      })
    }

    if (!deletedTask) {
      return res.status(400).json({
        msg: 'Task not deleted!'
      })
    }
    return res.status(204).json()
  })
})

module.exports = router
