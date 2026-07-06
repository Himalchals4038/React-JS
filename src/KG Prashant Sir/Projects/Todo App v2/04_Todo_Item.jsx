// let todoName = "Buy Milk";
// let todoDate = "4/10/2023";
// let todoName = 'Go to College';
// let todoDate = '4/10/2023';
import styles from './Button.module.css';

function TodoItem({todoName, todoDate}){
    return(
        <div className="row my-2">
            <div className="col-6 text-start">
                {todoName}
            </div>
            <div className="col-4 text-start">
                {todoDate}
            </div>
            <div className="col-2">
                <button type="button" className={`btn btn-danger ${styles['todo-button']}`}>Delete</button>
            </div>
        </div>
    );
}
export default TodoItem;