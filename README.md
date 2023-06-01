# React Native Canvas

A simple, performant and flexible drawing tool for React Native built with [react-native-skia](https://github.com/Shopify/react-native-skia) and [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/docs/).

## Installation
```bash
yarn add @harrisontaee/react-native-canvas
```

## Imports
```tsx
/* Component */
import {Canvas} from "@harrisontaee/react-native-canvas";

/* Interfaces */
import {Diff, Path} from "@harrisontaee/react-native-canvas";

/* Enums */
import {Colours, Tools, BrushRadii, EraserRadii} from "@harrisontaee/react-native-canvas";
```

## Usage
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
/>
```

## Manipulate Imperatively
```tsx
/* Import the hook */
import {useRef} from "react";

/* Declare the reference */
const ref = useRef();

/* Imperatively manipulate the canvas */
ref.current.getPaths();
ref.current.clearPaths();
ref.current.removePaths(["path-0"]);
ref.current.addPaths([{
   id: "path-1",
   path: "M20,20 L40,20",
   width: 300,
   radius: 0.05,
   colour: "#000000",
   opacity: 0.75,
}]);

/* Forward the reference to the canvas */
return <Canvas ref={ref} />;
```