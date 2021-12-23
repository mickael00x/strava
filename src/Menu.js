import { createRef } from "react";

export default function Menu(props) {
    const menuRef = createRef();
    return (
        <div className="menu">
            <ul className="menu-list">
                <li className="menu-li">
                    <div className="menu-item">Activities</div>
                </li>
                <li className="menu-li">
                    <div className="menu-item" ref={menuRef} onClick={props.displayGraphs}>Statistics</div>
                </li>
            </ul>
        </div>
    )
}