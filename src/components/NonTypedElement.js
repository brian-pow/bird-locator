import React from "react";

const NonTypedElement = (props) => {
  if (props.attachClass === "complete") {
    return (
      <div className="messageContainer">
        <div className="message chatLine">{props.value}</div>
      </div>
    );
  }
  switch (props.status) {
    case 0:
      return null;
    case 1:
      return props.children;
    default:
      return null;
  }
};

export default NonTypedElement;
