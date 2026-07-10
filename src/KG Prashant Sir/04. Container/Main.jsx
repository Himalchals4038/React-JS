import "./App.css";
import FoodItems from "./FoodItems.jsx";
import ErrorMessage from "./ErrorMessage.jsx";
import Container from "./Container.jsx";
import FoodInput from "./FoodInput.jsx";
import { useState } from "react";

function Main(){
    // let foodItems = [];
    // let foodItems_bad = ["Pasta", "Tacos", "Dumplings", "Pancakes", "Tahini"];
    // let foodItems_good = ["Rice/Roti", "Green Vegetables", "Curd/Paneer", "Boiled Egg", "Dal/Sambar"];

    // let [textToShow, setTextState] = useState();
    // let [foodToShow_good, setFoodItem_good] = useState(["Pasta", "Tacos", "Dumplings", "Pancakes", "Tahini"]);
    let [foodToShow_good, setFoodItem_good] = useState([]);
    let [foodToShow_bad, setFoodItem_bad] = useState(["Rice/Roti", "Green Vegetables", "Curd/Paneer", "Boiled Egg", "Dal/Sambar"]);

    // let textStateArr = useState("Food Item entered by User");
    // let textToShow = textStateArr[0];
    // let setTextState = textStateArr[1];

    // let [textToShow, setTextState] = useState("Food Item entered by User");
    // console.log(`Current value of Text State: ${textToShow}`);

    // let textToShow = "Food Item entered by User";
    // const handleChange = (event) => {
    //     console.log(event.target.value);
    //     setTextState(event.target.value);
    // }

    const onKeyDown_good = (event) => {
        if (event.key === "Enter"){
            let newItem = event.target.value;
            console.log('Food Item entered is', newItem);
            setFoodItem_good([...foodToShow_good, newItem]);
            event.target.value = "";
            return;
        }
    }
    const onKeyDown_bad = (event) => {
        if (event.key === "Enter"){
            let newItem = event.target.value;
            console.log('Food Item entered is', newItem);
            setFoodItem_bad([...foodToShow_bad, newItem]);
            event.target.value = "";
            return;
        }
    }

    return( 
        <>
        <Container>
            <h1 className='head-name'>Healthy Foods</h1>
            <ErrorMessage items={foodToShow_good}/>
            {/* <FoodInput handleChange={handleChange}/> */}
            <FoodInput handleKeyDown={onKeyDown_good}/>
            {/* <p>{textToShow}</p> */}
            <FoodItems items={foodToShow_good}/>
        </Container>
        <Container>
            <h1 className='head-name'>Unhealthy Foods</h1>
            <ErrorMessage items={foodToShow_bad}/>
            {/* <FoodInput handleChange={handleChange}/> */}
            <FoodInput handleKeyDown={onKeyDown_bad}/>
            {/* <p>{textToShow}</p> */}
            <FoodItems items={foodToShow_bad}/>
        </Container>
        </>
    );
}
export default Main;