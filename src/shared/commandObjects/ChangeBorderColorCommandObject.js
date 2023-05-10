import CommandObject from "./CommandObject";

export default class ChangeBorderColorCommandObject extends CommandObject {
  constructor(undoHandler) {
    super(undoHandler, true);
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
  execute(selectedObj, borderColor,id) {
    //this.undoHandler.changeCurrBorderColorState(borderColor);
    if (selectedObj !== null) {
      this.targetObject = selectedObj; // global variable for selected
      this.oldValue = selectedObj.borderColor; // object's current color
      this.newValue = borderColor; // get the color widget's current color
      selectedObj.borderColor = this.newValue; // actually change

      // Note that this command object must be a NEW command object so it can be
      // registered to put it onto the stack
      this.undoHandler.updateShape(id, { borderColor });
      if (this.addToUndoStack) {
        this.undoHandler.registerExecution(this);
        //undoStack.push(this);
      }
    }
  }

  /* override to undo the operation of this command
   */
  undo() {
    this.targetObject.borderColor  = this.oldValue;
    this.undoHandler.updateShape(this.targetObject.id, { borderColor:this.targetObject.borderColor },true);
   this.undoHandler.changeCurrMode("select")
    // maybe also need to fix the palette to show this object's color?
  }

  /* override to redo the operation of this command, which means to
   * undo the undo. This should ONLY be called if the immediate
   * previous operation was an Undo of this command. Anything that
   * can be undone can be redone, so there is no need for a canRedo.
   */
  redo() {
    this.targetObject.borderColor = this.newValue;
    this.undoHandler.updateShape(this.targetObject.id, { borderColor:this.newValue },true);
    
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
      this.oldValue = selectedObj.borederColor; // object's current color
      // no change to newValue since reusing the same color
      selectedObj.borderColor = this.newValue; // actually change

      // Note that this command object must be a NEW command object so it can be
      // registered to put it onto the stack
      if (this.addToUndoStack) this.undoHandler.registerExecution({...this});
    }
  }
  displayCommandContent() {
    return `Change ${this.targetObject.type} border color to ${this.newValue}`;
  }
}
