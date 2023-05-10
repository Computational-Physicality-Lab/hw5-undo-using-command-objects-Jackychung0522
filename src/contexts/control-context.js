import { createContext } from "react";

// create a context with default values
const controlContext = createContext({
  currCommand: -1,
  currMode: "",
  changeCurrMode: () => {},
  currBorderColor: "",
  changeCurrBorderColor: () => {},
  currBorderWidth: 1,
  changeCurrBorderWidth: () => {},
  currFillColor: "",
  changeCurrFillColor: () => {},

  shapes: [],
  shapesMap: {},
  addShape: () => {},
  moveShape: () => {},
  selectedShapeId: "", // a string or undefined
  selectShape: () => {},
  deleteSelectedShape: () => {},
  
  undo: () => {},
  redo: () => {},
  commandList: [],
  
});

export default controlContext;
