
const load = (key) => {
  let projects = JSON.parse(localStorage.getItem(key));
  if(projects === null || projects === undefined || projects.length ==0){
    return [];
  }
  else
  return projects;
}

const save = (key,value) => {
  localStorage.setItem(key,JSON.stringify(value));
}

export {save,load};