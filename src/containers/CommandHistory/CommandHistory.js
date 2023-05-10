import React, { useContext } from "react";
import ControlContext from "../../contexts/control-context";
import "./CommandHistory.css";
console.log("ControlContext: ", ControlContext);


const CommandHistory = () => {
  const { currCommand ,commandList} = useContext(ControlContext);
  
  const renderCommand = (command, index, className) => {
    return (
      <div className={`Command ${className}`} key={index}>
        <div className="CommandContent">
          {command.displayCommandContent()}
        </div>
      </div>
    );
  };

  return (
    <div className="CommandHistory">
      <div className="CommandList">
        { commandList.map((command, index) => {
          if (index === currCommand) {
            return renderCommand(command, index, "ExecutedCommand");
          } else if (index < currCommand) {
            return renderCommand(command, index, "UndoableCommand");
          } else {
            return renderCommand(command, index, "RedoableCommand");
          }
        })}
      </div>
    </div>
  );
};

export default CommandHistory;
