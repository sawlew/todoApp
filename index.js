
const btnTodo = document.getElementById('btn');
const update_btn = document.getElementById('update-btn');
const errorMessage = document.getElementById('error');
const todoBox = document.getElementById('display-box');
const todoInput = document.getElementById('input-panel');

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}


const DB_NAME = "todo_db";


const createTodo = () => {
    const todoInput = document.getElementById('input-panel');

    if(!todoInput.value){
      errorMessage.innerHTML = "Please provide a todo title";
      errorMessage.classList.remove("hidden");
      setTimeout(() => {
        errorMessage.classList.add("hidden");
      }, 5000);

      return;
    }

    const newTodo = {
        id: uuid(),
        title: todoInput.value,
        created_at: Date.now(),
    }
    const todo_db = JSON.parse(localStorage.getItem(DB_NAME)) || [];
    const new_todo_db = [...todo_db, newTodo];

    localStorage.setItem(DB_NAME, JSON.stringify(new_todo_db));
    fetchTodos();
    todoInput.value = "";
}

const fetchTodos = () => {
    const todo_db = JSON.parse(localStorage.getItem(DB_NAME)) || [];
    const noTodo = todo_db.length === 0;
    if(noTodo){
      todoBox.innerHTML = `<p class="text-center pt-5 text-gray-300">Your todos will appear here</p>`;
      return;
    }

    const todos = todo_db.sort((a, b) => a.created_at < b.created_at ? 1 : a.created_at > b.created_at ? -1 : 0
    ).map((todo) => {
        return `
        <div class="group flex justify-between p-3 mb-5 rounded bg-gray-100 hover:bg-gray-200">
      <p>${todo.title}</p>
      <div class="flex w-[12%] justify-between hidden group-hover:flex">
        <svg xmlns="http://www.w3.org/2000/svg" color="blue" onclick="handleEditMode('${todo.id}')" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" color="red" onclick="deleteTodo('${todo.id}')" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>                
      </div>
    </div>`;
    });

    todoBox.innerHTML = todos.join("");
};



const deleteTodo = (id) => {

    Swal.fire({
        title: 'Delete Todo!',
        text: 'Do you want to delete this todo?',
        icon: 'warning',
        confirmButtonText: 'Yes!',
        showCancelButton: true,
      }).then((res) => {
        if (res.isConfirmed){
            console.log(id);
            const todo_db = JSON.parse(localStorage.getItem(DB_NAME)) || [];
            console.log(todo_db);
            const new_todo_db = todo_db.filter((todo) => todo.id !== id);
            console.log(new_todo_db);

            localStorage.setItem(DB_NAME, JSON.stringify(new_todo_db));
            fetchTodos();
        }else{
            return;
        }
        fetchTodos();
      })
}

const handleEditMode = (id) => {
  console.log(id);
  const todo_db = JSON.parse(localStorage.getItem(DB_NAME)) || [];
  const todo_to_udate = todo_db.find((todo) => todo.id == id);
  if(!todo_to_udate){
    return;
  }
  todoInput.value = todo_to_udate.title;

  update_btn.classList.remove("hidden");
  update_btn.setAttribute("todo_id_to_update", id);

  btnTodo.classList.add("hidden");
}


const updateTodo = () => {
  if(!todoInput.value){
    errorMessage.innerHTML = "Please provide a todo title";
    errorMessage.classList.remove("hidden");
    setTimeout(() => {
      errorMessage.classList.add("hidden");
    }, 5000);

    return;
  }

  const update_btn = document.getElementById('update-btn');
  const todo_id_to_update = update_btn.getAttribute("todo_id_to_update");
  const todo_db = JSON.parse(localStorage.getItem(DB_NAME)) || [];
  // const todo_to_udate = todo_db.find((todo) => todo.id === id);

  const updated_todo_db = todo_db.map((todo) => {
    if (todo.id === todo_id_to_update){
      return { ...todo, title: todoInput.value};
    }else{
      return todo;
    }
  });
  localStorage.setItem(DB_NAME, JSON.stringify(updated_todo_db));
  fetchTodos();

  todoInput.value = "";
  update_btn.classList.add("hidden");
  btnTodo.classList.remove("hidden");
}

fetchTodos();