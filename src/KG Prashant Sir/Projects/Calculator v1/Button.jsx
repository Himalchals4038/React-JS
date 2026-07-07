import styles from './Button.module.css';

const Button = ({value}) => {
    return(
        <>
        <div class='col'>
            {/* <div class={`p-3 border bg-light ${styles['button-style']}`}>{value}</div> */}
            <div class={styles['button-style']}>{value}</div>
        </div>
        </>
    );
}
export default Button;