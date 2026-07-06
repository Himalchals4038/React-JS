import styles from './Button.module.css';

function TodoAdd(){
    return(
    <div className="row">
        <div className="col-6">
            <input type="text" placeholder="Enter Todo Here"/>
        </div>
        <div className="col-4">
            <input type="date"/>
        </div>
        <div className="col-2">
            {/* <button type="button" className={`btn btn-success px-4 todo-button ${styles['todo-button']}`}>Add</button> */}
            <button type="button" className={`btn btn-success px-4 todo-button ${styles['todo-button']}`}>Add</button>
        </div>
    </div>
    );
}

export default TodoAdd;