const mongoose = require('mongoose')
const util = require('util')

// Task Schema
const TaskSchema = mongoose.Schema({
  header: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  tags: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    default: 'incompleted',
    validate: {
      validator: function (v) {
        return v === 'completed' || v === 'incompleted'
      },
      message: 'wrong status'
    }
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  deleted_at: {
    type: Date,
    default: Date.now
  },
  completed_at: {
    type: Date
  }
})

const Task = module.exports = mongoose.model('Task', TaskSchema)

// Get Task by id
module.exports.getTaskById = function (id, callback) {
  Task.findById(id, callback)
}

// List Tasks
module.exports.listTasks = function (filter, callback) {
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
    sort.created_at = -1
  }

  var query = {
    deleted_at: null
  }

  if (filter.header) {
    query.header = {
      $regex: util.format('.*%s.*', filter.header),
      $options: 'i'
    }
  }

  if (filter.tags) {
    query.tags = { $in: filter.tags }
  }

  if (filter.status) {
    query.status = filter.status
  }

  if (filter.start_created_at || filter.end_created_at) {
    var createdAtQuery = {}
    if (filter.start_created_at) { createdAtQuery.$gt = filter.start_created_at }
    if (filter.end_created_at) { createdAtQuery.$lt = filter.end_created_at }
    query.created_at = createdAtQuery
  }

  if (filter.start_updated_at || filter.end_updated_at) {
    var updatedAtQuery = {}
    if (filter.start_updated_at) { updatedAtQuery.$gt = filter.start_updated_at }
    if (filter.end_updated_at) { updatedAtQuery.$lt = filter.end_updated_at }
    query.updated_at = updatedAtQuery
  }

  Task.find(query, callback).skip(pageNumber > 0 ? ((pageNumber - 1) * perPage) : 0).limit(perPage).sort(sort)
}

// Update Task
module.exports.updateTask = function (id, updateTask, callback) {
  Task.findById(id, function (err, task) {
    if (err) callback(new Error(err))
    updateTask.updated_at = new Date()
    task.set(updateTask)
    task.save(callback)
  })
}

// Create Task
module.exports.createTask = function (newTask, callback) {
  newTask.status = 'incomplete'
  newTask.save(callback)
}
