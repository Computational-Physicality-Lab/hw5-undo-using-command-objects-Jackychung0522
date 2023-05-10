import CommandObject from "./CommandObject";

export default class ChangeFillColorCommandObject extends CommandObject {
  constructor(undoHandler,selectedObj) {
    super(undoHandler, true);
    this.targetObject=selectedObj;
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
  execute(selectedObj, fillColor,id) {
   
    if (selectedObj !== undefined) {
      this.targetObject = selectedObj; // global variable for selected
      this.oldValue = selectedObj.fillColor; // object's current color
      this.newValue = fillColor // get the color widget's current color
      selectedObj.fillColor = this.newValue; // actually change

      // Note that this command object must be a NEW command object so it can be
      // registered to put it onto the stack
      this.undoHandler.updateShape(id, { fillColor});
      if (this.addToUndoStack) {
        this.undoHandler.registerExecution(this);
        //undoStack.push(this);
      }
    }
  }

  /* override to undo the operation of this command
   */
  undo() {
    this.targetObject.fillColor = this.oldValue;
    this.undoHandler.updateShape(this.targetObject.id, { fillColor:this.targetObject.fillColor },true);
    this.undoHandler.changeCurrMode("select");
    //this.undoHandler.selectShape(undefined);
   //this.undoHandler.changeCurrFillColor(this.oldValue);
   
    // maybe also need to fix the palette to show this object's color?
  }

  /* override to redo the operation of this command, which means to
   * undo the undo. This should ONLY be called if the immediate
   * previous operation was an Undo of this command. Anything that
   * can be undone can be redone, so there is no need for a canRedo.
   */
  redo() {
    this.targetObject.fillColor = this.newValue;
    this.undoHandler.updateShape(this.targetObject.id, { fillColor:this.newValue },true);
    //this.undoHandler.changeCurrFillColor(this.newValue);
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
  displayCommandContent() {
    return `Change ${this.targetObject.type} fill color to ${this.newValue}`;
  }
}

