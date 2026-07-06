import AppName from './02_App_Name.jsx';
import TodoAdd from './03_Todo_Add.jsx';
import TodoItemList from './05_Todo_Item_List.jsx';
import './App.css';

function Todo(){
    const todoItems = [
        {todoName:"Buy Milk", todoDate:"4/10/2023"},
        {todoName:"Go to College", todoDate:"4/10/2023"}
    ];
    return(
        <div className="todo-container text-center">
            <AppName/>
            <div className="container">
                <TodoAdd/>
                <TodoItemList todoItems={todoItems}/>
            </div>
        </div>
    )
}
export default Todo;