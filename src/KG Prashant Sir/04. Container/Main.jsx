import "./App.css";
import FoodItems from "./FoodItems.jsx";
import ErrorMessage from "./ErrorMessage.jsx";
import Container from "./Container.jsx";

function Main(){
    // let foodItems = [];
    let foodItems_bad = ["Pasta", "Tacos", "Dumplings", "Pancakes", "Tahini"];
    let foodItems_good = ["Rice/Roti", "Green Vegetables", "Curd/Paneer", "Boiled Egg", "Dal/Sambar"];

    return( 
        <>
        <Container>
            <h1 className='head-name'>Healthy Foods</h1>
            <ErrorMessage items={foodItems_good}/>
            <FoodItems items={foodItems_good}/>
        </Container>
        <Container>
            <h1 className='head-name'>Unhealthy Foods</h1>
            <ErrorMessage items={foodItems_bad}/>
            <FoodItems items={foodItems_bad}/>
        </Container>
        </>
    );
}
export default Main;