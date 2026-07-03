import HeadName from './02_HeadName.jsx';
import Desc from './03_Desc.jsx';
import Clock from './04_Clock.jsx';
import './App.css';

function BharatClock(){
    return(
        <center class='container bharat-clock'>
            <div class='head-name'>
                <HeadName/>
            </div>
            <div class='desc'>
                <Desc/>
            </div>
            <div class='clock'>
                <Clock/>
            </div>
        </center>
    );
}
export default BharatClock;