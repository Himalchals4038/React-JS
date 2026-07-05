import React from "react";
import "./App.css";

function Container(){
    // let foodItems = [];
    let foodItems = ["Rice/Roti", "Green Vegetables", "Curd/Paneer", "Boiled Egg", "Dal/Sambar"];

    // if (foodItems.length === 0){
    //     return <h3>No food items</h3>
    // }
    
    let emptyMessage = foodItems.length === 0 ? <h3>No food items</h3> : null;
    
    return( 
    <>
        <h1>Healthy Foods</h1>
        {emptyMessage}
        <ul class="list-group">
            {foodItems.map((item) => 
                <li key={item} class="list-group-item">{item}</li>
            )}
        </ul>
    </>);
}
export default Container;