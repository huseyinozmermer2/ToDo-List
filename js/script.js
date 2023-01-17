const taskInput = document.querySelector(".task-input input"),
filters = document.querySelectorAll(".filters span"),
clearAll = document.querySelector(".clear-btn"),
taskBox = document.querySelector(".task-box");

let editId,
isEditTask = false,
// JSON.parse: JSON nesnelerini javascrpite dönüştürmeye diğer bir deyişle okumamız amacıyla kullanılır.
// localStorage: Javascript sitelerinin ve uygulamalarının son kullanma tarihi olmadan, web tarayıcısında key/value değerlerinin kaydedilebilmesine izin veren bir özelliktir.
//getItem: localstroge üzerinde kayıtlı olan anahtarları okumak için getitem metodu kullanılır.
todos = JSON.parse(localStorage.getItem("todo-list"));

filters.forEach(btn =>{
    btn.addEventListener("click", ()=>{
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id)
    });
});

// Yeni bir görev ekleme işlemini yaptırıyoruz.
function showTodo(filter){
    let li = "";
    if (todos) {
        todos.forEach((todo, id) => {
            // Yapılacak iş tamamlandıysa isComleted değerini kontrol ediyoruz.
            let isCompleted = todo.status == "completed" ? "checked" : "";
            if (filter == todo.status || filter == "all") {
                li += `<li class="task">
                            <ul>
                                <li class="col-2">
                                    <label for="${id}">
                                        <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
                                    </label>
                                </li>
                                <li class="col-3"><p class="${isCompleted}">${todo.name}</p></li>
                                <li onclick="editTask(${id}, '${todo.name}')" class="col-5"><i class="fa-solid fa-pen fa-1x"></i></li>
                                <li onclick="deleteTask(${id})" class="col-6"><i class="fa-solid fa-trash"></i></li>
                            </ul>
                        </li>`;
            }
        });
    }
        taskBox.innerHTML = li || `<span>Herhangi bir görevin bulunmamaktadır.</span>`;  
}
showTodo("all");

// Görev silme
function deleteTask(deleteId){
    //seçili görevi diziden/todostan kaldırma
    //splice() metodu diziye eleman ya da elemanlar eklenebilmesmini sağldığı gibi, silinebilmesini de sağlar.
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
}

clearAll.addEventListener("click", () => {
    //seçili görevi diziden/todostan kaldırma
    //splice() metodu diziye eleman ya da elemanlar eklenebilmesmini sağldığı gibi, silinebilmesini de sağlar.
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
});

function editTask(taskId, taskName){
    editId = taskId;
    isEditTask = true;
    taskInput.value = taskName;
}

// Tamamlanan veya bekleyen kısmını ayarlama
function updateStatus(selectedTask){
    // Görev adını içeren paragrafı alma.
    let taskName = selectedTask.parentElement.lastElementChild;
    if (selectedTask.checked) {
        taskName.classList.add("checked");
    //Seçili görevin durumunu güncellemek için completed yap
        todos[selectedTask.id].status = "completed";
    }else{
        taskName.classList.remove("checked");
        //Seçili görevin durumunu güncellemek için pending yap.
        todos[selectedTask.id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos));
}

function ekle(deger){
    let stringyap = deger.toString();
    let uzunluk   = stringyap.length;
    if (uzunluk === 1) {
        return "0" + stringyap;
    }else{
        return stringyap;
    }
}

// Yeni bir görev girilmişmi veya boşmu kontrolünü yaptırıyoruz
taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value.trim();
    if (e.key == "Enter" && userTask) {
        if (!isEditTask) { //isEditTask doğru değilse
            if (!todos) { // todos mevcut değilse todos'a boş bir dizi iletin
                todos = [];
            }
            let taskInfo = {name: userTask, status: "pending"};
            // ! push metodu, dizinin sonuna yeni değerler eklemek için kullanılır.
            todos.push(taskInfo);
        }else{
            isEditTask = false;
            todos[editId].name = userTask;
        }
        taskInput.value = "";
        // localStorage.setItem("isim", "hakan"); key:Değerin hangi isimle depolanacığını belirtir.depolanacak değeri belirtir. isim değişkenine hakan değerini atayıp veriyi depolar.
        //JSON.stringify(todos)javascript nesnesini diziye dönüştürmek için kullanılır.
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo("all");
    }

});