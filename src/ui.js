import project from './project'
import todo from './todo'
import {projectCreatePopup,todoCreatePopup,createTodoInfoView,projectEditPopup,todoEditPopup} from './popups'
import {save,load} from './storage'
import {projectEdit} from './projectMethods'
import {todoEdit,todoToggleComplete} from './todoMethods'
let projects = load("projects");
console.log(projects);


export function start(){
  renderProjectSection();
  window.addEventListener("beforeunload",performSave);
}

const performSave = (e) => {
  save("projects",projects);
}

const renderStartButton = () => {
  let addprojectbutton = document.createElement("button");
  addprojectbutton.classList.add("button");
  addprojectbutton.setAttribute("id","addproject");
  addprojectbutton.innerHTML = "Add Project";
  return addprojectbutton;
}

const renderProjectSection = () => {
  removeProjectSection();
  removeInfo();
  removeTodos();
  let addprojectbutton = renderStartButton();
  let container = document.getElementById("projectcont");
  container.appendChild(addprojectbutton);
  addprojectbutton.addEventListener("click",createProject);
  for(var i = 0;i<projects.length;i++){
    renderProject(projects[i]);
  }
}

const removeProjectSection = () => {
  let container = document.getElementById("projectcont");
  while(container.firstChild){
    container.removeChild(container.lastChild);
  }
}

const createProject = (e) => {
  projectCreatePopup();
  let closebutton = document.getElementById("close");
  let submitbutton = document.getElementById("addprojectbutton");
  submitbutton.addEventListener("click",doIt);
  closebutton.addEventListener("click",removePopups);
}

const doIt = () => {
  let titlename = document.getElementById("projecttitle");
  if(titlename.value){
    let newproject = new project(titlename.value);
    projects.push(newproject);
    removePopups();
    renderProject(newproject);
  }
}

const renderProject = (proj) => {
  let newproject = createProjectView(proj.title);
  let projectcont = document.getElementById("projectcont");
  let button = document.getElementById("addproject");
  projectcont.insertBefore(newproject,button);
}

const createProjectView = (title) => {
  let projectele = document.createElement("div");
  projectele.classList.add("button");
  projectele.innerHTML = title;
  projectele.setAttribute("data-attr",title);
  projectele.addEventListener("click",createTodoView);
  return projectele;
}

const createTodoView = (e) => {
  let selectedProject = getProjectByAtrribute(e.target);
  if(selectedProject){
    renderTodosfromProject(selectedProject);
  }
}

const getProjectByAtrribute = (e) => {
  console.log("gambaro");
  for(var i = 0;i<projects.length;i++){
    if(projects[i].title == e.getAttribute("data-attr"))
    return projects[i];
  }
}

const renderTodosfromProject = (theProject) => {
  console.log("Entered Render Todos");
  removeTodos();
  removeInfo();
  let todocontainer = document.getElementById("todocont");
  for(var i = 0;i<theProject.todos.length;i++){
    let todo = createTodoButton(theProject.todos[i],theProject);
    todocontainer.appendChild(todo);
  }
  let addtodobutton = renderProjectAddButton(theProject);
  addtodobutton.addEventListener("click",addTodoToProject);
  let deleteprojectbutton = renderProjectDeleteButton(theProject);
  deleteprojectbutton.addEventListener("click",deleteProject);
  let editprojectbutton = renderProjectEditButton(theProject);
  editprojectbutton.addEventListener("click",editProject);
  todocontainer.appendChild(addtodobutton);
  todocontainer.appendChild(deleteprojectbutton);
  todocontainer.appendChild(editprojectbutton);
  console.log("Render Todos Exited");
}

const editProject = (e) => {
  let theProject = getProjectByAtrribute(e.target);
  projectEditPopup(theProject);
  let submitbutton = document.getElementById("editprojectbutton");
  submitbutton.addEventListener("click",editTheProject);
  let closebutton = document.getElementById("close");
  closebutton.addEventListener("click",removePopups);
}

const editTheProject = (e) => {
  let selectedProject = getProjectByAtrribute(e.target);
  let titlename = document.getElementById("projecttitle");
  console.log(selectedProject);
  if(titlename.value){
    projectEdit(selectedProject,titlename.value);
    renderProjectSection();
    removePopups();
    return;
  }
}

const renderProjectAddButton = (theProject) => {
  let addtodobutton = document.createElement("button");
  addtodobutton.classList.add("button");
  addtodobutton.innerHTML = "Add Todos";
  addtodobutton.setAttribute("data-attr",theProject.title);
  return addtodobutton;
}

const renderProjectDeleteButton = (theProject) => {
  let deleteprojectbutton = document.createElement("button");
  deleteprojectbutton.classList.add("button");
  deleteprojectbutton.innerHTML = "Delete Project";
  deleteprojectbutton.setAttribute("data-attr",theProject.title);
  return deleteprojectbutton;
}

const renderProjectEditButton = (theProject) => {
  let editprojectbutton = document.createElement("button");
  editprojectbutton.classList.add("button");
  editprojectbutton.innerHTML = "Edit Project";
  editprojectbutton.setAttribute("data-attr",theProject.title);
  return editprojectbutton;
}

const deleteProject = (e) => {
  let selectedProject = getProjectByAtrribute(e.target);
  if(removeProject(selectedProject)){
    removeProjectFromView(selectedProject);
    removeTodos();
    removeInfo();
  }
  console.log(projects);
}

const removeProjectFromView = (theProject) => {
  let view = document.getElementById("projectcont").children;
  let projectButton = getProjectButton(view,theProject.title);
  projectButton.remove();
}

const getProjectButton = (parent,title) => {
  for(var i = 0;i<parent.length;i++){
    if(parent[i].getAttribute("data-attr") == title)
    return parent[i];
  }
}

const removeProject = (selectedProject) => {
  for(var i = 0;i<projects.length;i++){
    if(projects[i].title == selectedProject.title){
      projects.splice(i,1);
      return "Success";
    }
  }
}

const removeTodos = () => {
  console.log("Remove Todos Entered");
  let todoView = document.getElementById("todocont");
  while(todoView.firstChild){
    todoView.removeChild(todoView.lastChild);
  }
  console.log("Remove Todos Exited");
}

const addTodoToProject = (e) => {
  todoCreatePopup();
  let currentProject = getProjectByAtrribute(e.target);
  let todocreatebutton = document.getElementById("addtodobutton");
  todocreatebutton.setAttribute("data-attr",currentProject.title);
  todocreatebutton.addEventListener("click",appendTodoToProject);
  let closebutton = document.getElementById("close");
  closebutton.addEventListener("click",removePopups);
}

const appendTodoToProject = (e) => {
  let todocredentials = validateTodoInput();
  if(todocredentials){
    let newTodo = new todo(todocredentials[0],todocredentials[1],todocredentials[2],todocredentials[3],todocredentials[4]);
    let selectedProject = getProjectByAtrribute(e.target);
    selectedProject.todos.push(newTodo);
    removePopups();
    console.log(selectedProject.todos);
    renderTodosfromProject(selectedProject);
  }
  else{
    console.log("Failed.");
  }
}

const validateTodoInput = () => {
  let title = document.getElementById("todotitle");
  let description = document.getElementById("tododescription");
  let duedate = document.getElementById("tododuedate");
  let priority = document.getElementById("todopriority");
  let notes = document.getElementById("todonotes");

  if(title.value && description.value && duedate.value && (priority.value > 0 && priority.value <= 10) && notes.value)
  return [title.value,description.value,duedate.value,priority.value,notes.value];
  else
  return false;
}

const createTodoButton = (selectedTodo,selectedProject) => {
  let todoelement = document.createElement("button");
  todoelement.innerHTML = selectedTodo.title;
  todoelement.setAttribute("todo-hash",selectedTodo.hash);
  todoelement.setAttribute("project",selectedProject.title);
  todoelement.classList.add("button");
  todoelement.addEventListener("click",renderTodoInfoView);
  return todoelement;
}

const renderTodoInfoView = (e) => {
  removeInfo();
  let showcontainer = document.getElementById("showcont");
  let selectedProject = getProjectByEvent(e.target);
  let selectedTodo = getTodoByEvent(selectedProject,e.target);
  let infocontainer = createTodoInfoView(selectedTodo);
  showcontainer.appendChild(infocontainer);
  let deleteButton = document.getElementById("deletetodobutton");
  deleteButton.setAttribute("project",selectedProject.title);
  deleteButton.setAttribute("todo-hash",selectedTodo.hash);
  deleteButton.addEventListener("click",deleteTheTodo);
  let editButton = document.getElementById("edittodobutton");
  editButton.setAttribute("project",selectedProject.title);
  editButton.setAttribute("todo-hash",selectedTodo.hash);
  editButton.addEventListener("click",editTodo);
  let completedButton = renderCompletedButton(selectedProject,selectedTodo);
}

const renderCompletedButton = (theProject,theTodo) => {
  let button = document.createElement("button");
  button.classList.add("button");
  button.setAttribute("todo-hash",theTodo.hash);
  button.setAttribute("project",theProject.title);
  button.innerHTML = "Completed";
  if(theTodo.completed){
    button.style.backgroundColor = "green";
  }
  else{
    button.style.backgroundColor = "red";
  }
  button.addEventListener("click",toggleCompletedButton);
  let showcontainer = document.getElementById("showcont");
  showcontainer.appendChild(button);
}

const toggleCompletedButton = (e) => {
  let selectedProject = getProjectByEvent(e.target);
  let selectedTodo = getTodoByEvent(selectedProject,e.target);
  console.log(typeof selectedTodo);
  todoToggleComplete(selectedTodo);
  let button = e.target;
  if(selectedTodo.completed){
    button.style.backgroundColor = "green";
  }
  else{
    button.style.backgroundColor = "red";
  }
}

const renderTodoInfoViewFromTodo = (selectedProject,selectedTodo) => {
  removeInfo();
  let showcontainer = document.getElementById("showcont");
  let infocontainer = createTodoInfoView(selectedTodo);
  showcontainer.appendChild(infocontainer);
  let deleteButton = document.getElementById("deletetodobutton");
  deleteButton.setAttribute("project",selectedProject.title);
  deleteButton.setAttribute("todo-hash",selectedTodo.hash);
  deleteButton.addEventListener("click",deleteTheTodo);
  let editButton = document.getElementById("edittodobutton");
  editButton.setAttribute("project",selectedProject.title);
  editButton.setAttribute("todo-hash",selectedTodo.hash);
  editButton.addEventListener("click",editTodo);
  let completedButton = renderCompletedButton(selectedProject,selectedTodo);
}

const deleteTheTodo = (e) => {
  let selectedProject = getProjectByEvent(e.target);
  let selectedTodo = getTodoByEvent(selectedProject,e.target);
  removeInfo();
  removeTodoFromProject(selectedTodo,selectedProject);
  getTodoButton(selectedTodo).remove();
}

const getTodoButton = (selectedTodo) => {
  let view = document.getElementById("todocont").children;
  for(var i = 0;i<view.length;i++){
    if(view[i].getAttribute("todo-hash") == selectedTodo.hash)
    return view[i];
  }
}

const removeTodoFromProject = (selectedTodo,selectedProject) => {
  for(var i = 0;i<selectedProject.todos.length;i++){
    if(selectedProject.todos[i].hash == selectedTodo.hash){
      selectedProject.todos.splice(i,1);
      return "Successfully deleted Todo";
    }
  }
}

const getProjectByEvent = (element) => {
  for(var i = 0;i<projects.length;i++){
    if(projects[i].title==element.getAttribute("project"))
    return projects[i];
  }
}

const getTodoByEvent = (project,element) => {
  for(var i = 0;i<project.todos.length;i++){
    if(project.todos[i].hash == element.getAttribute("todo-hash"))
    return project.todos[i];
  }
}

const removeInfo = () => {
  let info = document.getElementById("showcont");
  while(info.firstChild){
    info.removeChild(info.lastChild);
  }
}

const removePopups = () => {
  let popup = document.getElementsByClassName("popup");
  for(var i = 0;i<popup.length;i++)
  popup[i].remove();
}

const editTodo = (e) => {
  let selectedProject = getProjectByEvent(e.target);
  let selectedTodo = getTodoByEvent(selectedProject,e.target);
  todoEditPopup(selectedProject,selectedTodo);
  let submitbutton = document.getElementById("edittodobutton");
  submitbutton.addEventListener("click",editTheTodo);
  let closebutton = document.getElementById("close");
  closebutton.addEventListener("click",removePopups);
}

const editTheTodo = (e) => {
  let selectedProject = getProjectByEvent(e.target);
  let selectedTodo = getTodoByEvent(selectedProject,e.target);
  let todocredentials = validateTodoInput();
  if(todocredentials){
    todoEdit(selectedTodo,todocredentials[0],todocredentials[1],todocredentials[2],todocredentials[3],todocredentials[4]);
    console.log("Good");
    removePopups();
    console.log("No popups chikom");
    renderTodosfromProject(selectedProject);
    console.log("Todo render issue");
    renderTodoInfoViewFromTodo(selectedProject,selectedTodo);
    console.log("Todo info render issue");
  }
}