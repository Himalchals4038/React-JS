// const ErrorMessage = (props) => {
// let {items} = props;
{/* {props.items.length === 0 && <h4>No food items</h4>} */}
const ErrorMessage = ({items}) => {
    return(
        <>
            {items.length === 0 && <h4>No food items</h4>}
        </>);
}
export default ErrorMessage;