var todoApi = new TodoApi();

function TodoManager(tasksDOM, addButtonDOM, inputDOM) {

  var tasks = [];

  inputDOM.oninput = function (e) {
    console.log(e.target.value);
    if (!e.target.value) {
      addButtonDOM.className = 'tl-add-task-cross disabled';
      return;
    }
    addButtonDOM.className = 'tl-add-task-cross';
  }

  function createTaskDOM(taskContent, isTaskDone, taskIndex) {

    var input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = isTaskDone;
    input.onclick = function () {
      updateTask(taskIndex, input.checked);
    };
    var shortColumn = createDivDOM('tl-short-column');
    shortColumn.appendChild(input);

    var splitter = createDivDOM('tl-splitter');

    var contentDiv = createDivDOM();
    contentDiv.innerText = taskContent;
    var trashImg = document.createElement('img');
    trashImg.className = 'tl-trash-icon';
    trashImg.src = '../assets/trash.png';
    trashImg.onclick = function () {
      deleteTask(taskIndex);
    };
    var longColumn = createDivDOM('tl-long-column');
    longColumn.appendChild(contentDiv);
    longColumn.appendChild(trashImg);

    var taskRow = createDivDOM('tl-row');
    taskRow.appendChild(shortColumn);
    taskRow.appendChild(splitter);
    taskRow.appendChild(longColumn);

    return taskRow;

    function createDivDOM(className) {
      var element = document.createElement('div');
      if (className) {
        element.className = className;
      }
      return element;
    }
  }

  function addTask() {
    var taskContent = inputDOM.value;
    if (!taskContent) {
      return;
    }
    todoApi.addTask(taskContent, false, function (taskId) {
      tasks.push({
        id: taskId,
        content: taskContent,
        isDone: false
      });
      renderTasks();
      inputDOM.value = '';
    });
  }

  function deleteTask(taskIndex) {
    var task = tasks[taskIndex];
    todoApi.deleteTask(task.id, function () {
      tasks.splice(taskIndex, 1);
      renderTasks();
    });
  }

  function updateTask(taskIndex, isTaskDone) {
    var task = tasks[taskIndex];
    todoApi.updateTask(task.id, isTaskDone, function () {
      task.isDone = isTaskDone;
      renderTasks();
    });
  }

  function renderTasks() {
    while (tasksDOM.firstChild) {
      tasksDOM.removeChild(tasksDOM.firstChild);
    }
    for (var i = 0; i < tasks.length; i++) {
      var task = tasks[i];
      var taskDOM = createTaskDOM(task.content, task.isDone, i);
      tasksDOM.appendChild(taskDOM);
    }
  }

  function loadTasks() {
    todoApi.getTasks(function (fetchedTasks) {
      tasks = fetchedTasks;
      renderTasks();
    });
  }

  return {
    addTask: addTask,
    loadTasks: loadTasks
  };
}