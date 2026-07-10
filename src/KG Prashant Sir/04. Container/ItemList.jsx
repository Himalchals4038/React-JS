import styles from "./Item.module.css";

// const Item = (props) => {
// let {foodItem} = props;
const Item = ({foodItem, handleBuyButton}) => {
    // console.log(styles);
    // const addToCart = (event) => {
    //     console.log(event);
    //     alert(`${foodItem} Added to Cart`);
    // }
    return(
        <>
            {/* <li className="list-group-item food-item">{foodItem}</li> */}
            <li className={`list-group-item ${styles['food-item']}`}>
                <span className={styles['food-span']}>
                    {foodItem}
                </span>
                {/* <button className={styles['button-cart']} onClick={(event) => addToCart(event)}>Add to Cart</button> */}
                <button className={styles['button-cart']} onClick={handleBuyButton}>Add to Cart</button>
            </li>
        </>
    );
}
export default Item;