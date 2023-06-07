import {Canvas as SkiaCanvas, Circle as SkiaCircle, Path as SkiaPath, SkPath, Skia, useTouchHandler, useValue} from "@shopify/react-native-skia";
import {forwardRef, memo, useEffect, useImperativeHandle, useRef, useState} from "react";
import {randomUUID} from "expo-crypto";

import {BrushRadii, Colours, Diff, EraserRadii, InitialDiff, Tools} from "./constants";
import {findPathIdsIntersectingCircle, mergeDiffs} from "./utilities";
import {useActions, usePath, usePathIds, useSelected, useStore} from "./store";

export type Props = {
	id?: string,
	tool?: Tools,
	style?: object | object[],
	width?: number,
	height?: number,
	onDiff?: (diff: Diff) => any;
	children?: any,
	isEnabled?: boolean,
	foreground?: string,
	background?: string,
	lassoColour?: string,
	brushColour?: string | null,
	brushRadius?: number,
	brushOpacity?: number,
	eraserRadius?: number,
	onIsTouching?: (isTouching: boolean) => any,
	onDiffThrottle?: number;
	shouldDestroyOnUnmount?: boolean;
};



export const Canvas = forwardRef(({
	id: idProp,
	tool = Tools.Brush,
	style: styleProp,
	width: widthProp,
	height: heightProp,
	onDiff,
	children,
	isEnabled = true,
	foreground = Colours.Black,
	background = Colours.Transparent,
	lassoColour = Colours.Purple,
	brushColour = null,
	brushRadius = BrushRadii.Medium,
	brushOpacity = 1,
	eraserRadius = EraserRadii.Medium,
	onIsTouching,
	onDiffThrottle = 1000,
}: Props, ref) => {

	const [isTouching, setIsTouching] = useState(false);
	const [canvasId, setCanvasId] = useState(idProp || randomUUID());
	const [width, setWidth] = useState<number>(widthProp || 1);
	const [diff, setDiff] = useState<Diff>({...InitialDiff});
	const selected = useSelected(canvasId);
	const timeout = useRef();
	const actions = useActions();
	const pathIds = usePathIds(canvasId);
	const touchX = useValue<number>(0);
	const touchY = useValue<number>(0);
	const path = useValue<SkPath>(Skia.Path.Make());



	let isEraser = false;
	let pathRadius = width;
	let pathColour = foreground;
	let pathOpacity = 1;

	switch (tool) {
		case Tools.Brush:
			pathColour = brushColour || foreground;
			pathRadius *= brushRadius;
			pathOpacity = brushOpacity;
			break;
		case Tools.Eraser:
			isEraser = true;
			pathColour = foreground;
			pathRadius *= eraserRadius;
			pathOpacity = 0.3;
			break;
	};



	const selectPaths = (x: number, y: number) => {
		const canvases = useStore.getState().canvases;
		if (!(canvasId in canvases)) return;
		const state = canvases[canvasId];
		const pathIds = findPathIdsIntersectingCircle(state.grid, {
			x: x / width,
			y: y / width,
			r: eraserRadius
		}, state.selected);
		if (Object.keys(pathIds).length > Object.keys(state.selected).length) {
			actions.setSelected(canvasId, pathIds);
		};
	};



	const onLayout = (event: any) => {
		const layout = event.nativeEvent.layout;
		if (layout.width !== width) setWidth(layout.width);
	};



	const onTouch = useTouchHandler({
		onStart: touch => {
			if (!isEnabled) return;
			touchX.current = touch.x;
			touchY.current = touch.y;
			path.current = Skia.Path.Make();
			path.current.moveTo(touch.x, touch.y);
			path.current.lineTo(touch.x, touch.y);
			setIsTouching(true);
			switch (tool) {
				case Tools.Eraser:
					actions.setSelected(canvasId, {});
					selectPaths(touch.x, touch.y);
					break;
			};
		},
		onActive: touch => {
			if (!isEnabled) return;
			touchX.current = touch.x;
			touchY.current = touch.y;
			switch (tool) {
				case Tools.Brush:
					path.current.lineTo(touch.x, touch.y);
					break;
				case Tools.Eraser:
					selectPaths(touch.x, touch.y);
					break;
			};
		},
		onEnd: () => {
			if (!isEnabled) return;
			const next: Diff = {created: {}, updated: {}, deleted: {}};
			switch (tool) {
				case Tools.Brush:
					next.created[randomUUID()] = {
						width,
						path: path.current.toSVGString(),
						colour: brushColour,
						radius: brushRadius,
						opacity: brushOpacity
					};
					break;
				case Tools.Eraser:
					// const canvas = useStore.getState().canvases[canvasId];
					// for (let pathId in canvas.selected) next.deleted[pathId] = canvas.paths[pathId];
					// break;
			};
			setDiff((prev: Diff) => mergeDiffs(prev, next));
			actions.diff(canvasId, next);
			setIsTouching(false);
			path.current = Skia.Path.Make();
		}
	}, [isEnabled, tool, onDiffThrottle, brushColour, brushRadius, brushOpacity, canvasId, width]);



	useEffect(() => {
		const id = idProp || randomUUID();
		actions.createCanvas(id);
		setCanvasId(id);
		if (!idProp) return () => actions.deleteCanvas(id);
	}, [idProp]);



	useEffect(() => {
		if (!onIsTouching) return;
		onIsTouching(isTouching);
	}, [isTouching]);



	useEffect(() => {
		if (!onDiff) return;
		clearTimeout(timeout.current);
		if (Object.keys(diff.created).length === 0 && Object.keys(diff.updated).length === 0 && Object.keys(diff.deleted).length === 0) return;
		// @ts-ignore
		timeout.current = setTimeout(() => {
			onDiff(diff);
			setDiff({...InitialDiff});
		}, 500);
	}, [diff]);



	useImperativeHandle(ref, () => ({
		diff: (diff: Diff) => actions.diff(canvasId, diff)
	}), [canvasId]);



	return (
		<SkiaCanvas
			onTouch={onTouch}
			onLayout={onLayout}
			style={[{
				width: widthProp || width,
				height: heightProp || "100%",
				backgroundColor: background
			}, ...(Array.isArray(styleProp) ? styleProp : [styleProp])]}>
			{pathIds.map((id: string) => {
				const isSelected = id in selected;
				if (isSelected && tool === Tools.Eraser) return null;
				return (
					<MemoisedPath
						id={id}
						key={id}
						width={width}
						canvasId={canvasId}
						foreground={foreground}
					/>
				);
			})}
			<SkiaPath
				path={path}
				style="stroke"
				strokeCap="round"
				strokeJoin="round"
				color={pathColour}
				strokeWidth={pathRadius * 2}
				opacity={isEraser || !isTouching ? 0 : pathOpacity}
			/>
			<SkiaCircle
				cx={touchX}
				cy={touchY}
				r={pathRadius}
				color={pathColour}
				opacity={isTouching ? pathOpacity : 0}
			/>
			{children}
		</SkiaCanvas>
	);
});



export const MemoisedCanvas = memo(Canvas);
export const MemoisedPath = memo(({
	id,
	width,
	canvasId,
	foreground,
}: {
	id: string,
	width: number,
	canvasId: string,
	foreground: string,

}) => {
	const path = usePath(canvasId, id);
	if (!path) return;
	return (
		<SkiaPath
			style="stroke"
			path={path.path}
			strokeCap="round"
			strokeJoin="round"
			opacity={path.opacity}
			color={path.colour || foreground}
			transform={[{scale: width / path.width}]}
			strokeWidth={path.radius * path.width * 2}
			strokeMiter={path.radius * path.width * 2}
		/>
	)
});