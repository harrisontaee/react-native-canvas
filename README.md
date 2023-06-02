# React Native Canvas

A simple, performant and flexible drawing tool for React Native built with [react-native-skia](https://github.com/Shopify/react-native-skia) and [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/docs/). ***Not Ready for production... yet***.

## Install
```bash
yarn add @harrisontaee/react-native-canvas
```

Note that this will not work with Expo Go as it depends on [reanimated v3.]() To use this library with Expo, create your own [development builds](https://docs.expo.dev/develop/development-builds/introduction/) and follow the instructions [here](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation) to install and configure reanimated.

## Import
```tsx
/* Component */
import {Canvas} from "@harrisontaee/react-native-canvas";

/* Interfaces */
import {Diff, Path} from "@harrisontaee/react-native-canvas";

/* Enums */
import {Colours, Tools, BrushRadii, EraserRadii} from "@harrisontaee/react-native-canvas";
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
   brushOpacity={0.75}
   brushColour={Colours.Black}
   brushRadius={BrushRadii.Medium}
   lassoColour={Colours.Purple}
   eraserRadius={EraserRadii.Medium}

   /** onDiff
    * Called when the user erases, draws or lassoes
    * Will not be called when using the Imperative API (see below)
    * Returns a Diff object
    */
   onDiff={console.log}
   onDiffThrottle={1000}

   /** id
    * If supplied, the canvas` local state will be cached and thus
    * restored when the component is re-mounted. If not, the canvas
    * will be destroyed when the component is unmounted.
    */
   id="canvas-0"
/>
```

## Imperative Manipulation
Useful for when receiving or sending data to a remote or local database. Also useful for undo/redo functionality.
```tsx
/* Import the hook */
import {useRef} from "react";

/* Declare the reference */
const ref = useRef();

/* Extract data from the canvas */
const paths = ref.current.getPaths();

/* Imperatively manipulate the canvas */
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