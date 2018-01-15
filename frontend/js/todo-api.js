// API connector with functions, which fire callbacks from their parameters

function TodoApi() {

  var herekuappApiUrl = 'https://todo-simple-api.herokuapp.com/todos';

  function addTask(taskContent, isTaskDone, successCallback) {
    var data = {
      title: taskContent,
      isComplete: isTaskDone
    };
    var options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
    fetch(herekuappApiUrl, options)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        successCallback(data.data.id);
      });
  }

  function deleteTask(taskId, successCallback) {
    fetch(herekuappApiUrl + '/' + taskId, { method: 'DELETE' })
      .then(successCallback);
  }

  function updateTask(taskId, isTaskDone, successCallback) {
    var data = {
      isComplete: isTaskDone
    };
    var options = {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
    fetch(herekuappApiUrl + '/' + taskId, options)
      .then(successCallback);
  }

  function getTasks(successCallback) {
    fetch(herekuappApiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var herokuappTasks = data.data;
        var tasks = [];
        for (var i = 0; i < herokuappTasks.length; i++) {
          var task = herokuappTasks[i];
          tasks.push({
            id: task.id,
            content: task.title,
            isDone: task.isComplete
          });
        }
        successCallback(tasks);
      });
  }

  return {
    addTask: addTask,
    deleteTask: deleteTask,
    updateTask: updateTask,
    getTasks: getTasks
  };
}
