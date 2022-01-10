import React, { useState, createRef, useCallback } from "react";

export default function Input({value, onClickChange}) {
    const [isActive, setIsActive] = useState(false);
    const inputRef = createRef();

    const handleInputChange = useCallback((event, props) => {    
        if(isActive) {
            setIsActive(false)
        } else {
            setIsActive(true)
        }
        // pour chaque this.props.series set event.target.value a active
        // props.series.forEach(dataset => {
        //     console.log(dataset);
        // })
        console.log(props);

        onClickChange(event);  
        
    }, [onClickChange, isActive])

    return <div className="absciss-container">
            <input 
                className={ `${isActive ? "absciss-item absciss-item-active" : "absciss-item" }` }
                type="text" 
                isActive={ isActive }
                value={ value }
                ref={ inputRef }    
                onClick={ handleInputChange }
                style= {{ width: value.length * 10 + "px"}}
            ></input>
            { isActive && <span onClick={ handleInputChange } className="absciss-item-cross">x</span>}
            </div>;
}