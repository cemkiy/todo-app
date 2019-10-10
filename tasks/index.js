const tasks = require('./route')

function initTasks (app) {
  app.use('/tasks', tasks)
}

module.exports = initTasks
