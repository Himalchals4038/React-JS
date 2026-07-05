// const Item = (props) => {
// let {foodItem} = props;
const Item = ({foodItem}) => {
    return(
        <>
            <li className="list-group-item">{foodItem}</li>
        </>);
}
export default Item