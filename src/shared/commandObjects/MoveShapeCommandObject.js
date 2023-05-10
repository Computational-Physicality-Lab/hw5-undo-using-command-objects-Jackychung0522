import CommandObject from "./CommandObject";

export default class MoveShapeCommandObject extends CommandObject {
  constructor(undoHandler,selectedObj,oldValue,newValue) {
    
    super(undoHandler, true);
    this.targetObject=selectedObj;
    this.oldValue=oldValue;
    this.newValue=newValue;
    console.log("new command");
  }

  /* override to return true if this command can be executed,
   *  e.g., if there is an object selected
   */
  canExecute(selectedObj) {
    return selectedObj !== null; // global variable for selected
  }

  /* override to execute the action of this command.
   * pass in false for addToUndoStack if this is a command which is NOT
   * put on the undo stack, like Copy, or a change of selection or Save
   */
  execute() {
    
    if (this.targetObject !== null) {
      //this.undoHandler.updateShape(this.targetObject.id, this.newValue,true);
      if (this.addToUndoStack) {
        this.undoHandler.registerExecution(this);
        //undoStack.push(this);
      }
    }
  }

  /* override to undo the operation of this command
   */
  undo() {
    console.log("oldValue",this.oldValue);
    console.log("newValue",this.targetObject.initCoords.x);
    this.undoHandler.updateShape(this.targetObject.id, {initCoords: {
      x: this.targetObject.initCoords.x,
      y: this.targetObject.initCoords.y,
    },
    finalCoords: {
      x: this.targetObject.finalCoords.x,
      y: this.targetObject.finalCoords.y
    }});

   
    // maybe also need to fix the palette to show this object's color?
  }

  /* override to redo the operation of this command, which means to
   * undo the undo. This should ONLY be called if the immediate
   * previous operation was an Undo of this command. Anything that
   * can be undone can be redone, so there is no need for a canRedo.
   */
  redo() {
    
    this.undoHandler.updateShape(this.targetObject.id,{initCoords: {
      x: this.targetObject.initCoords.x+this.newValue.x-this.oldValue.x,
      y: this.targetObject.initCoords.y+this.newValue.y-this.oldValue.y,
    },
    finalCoords: {
      x: this.targetObject.finalCoords.x+this.newValue.x-this.oldValue.x,
      y: this.targetObject.finalCoords.y+this.newValue.y-this.oldValue.y
    }});
   
    // maybe also need to fix the palette to show this object's color?
  }

  /* override to return true if this operation can be repeated in the
   * current context
   */
  canRepeat(selectedObj) {
    return selectedObj !== null;
  }

  /* override to execute the operation again, this time possibly on
   * a new object. Thus, this typically uses the same value but a new
   * selectedObject.
   */
  repeat(selectedObj) {
    if (selectedObj !== null) {
      this.targetObject = selectedObj; // get new selected obj
      this.oldValue = selectedObj.fillColor; // object's current color
      // no change to newValue since reusing the same color
      selectedObj.fillColor = this.newValue; // actually change

      // Note that this command object must be a NEW command object so it can be
      // registered to put it onto the stack
      if (this.addToUndoStack) this.undoHandler.registerExecution({...this});
    }
  }
  displayCommandContent(){
    return `Move ${this.targetObject.type}`;
  }
}
