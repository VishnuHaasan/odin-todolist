export default class todo{
  constructor(title,description,duedate,priority=1,notes){
    this.title = title;
    this.description = description;
    this.duedate = duedate;
    this.priority = priority;
    this.notes = notes;
    this.completed = false;
    this.hash = this.title + this.description + this.duedate + this.priority + this.notes;
  }
}