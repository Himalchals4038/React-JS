import Item from "./04_Item.jsx";

// const FoodItems = (props) => {
{/* {props.items.map((item) =>  */}
// let {items} = props;
const FoodItems = ({items}) => {
    return(
        <>
            <ul className="list-group">
                {items.map((item) => 
                    <Item key={item} foodItem={item}/>
                )}
            </ul>
        </>
    );
}
export default FoodItems;