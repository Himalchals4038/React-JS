function Random(){
    let randNum = Math.floor(Math.random() * 100) + 1;
    return <div style={{
        'color': 'red',
        'background': 'aqua',
        'font-size': '20px',
        'font-family': 'comic sans ms',
        'padding': '10px',
        'margin': '10px',
        'border': '1px solid black',
        'border-radius': '5px'
        }}>
        Random number is: {randNum}
    </div>
}
export default Random;