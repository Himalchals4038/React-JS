function Hello(){
    let myName = "Subir";
    let fullName = () => {
        return "Jivan Prasad"
    }
    return <div>
        <h3>Hello World, I am {myName}</h3>
        <p>My full name is {fullName()}</p>
    </div>
}
export default Hello;