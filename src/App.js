import React, { Component } from "react";

import ControlPanel from "./containers/ControlPanel/ControlPanel";
import Workspace from "./containers/Workspace/Workspace";
import CommandHistory from "./containers/CommandHistory/CommandHistory";
import ControlContext from "./contexts/control-context";
import { genId, defaultValues } from "./shared/util";
import ChangeFillColorCommandObject from "./shared/commandObjects/ChangeFillColorCommandObject";
import ChangeBorderWidthCommandObject from "./shared/commandObjects/ChangeBorderWidthCommandObject";
import ChangeBorderColorCommandObject from "./shared/commandObjects/ChangeBorderColorCommandObject";
import CreateCommandObject from "./shared/commandObjects/CreateCommandObject";
import MoveShapeCommandObject from "./shared/commandObjects/MoveShapeCommandObject";
import DeleteCommandObject from "./shared/commandObjects/DeleteCommandObject";
import "./App.css";

class App extends Component {
  state = {
    // controls
    currMode: defaultValues.mode,
    currBorderColor: defaultValues.borderColor,
    currBorderWidth: defaultValues.borderWidth,
    currFillColor: defaultValues.fillColor,

    // workspace
    shapes: [],
    shapesMap: {},
    selectedShapeId: undefined,

    // handling undo/redo
    commandList: [],
    currCommand: -1,
  };

  constructor() {
    super();

    /*
     * pass this undoHandler into command object constructors:
     *  e.g. let cmdObj = new ChangeFillColorCommandObject(this.undoHandler);
     */
    this.undoHandler = {
      registerExecution: this.registerExecution,
      changeCurrFillColor: this.changeCurrFillColor,
      changeCurrBorderWidth: this.changeCurrBorderWidth,
      changeCurrBorderColor: this.changeCurrBorderColor,
      changeCurrMode: this.changeCurrMode,
      moveShape:this.moveShape,
      canUndo: this.canUndo,
      canRedo: this.canRedo,
      addShape: this.addShape,
      deleteSelectedShape: this.deleteSelectedShape,
      selectShape: this.selectShape,
      // TODO: fill this up with whatever you need for the command objects
      updateShape: this.updateShape,
      remove: this.remove,
    };
  }

  /*
   * TODO:
   * add the commandObj to the commandList so
   * that is available for undoing.
   */
  registerExecution = (commandObject) => {
    let commandList = [...this.state.commandList];
    let currCommand = this.state.currCommand;
    commandList = commandList.slice(0, this.state.currCommand + 1);
    commandList.push(commandObject);
    this.setState({ commandList });
    currCommand++;
    this.setState({ currCommand });

  };


  /*
   * TODO:
   * actually call the undo method of the command at
   * the current position in the undo stack
   */
  undo = () => {
    console.log("undo");
    if (this.canUndo()) {
      let command = this.state.commandList[this.state.currCommand];
      command.undo();
      this.setState({ currCommand: this.state.currCommand - 1 });
    }
  };

  /*
   * TODO:
   * actually call the redo method of the command at
   * the current position in the undo stack. Note that this is
   * NOT the same command as would be affected by a doUndo()
   */
  redo = () => {
    console.log("redo");
    if (this.canRedo()) {
      let command = this.state.commandList[this.state.currCommand + 1];
      command.redo();
      this.setState({ currCommand: this.state.currCommand + 1 });

    };
  }
  canUndo() {
    return (this.state.currCommand >= 0);
  }

  canRedo() {
    return (this.state.currCommand < this.state.commandList.length - 1);
  }

  // add the shapeId to the array, and the shape itself to the map
  addShape = (shapeData, id) => {
    let shapes = [...this.state.shapes];
    let shapesMap = { ...this.state.shapesMap };



    if (shapesMap[id]) {
      shapesMap[id].visible = true;
      console.log(id);
    }
    else {
      id = genId();
      shapesMap[id] = {
        ...shapeData,
        id,
      };
      shapes.push(id);
      let command = new CreateCommandObject(this.undoHandler, shapesMap[id]);
      command.execute();
    }
    
    this.setState({ shapes, shapesMap });


  };
  remove = (targetObject) => {
    let id = targetObject.id;
    let shapesMap = { ...this.state.shapesMap };

    shapesMap[id].visible = false;

    this.setState({ shapesMap, selectedShapeId: undefined });
  };


  // get the shape by its id, and update its properties
  updateShape = (shapeId, newData,isSelect) => {
    let shapesMap = { ...this.state.shapesMap };
    let targetShape = shapesMap[shapeId];
    shapesMap[shapeId] = { ...targetShape, ...newData };
    
    this.setState({ shapesMap }, function() { 
      if(isSelect){
        this.selectShape(shapeId);
      }
    });

  };

  moveShape = (newData) => {
    if (this.state.selectedShapeId) {
      this.updateShape(this.state.selectedShapeId, newData);
    }

  };
  handleMoveShape=(oldValue,newValue)=>{
    if (this.state.selectedShapeId) {
     
      
      let id = this.state.selectedShapeId;

      let shape = this.state.shapesMap[id];
      let command = new MoveShapeCommandObject(this.undoHandler,shape,oldValue,newValue);
      command.execute();

    }
  }
  changeMoveShape = (oldValue, newData) => {
    let command = new MoveShapeCommandObject(this.undoHandler);
    let id = this.state.selectedShapeId;
    let shape = this.state.shapesMap[id];
    command.execute(oldValue, newData, id, shape);

  }
  
  // deleting a shape sets its visibility to false, rather than removing it
  deleteSelectedShape = () => {
    let shapesMap = { ...this.state.shapesMap };
    shapesMap[this.state.selectedShapeId].visible = false;
    this.setState({ shapesMap, selectedShapeId: undefined });

    let command=new DeleteCommandObject(this.undoHandler,shapesMap[this.state.selectedShapeId]);
    command.execute();
  };

  changeCurrMode = (mode) => {
    if (mode === "line") {
      this.setState({
        currMode: mode,
        currBorderColor: defaultValues.borderColor,
      });
    } else {
      this.setState({ currMode: mode });
    }
  };

  changeCurrBorderColor = (borderColor) => {
    this.setState({ currBorderColor: borderColor });
    if (this.state.selectedShapeId) {
      this.updateShape(this.state.selectedShapeId, { borderColor });
      let id = this.state.selectedShapeId;
      let shape = this.state.shapesMap[id];

      let command = new ChangeBorderColorCommandObject(this.undoHandler);
      command.execute(shape, borderColor, id);
    }
    
    

  };
  
  changeCurrBorderWidth = (borderWidth) => {
    this.setState({ currBorderWidth: borderWidth });
    if (this.state.selectedShapeId) {
      this.updateShape(this.state.selectedShapeId, { borderWidth });
    }
  };
  handleBorderWidthMouseUp=(borderWidth,oldvalue)=>{
    if (this.state.selectedShapeId) {
      this.updateShape(this.state.selectedShapeId, { borderWidth });
      let command = new ChangeBorderWidthCommandObject(this.undoHandler);
      let id = this.state.selectedShapeId;

      let shape = this.state.shapesMap[id];
      command.execute(shape, borderWidth, id,oldvalue);

    }
  }
  
  changeCurrFillColor = (fillColor) => {
    this.setState({ currFillColor: fillColor });
    if (this.state.selectedShapeId) {
      this.updateShape(this.state.selectedShapeId, { fillColor });
      let command = new ChangeFillColorCommandObject(this.undoHandler);
      let id = this.state.selectedShapeId;
      let shape = this.state.shapesMap[id];
      command.execute(shape, fillColor, id);
    }
    
  };
  
  selectShape = (id) => {
    const { shapesMap, shapes } = this.state
    this.setState({
      selectedShapeId: id,
      
    });
    if (id) {
      const { borderColor, borderWidth, fillColor } = shapesMap[
        shapes.filter((shapeId) => shapeId === id)[0]
      ];
      this.setState({
        currBorderColor: borderColor,
        currBorderWidth: borderWidth,
        currFillColor: fillColor,
      });
    }
  }
  render() {
    const {
      currMode,
      currBorderColor,
      currBorderWidth,
      currFillColor,
      shapes,
      shapesMap,
      selectedShapeId,
    } = this.state;

    // update the context with the functions and values defined above and from state
    // and pass it to the structure below it (control panel and workspace)
    return (

      <React.Fragment>
        <ControlContext.Provider

          value={{
            currMode,
            changeCurrMode: this.changeCurrMode,
            currBorderColor,
            changeCurrBorderColor: this.changeCurrBorderColor,
            currBorderWidth,
            changeCurrBorderWidth: this.changeCurrBorderWidth,
            handleBorderWidthMouseUp:this.handleBorderWidthMouseUp,
            handleMoveShape:this.handleMoveShape,
            currFillColor,
            changeCurrFillColor: this.changeCurrFillColor,

            shapes,
            shapesMap,
            addShape: this.addShape,
            moveShape: this.moveShape,
            selectShape:this.selectShape,
            selectedShapeId,

            deleteSelectedShape: this.deleteSelectedShape,

            undo: this.undo,
            redo: this.redo,
            canRedo: this.canRedo,
            canUndo: this.canUndo,
            
            commandList: this.state.commandList,
          }}
        >
          <ControlPanel />
          <Workspace />
          <CommandHistory />
        </ControlContext.Provider>
      </React.Fragment>
    );
  }
}

export default App;
