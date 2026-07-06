import TodoItem from './04_Todo_Item.jsx';
const TodoItemList = ({todoItems}) => {
    return(
        <>
        {todoItems.map((item) => (
            <TodoItem key={item.todoName} todoName={item.todoName} todoDate={item.todoDate}/>
        ))}
        </>
    );
}
export default TodoItemList;