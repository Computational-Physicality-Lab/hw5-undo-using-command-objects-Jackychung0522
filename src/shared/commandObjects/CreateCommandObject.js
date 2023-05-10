import { genId } from "../util";
import CommandObject from "./CommandObject";
/*
 * top level definition of what Command Objects
 * should be like. This is basically an abstract class that particular
 * command objects should extend
 */
export default class CreateCommandObject extends CommandObject{
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
    execute() {
       
        if (this.addToUndoStack) {
        
        this.undoHandler.registerExecution(this);
        console.log(this.targetObject);
        //undoStack.push(this);
      }
        
    }
  
    /* override to undo the operation of this command.
     * this should be a NEW command object so it can be put on the undo stack.
     * execute will only be called if addToUndoStack was true, so it must
     * be an undoable operation. Be sure to register this
     * object on the undo stack.
     */
    undo() {
        //this.undoHandler.selectShape(undefined);
        this.undoHandler.selectShape(undefined);
        this.undoHandler.remove(this.targetObject);

    }
  
    /* override to redo the operation of this command, which means to
     * undo the undo. This should ONLY be called if the immediate
     * previous operation was an Undo of this command. Anything that
     * can be undone can be redone, so there is no need for a canRedo.
     */
    redo() {
        this.undoHandler.addShape(this.targetObject, this.targetObject.id);

        this.undoHandler.selectShape(this.targetObject.id);
        //this.undoHandler.selectShape(this.newValue);
    }
  
    /* override to return true if this operation can be repeated in the
     * current context. NOTE: Repeat is extra credit.
     */
    canRepeat(selectedObj) {
        return selectedObj !== null;
      }    
  
    /* override to execute the operation again, this time possibly on
     * a new object. Thus, this typically uses the same value but a new
     * targetObject. Be sure to register this
     * object on the undo stack.  NOTE: Repeat is extra credit.
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
        return `Create ${this.targetObject.type} ${this.targetObject.id}`;
      }
  }
  