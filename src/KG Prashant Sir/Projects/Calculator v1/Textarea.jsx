import styles from './Textarea.module.css';

const Textarea = () => {
    return(
        <div className="d-flex justify-content-center">
            {/* <input type="text" id='display' placeholder='00.00' style={{'textAlign': 'right', 'width': '100%', 'height': '50px', fontSize: '30px'}}/> */}
            <input type="text" id='display' placeholder='00.00' className={styles['text-area']}/>
        </div>
    );
}
export default Textarea;