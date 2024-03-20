// select items
const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");


// edit option to set variables
let editElement;
let editFlag = false; // because it is used after we click to edit
let editID = "";

// event listeners

// submit form
form.addEventListener("submit", addItem);
//clear items
clearBtn.addEventListener("click", clearItems);


// FUNCTIONS

function addItem(e) {
    e.preventDefault();
    const value = grocery.value; // to access the value in grocery using the value property
    const id = new Date().getTime().toString(); // to create a unique ID

    //to set conditions for all three options
    if (value && !editFlag) { // for when the item is not on the list and not editing then add it to the list
        createListItem(id, value)
        
        displayAlert("item added to the list", " success"); // to display alert
        
        container.classList.add("show-container"); //to show container
        
        addToLocalStorage(id, value); // to set local storage
        
        setBackToDefault(); // to set back to default

    } else if (value && editFlag) { // for when user is editing
        editElement.innerHTML = value;
        displayAlert("value changed", "success");

        editLocalStorage(editID, value); // to editlocal storage

        setBackToDefault(); //to set back to default so you can edit again next time

    } else {
        displayAlert("please, enter value", "danger");
    }
}

function displayAlert(text, action) {
    alert.textContent = text;

    alert.classList.add(`alert-${action}`); // to add classes
    // to remove alert
    setTimeout(function() {
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`);
    }, 1000);
}

// to clear items 
function clearItems() {
    const items = document.querySelectorAll(".grocery-item");
    if (items.length > 0) {
        items.forEach(function (item) {
            list.removeChild(item);
        });
    }

    container.classList.remove("show-container");
    displayAlert("empty list", "danger");
    setBackToDefault();
    localStorage.removeItem("list");
}

// function to delete item
function deleteItem(e) {
    const element = e.currentTarget.parentElement.parentElement; // target = our fontawesome btn

    const id = element.dataset.id; //get id to remove from local storage 

    list.removeChild(element); // this is what we are removing from the "grocery-list"
    
    if (list.children.length === 0) {
        container.classList.remove("show-container");
    }

    displayAlert("item removed", "danger"); // to go backc to default

    setBackToDefault();

    removeFromLocalStorage(id); // to remove from local storage
}

// function to edit item
function editItem(e) {
    const element = e.currentTarget.parentElement.parentElement; 

    editElement =  e.currentTarget.parentElement.previousElementSibling; // to set edit item

    grocery.value = editElement.innerHTML;

    editFlag = true;

    editID = element.dataset.id;

    submitBtn.textContent = "edit";
}


//to set back to default 
function setBackToDefault() {
    grocery.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent = "submit";
}

// FOR LOCAL STORAGE
function addToLocalStorage(id, value) {
    const grocery = {id, value};

    //get grocery items
    let items = getLocalStorage();

    items.push(grocery);
    localStorage.setItem("list", JSON.stringify(items));
    console.log("added to local storage")
}

function removeFromLocalStorage(id) {
    let items = getLocalStorage();

    items = items.filter(function (item) {
        if (item.id !==id) { // to filter out values that don't match this id
            return item;
        }
    });
    localStorage.setItem("list", JSON.stringify(items));
}

function editLocalStorage(id, value) {
    let items = getLocalStorage();

    items = items.map(function (item) {
        if (item.id === id) {
            item.value = value;
        }
        return item;
    });
    localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
    return localStorage.getItem("list")
    ?JSON.parse(localStorage.getItem("list"))
    :[];
}

//localStorage API
//setItem
//getItem
//removeItem
//save as strings

function setupItems() {
    let items = getLocalStorage();

    if (items.length > 0) {
        items.forEach(function(item) {
            createListItem(item.id, item.value);
        });
        container.classList.add("show-container");
    }
}

function createListItem(id, value) {
    const element = document.createElement("article");
    
    //add class and unique id
    element.classList.add('grocery-item'); 
    let attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr); // add attr to element

    element.innerHTML = `<p class="title">${value}</p>
    <div class="btn-container">
        <!-- edit btn -->
        <button type="button" class="edit-btn">
            <i class="fas fa-edit"></i>
        </button>
        <!-- delete btn -->
        <button type="button" class="delete-btn">
            <i class="fas fa-trash"></i>
        </button>
    </div>
    `;

    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);

    //append child
    list.appendChild(element);
}