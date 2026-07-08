import "./App.css";
import FoodItems from "./02_Food_Items.jsx";
import ErrorMessage from "./03_Error_Message.jsx";

function Container(){
    // let foodItems = [];
    let foodItems = ["Pasta", "Tacos", "Dumplings", "Pancakes", "Tahini"];
    // let foodItems = ["Rice/Roti", "Green Vegetables", "Curd/Paneer", "Boiled Egg", "Dal/Sambar"];

    return( 
        <>
            <h1 class='head-name'>Healthy Foods</h1>
            <ErrorMessage items={foodItems}/>
            <FoodItems items={foodItems}/>
        </>
    );
}
export default Container;