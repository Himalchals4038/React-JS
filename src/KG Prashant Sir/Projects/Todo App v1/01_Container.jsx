import AppName from './02_App_Name.jsx';
import TodoAdd from './03_Todo_Add.jsx';
import TodoItem1 from './04_Todo_Item1.jsx';
import TodoItem2 from './05_Todo_Item2.jsx';
import './App.css';

function Todo(){
    return(
        <center class="todo-container">
            <div id="app-name">
                <AppName/>
            </div>
            <div class="container">
                <div id="todo-add">
                    <TodoAdd/>
                </div>
                <div id="todo-item1">
                    <TodoItem1/>
                </div>
                <div id="todo-item2">
                    <TodoItem2/>
                </div>
            </div>
        </center>
    )
}
export default Todo;