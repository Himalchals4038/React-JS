import styles from "./FoodInput.module.css";

const FoodInput = ({handleKeyDown}) => {
    
    return (
        <div className={styles["food-input-container"]}>
            {/* <input type="text" className={styles["input-style"]} placeholder="Enter Food Here" onChange={handleKeyDown}/> */}
            <input type="text" className={styles["input-style"]} placeholder="Enter Food Here" onKeyDown={handleKeyDown}/>
        </div>
    );
}
export default FoodInput;