import styles from "./04_Item.module.css";

// const Item = (props) => {
// let {foodItem} = props;
const Item = ({foodItem}) => {
    // console.log(styles);
    return(
        <>
            {/* <li className="list-group-item food-item">{foodItem}</li> */}
            <li className={`list-group-item ${styles['food-item']}`}>
                <span class={styles['food-span']}>
                    {foodItem}
                </span>
            </li>
        </>
    );
}
export default Item