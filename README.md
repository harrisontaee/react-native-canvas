# React Native Canvas

A simple, performant and flexible drawing tool for React Native built with [react-native-skia](https://github.com/Shopify/react-native-skia) **🚨 Not ready for production 🚨**.

![](demo.gif)

## Installation
```bash
yarn add @harrisontaee/react-native-canvas # OR npm install @harrisontaee/react-native-canvas
```

## Example
```bash
cd example
yarn # OR npm install
```

## Imports
```tsx
/* Component */
import {Canvas} from "@harrisontaee/react-native-canvas";

/* Interfaces */
import {Diff, Path} from "@harrisontaee/react-native-canvas";

/* Enums */
import {Colours, Tools} from "@harrisontaee/react-native-canvas";

/* Methods */
export {mergeDiffs} from "./utilities";
```

## Usage
Render the canvas with all or none of the following props and it's ready to go out of the box (state management is handled internally).
```tsx
<Canvas
   /* Canvas styling */
   width={375}
   height={375}
   style={style}
   foreground={Colours.Black}
   background={Colours.White}
   
   /* Drawing tools */
   isEnabled={true}
   tool={Tools.Brush}
   eraserRadius={0.03}
   brushOpacity={0.75}
   brushRadius={0.005}
   brushColour={Colours.Black}
   lassoColour={Colours.Purple}

   /** onDiff
    * Gives the user a 'snapshot' of what's changed on the canvas
    * since the last diff. This can be throttled using the
    * onDiffThrottle prop.
    * Note that this will not be called when imperative
    * methods are used (see `Imperative Manipulation` below)
    * 
    * returns a Diff object: {
    *    created: {[pathId: string]: Path},
    *    updated: {[pathId: string]: Path},
    *    deleted: {[pathId: string]: Path}
    * }
    */
   onDiff={console.log}
   onDiffThrottle={1000}

   /** id
    * If supplied, the canvas` local state will be cached and thus
    * restored when the component is re-mounted. If not, the canvas
    * data will be destroyed once unmounted.
    */
   id="canvas-0"
/>
```

## Imperative Manipulation
Useful for when receiving or sending data to a remote or local database. Also useful for undo/redo functionality.
```tsx
/* Import the hook */
import {useRef} from "react";
```
```tsx
/* Declare the reference */
const ref = useRef();

/* Extract data from the canvas */
const paths = ref.current.getPaths();

/**
 * Imperatively manipulate tha canvas
 * (This will not trigger the onDiff callback)
 */
ref.current.diff({
   created: { // creates new paths on the canvas
      "path-2": {
         path: "M 0 0 L 100 100",
         width: 375,
         colour: Colours.Black,
         radius: 0.02,
         opacity: 0.75
      },
   },
   updated: { // updates existing paths on the canvas
      "path-1": {
         path: "M 50 50 L 200 200",
         width: 390,
         radius: 0.05,
         opacity: 1
      },
   },
   deleted: { // deletes paths from the canvas
      "path-0": {
         path: "M150 150 L 250 250",
         width: 420,
         radius: 0.02,
         opacity: 1
      },
   },
})

/* Forward the reference to the canvas */
return <Canvas ref={ref} />;
```