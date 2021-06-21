const todoEdit = (theTodo,title,description,duedate,priority,notes) => {
  theTodo.title = title;
  theTodo.description = description;
  theTodo.duedate = duedate;
  theTodo.priority = priority;
  theTodo.notes = notes;
  theTodo.hash = theTodo.title + theTodo.description + theTodo.duedate + theTodo.priority + theTodo.notes;
}

const todoToggleComplete = (theTodo) => {
  if(theTodo.completed == true)
  theTodo.completed = false;
  else
  theTodo.completed = true;
}

export {todoEdit,todoToggleComplete};