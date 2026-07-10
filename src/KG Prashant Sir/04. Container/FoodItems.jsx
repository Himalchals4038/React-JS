import Item from "./ItemList.jsx";

// const FoodItems = (props) => {
{/* {props.items.map((item) =>  */}
// let {items} = props;
const FoodItems = ({items}) => {
    return(
        <>
        <ul className="list-group">
            {items.map((item) => 
                <Item key={item} foodItem={item} handleBuyButton={() => alert(`${item} Added to Cart`)}/>
            )}
        </ul>
        </>
    );
}
export default FoodItems;