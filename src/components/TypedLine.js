import React from "react";
import Typewriter from "typewriter-effect";

const TypedLine = ({ text, status, callback, activeTyping }) => {
  if (activeTyping === 0) {
    return <div className="chatLine">{text}</div>;
  }
  if (!callback) {
    switch (status) {
      case 0:
        return null;
      case 1:
        return (
          <div className="chatLine">
            <Typewriter
              onInit={(typewriter) => {
                typewriter.typeString(text).start();
              }}
              options={{ delay: 10 }}
            />
          </div>
        );
      case 2:
        return <div>{text}</div>;
      default:
        return null;
    }
  }

  switch (status) {
    case 0:
      return null;
    case 1:
      return (
        <div className="chatLine">
          <Typewriter
            onInit={(typewriter) => {
              typewriter
                .typeString(text)
                .pauseFor(1000)
                .start()
                .callFunction(callback);
            }}
            options={{ delay: 10 }}
          />
        </div>
      );
    case 2:
      return <div>{text}</div>;
    default:
      return null;
  }
};

export default TypedLine;
