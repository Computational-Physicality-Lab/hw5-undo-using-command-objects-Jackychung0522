import React, { useContext } from "react";
import ControlContext from "../../contexts/control-context";
import "./CommandList.css";
console.log("ControlContext: ", ControlContext);


const CommandList = () => {
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
            return renderCommand(command, index, "UndoCommand");
          } else {
            return renderCommand(command, index, "RedoCommand");
          }
        })}
      </div>
    </div>
  );
};

export default CommandList;
