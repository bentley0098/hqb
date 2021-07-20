export function getTasks() {
    return fetch('/tasks')
      .then(data => data.json())
  }

  export function getHistory(taskID) {
    return fetch('/taskHistory/' + taskID)
      .then(data => data.json())
  }
