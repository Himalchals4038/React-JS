import './App.css';
import AppName from './AppName.jsx';
import Button from './Button.jsx';
import ButtonSpecial from './Button_Special.jsx';
import Textarea from './Textarea.jsx';

const Calculator = () => {
    return(
        <>
        <AppName/>
        <div id='calculator' className="container mb-5" style={{width: '500px'}}>
            {/* <div className="d-flex justify-content-center">
                <input type="text" id='display' placeholder='00.00' style={{'textAlign': 'right', 'width': '100%', 'height': '50px', fontSize: '30px'}}/>
            </div> */}
            <Textarea/>
            <div className="container">
                <div class="row row-cols-3 row-cols-md-3 g-2 my-1 text-center">
                    {/* <div class="col">
                        <div class="p-3 border bg-light">C</div>
                    </div> */}
                    <Button value='C'/>
                    {/* <div class="col">
                        <div class="p-3 border bg-light">1</div>
                    </div> */}
                    <Button value='1'/>
                    {/* <div class="col">
                        <div class="p-3 border bg-light">2</div>
                    </div> */}
                    <Button value='2'/>
                </div>
                <div class="row row-cols-3 row-cols-md-3 g-2 my-1 text-center">
                    {/* <div class="col">
                        <div class="p-3 border bg-light">+</div>
                    </div> */}
                    <Button value='+'/>
                    {/* <div class="col">
                        <div class="p-3 border bg-light">3</div>
                    </div> */}
                    <Button value='3'/>
                    {/* <div class="col">
                        <div class="p-3 border bg-light">4</div>
                    </div> */}
                    <Button value='4'/>
                </div>
                <div class="row row-cols-3 row-cols-md-3 g-2 my-1 text-center">
                    {/* <div class="col">
                        <div class="p-3 border bg-light">-</div>
                    </div> */}
                    <Button value='-'/>
                    {/* <div class="col">
                        <div class="p-3 border bg-light">5</div>
                    </div> */}
                    <Button value='5'/>
                    {/* <div class="col">
                        <div class="p-3 border bg-light">6</div>
                    </div> */}
                    <Button value='6'/>
                </div>
                <div class="row row-cols-3 row-cols-md-3 g-2 my-1 text-center">
                    {/* <div class="col">
                        <div class="p-3 border bg-light">*</div>
                    </div> */}
                    <Button value='*'/>
                    {/* <div class="col">
                        <div class="p-3 border bg-light">7</div>
                    </div> */}
                    <Button value='7'/>
                    {/* <div class="col">
                        <div class="p-3 border bg-light">8</div>
                    </div> */}
                    <Button value='8'/>
                </div>
                <div class="row row-cols-3 row-cols-md-3 g-2 my-1 text-center">
                    {/* <div class="col">
                        <div class="p-3 border bg-light">/</div>
                    </div> */}
                    <Button value='/'/>
                    {/* <div class="col">
                        <div class="p-3 border bg-light">=</div>
                    </div> */}
                    <Button value='='/>
                    {/* <div class="col">
                        <div class="p-3 border bg-light">9</div>
                    </div> */}
                    <Button value='9'/>
                </div>
                <div class="row row-cols-3 row-cols-md-3 g-2 my-1 text-center">
                    {/* <div class="col offset-2">
                        <div class="p-3 border bg-light">0</div>
                    </div> */}
                    <ButtonSpecial value='0'/>
                    {/* <div class="col">
                        <div class="p-3 border bg-light">.</div>
                    </div> */}
                    <Button value='.'/>
                </div>
            </div>
        </div>
        </>
    );
}
export default Calculator;