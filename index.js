const taskContainer = document.querySelector(".task_container"); //directly access the parent element by classname

let globalStore = []; /*we use array for storing becz if we use variable to store                        
then it will override the old data then we can get only one card */

const generateNewCard = (taskData) => `
    <div class="col-md-6 col-lg-4" >
      <div class="card">
        <div class="card-header d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-outline-success" id=${taskData.id} onclick="editCard.apply(this,arguments)">
            <i class="fas fa-pencil-alt" id=${taskData.id} onclick="editCard.apply(this,arguments)"></i>
          </button>
          <button type="button" class="btn btn-outline-danger" id=${taskData.id} onclick="deleteCard.apply(this,arguments)">
            <i class="fas fa-trash-alt" id=${taskData.id} onclick="deleteCard.apply(this,arguments)"></i>
          </button>
        </div>
        <img
            src=${taskData.imageUrl}
            class="card-img-top" 
            alt="image1"
        />
        <div class="card-body">
          <h5 class="card-title">${taskData.taskTitle}</h5>
          <p class="card-text">${taskData.taskDescription}</p>
          <a href="#" class="btn btn-primary">${taskData.taskType}</a>
        </div>
        <div class="card-footer text-muted">
          <button type="button" id=${taskData.id} class="btn btn-outline-primary float-end" >
            Open Task
          </button>
        </div>
      </div>
    </div>
`

const loadInitialCardData = () => {

  const getCardData = localStorage.getItem("tasky"); // from local storage to get card data

  const {cards} = JSON.parse(getCardData);   //converting string to normal object

  // loop over those array of task object to create HTML card
  cards.map((cardObject) => {

    // inject it to DOM
    taskContainer.insertAdjacentHTML("beforeend", generateNewCard(cardObject));

    // update our globalStore
    globalStore.push(cardObject);
  })
};

const saveChanges = () => {
  const taskData ={
    id: `${Date.now()}`,   //unique number for id
    imageUrl: document.getElementById("imageurl").value,
    taskTitle: document.getElementById("tasktitle").value,
    taskType: document.getElementById("tasktype").value,
    taskDescription: document.getElementById("taskdescription").value,
  }; 
  taskContainer.insertAdjacentHTML("beforeend",generateNewCard(taskData)); //inject data to DOM
  
  globalStore.push(taskData);  //inject to global storage array 

  /*setItem method -> To add data to localstorage
  tasky->"id" to identify localstore data.Becz localstorage used by every website to store data
  JSON(JavaScript Object Notation)It is JSobject it will convert whole object to user understandable data
  stringify -> it convert object to sting form
  cards -> it is object & globalStore -> location as array
  */
  localStorage.setItem("tasky",JSON.stringify({cards:globalStore}));

};

const deleteCard = (event) => {
  event=window.event;
  //id
  const targetID = event.target.id;
  const tagname = event.target.tagName;

  globalStore = globalStore.filter((cardObject) => cardObject.id !== targetID);
  localStorage.setItem("tasky",JSON.stringify({cards:globalStore}));
  //contack child
  if(tagname === "BUTTON"){
    return taskContainer.removeChild(event.target.parentNode.parentNode.parentNode);
  }else{
    return taskContainer.removeChild(event.target.parentNode.parentNode.parentNode.parentNode);
  }
};

//editCard is for edit the content by using contenteditable attributes
const editCard = (event) => {
  event=window.event;
  const targetID = event.target.id;
  const tagname = event.target.tagName;
  let parentElement;
  if(tagname === "BUTTON"){
    parentElement = event.target.parentNode.parentNode;
  }else{
    parentElement = event.target.parentNode.parentNode.parentNode;
  }
  let taskTitle = parentElement.childNodes[5].childNodes[1];
  let taskDescription = parentElement.childNodes[5].childNodes[3];
  let taskType = parentElement.childNodes[5].childNodes[5];
  let submitButton = parentElement.childNodes[7].childNodes[1];

  taskTitle.setAttribute("contenteditable","true")
  taskDescription.setAttribute("contenteditable","true")
  taskType.setAttribute("contenteditable","true")
  submitButton.setAttribute("onclick","saveEditChanges.apply(this,arguments)")
  submitButton.innerHTML = "Save Changes"
  
}

const saveEditChanges = (event) => {
  event=window.event;
  let targetID=event.target.id;
  let tagname = event.target.tagName;
  let parentElement;

  if(tagname === "BUTTON"){
    parentElement = event.target.parentNode.parentNode;
  }else{
    parentElement = event.target.parentNode.parentNode.parentNode;
  }
  let taskTitle = parentElement.childNodes[5].childNodes[1];
  let taskDescription = parentElement.childNodes[5].childNodes[3];
  let taskType = parentElement.childNodes[5].childNodes[5];
  let submitButton = parentElement.childNodes[7].childNodes[1];

  const updatedData ={
    taskTitle:taskTitle.innerHTML,
    taskType:taskType.innerHTML,
    taskDescription:taskDescription.innerHTML,
  };
  globalStore = globalStore.map((task)=>{
    if(task.id === targetID){
      return {
        id: task.id,
        imageUrl: task.imageUrl,
        taskTitle: updatedData.taskTitle ,
        taskType: updatedData.taskType,
        taskDescription: updatedData.taskDescription,
      };
    }
    return task;  /*IMPORTANT becz map will create new array and update all information
    if we not write return here already exsisted data is not added to globalStore */
  }); 
  localStorage.setItem("tasky",JSON.stringify({cards:globalStore})); // update to localstorage
  // after update want to disable the editable  functions 
  taskTitle.setAttribute("contenteditable","false");
  taskDescription.setAttribute("contenteditable","false");
  taskType.setAttribute("contenteditable","false");
  submitButton.removeAttribute("onclick");
  submitButton.innerHTML = "Open Task"; 
};