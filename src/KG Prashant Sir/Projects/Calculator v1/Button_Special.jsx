import styles from './Button.module.css';

const ButtonSpecial = ({value}) => {
    return(
        <>
        <div class='col offset-2'>
            {/* <div class={'p-3 border bg-light'}>{value}</div> */}
            <div class={styles['button-style']}>{value}</div>
        </div>
        </>
    );
}
export default ButtonSpecial;