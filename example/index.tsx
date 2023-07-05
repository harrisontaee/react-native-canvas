import {BrushRadii, Canvas, Colours, EraserRadii, Props, Tools} from "@harrisontaee/react-native-canvas";
import {Circle, CircleButton, Icon, Rectangle} from "@harrisontaee/react-native";
import {Picture, Skia, createPicture} from "@shopify/react-native-skia";
import {SafeAreaProvider, initialWindowMetrics, useSafeAreaInsets} from "react-native-safe-area-context";
import {StyleSheet, View} from "react-native";
import {registerRootComponent} from "expo";
import {useMemo, useReducer, useState} from "react";

import {CELLS_PER_ROW} from '../src/constants';

const InitialProps = {
	tool: Tools.Brush,
	foreground: Colours.Black,
	background: "transparent",
	brushColour: null,
	brushRadius: BrushRadii.Medium,
	eraserRadius: EraserRadii.Medium,
};





const App = () => {
	const [layout, setLayout] = useState({width: 1, height: 1});
	const [props, setProps] = useReducer((prev: Props, next: any) => ({...prev, ...next}), InitialProps);
	return (
		<SafeAreaProvider initialMetrics={initialWindowMetrics}>
			<View
				style={Styles.Container}
				onLayout={event => setLayout(event.nativeEvent.layout)}>
				{/* <Grid {...layout} /> */}
				<Canvas {...layout} {...props}>
					<Grid {...layout} />
				</Canvas>
				<Toolbar {...layout} {...props} setProps={setProps} />
			</View>
		</SafeAreaProvider>
	);
};





const Grid = ({width, height}: {width: number, height: number}) => {
	const picture = useMemo(() => createPicture({x: 0, y: 0, width, height}, canvas => {
		const paint = Skia.Paint();
		const cellSize = width / CELLS_PER_ROW;
		paint.setColor(Skia.Color(`${Colours.Black}0e`));
		for (let row = 0; row <= Math.ceil(height / cellSize); row += 0.5) {
			const cy = row * cellSize;
			for (let col = 0; col <= CELLS_PER_ROW; col += 0.5) {
				canvas.drawCircle(col * cellSize, cy, 2.5, paint);
			};
		};
	}), [width, height]);

	return <Picture picture={picture} />;
};




const BUTTON_SIZE = 40;
const Divider = ({size = 10}: {size?: number}) => <View style={{width: size, height: size}} />;
const Toolbar = ({
	tool,
	width,
	setProps,
	foreground,
	brushColour,
	brushRadius,
	brushOpacity,
	eraserRadius,
}: Props & {
	setProps: (props: Props) => void
}) => {
	const insets = useSafeAreaInsets();

	let maxRadius,
		 isEraser = false,
		 isBrush = false,
		 colours = [null, Colours.Blue, Colours.Red],
		 radii = [];

	switch (tool) {
		case Tools.Brush:
			maxRadius = BrushRadii.Large;
			isBrush = true;
			radii = [BrushRadii.Small, BrushRadii.Medium, BrushRadii.Large];
			break;
		case Tools.Eraser:
			maxRadius = EraserRadii.Large;
			isEraser = true;
			radii = [EraserRadii.Small, EraserRadii.Medium, EraserRadii.Large];
			break;
	};
	

	
	return (
		<View style={{
			...Styles.Toolbar,
			width: width - 40,
			bottom: insets.bottom + 10,
		}}>
			{radii.map((item: number) => {
				const isSelected = tool === Tools.Brush ? brushRadius === item : tool === Tools.Eraser && eraserRadius === item;
				const colour = isBrush ? brushColour || foreground : `${foreground}80`;
				const radius = 7.5 * item / maxRadius;
				return (
					<CircleButton
						size={BUTTON_SIZE}
						key={`radius-${radius}`}
						colour={isSelected ? Colours.White : "transparent"}
						onPress={() => setProps({[isBrush ? "brushRadius" : "eraserRadius"]: item})}
						style={{
							...Styles.Button,
							...(isSelected ? Styles.SelectedButton : null)
						}}>
						<Rectangle
							width={22}
							height={radius}
							colour={colour}
							style={{
								borderRadius: radius / 2,
								transform: [{rotate: "-45deg"}]
							}}
						/>
					</CircleButton>
				);
			})}
			<Divider />
			{colours.map((item: string | null) => {
				const isSelected = tool === Tools.Brush && brushColour === item;
				const colour = item || foreground;
				return (
					<CircleButton
						size={BUTTON_SIZE}
						key={`colour-${colour}`}
						colour={isSelected ? Colours.White : "transparent"}
						style={{
							...Styles.Button,
							...(isSelected ? Styles.SelectedButton : null)
						}}
						onPress={() => setProps({
							tool: Tools.Brush,
							brushColour: item,
						})}>
						<Circle
							size={22}
							colour={colour}
						/>
					</CircleButton>
				);
			})}
			<Divider />
			<CircleButton
				size={BUTTON_SIZE}
				onPress={() => setProps({tool: Tools.Eraser})}
				colour={isEraser ? Colours.White : "transparent"}
				style={{
					...Styles.Button,
					...(isEraser ? Styles.SelectedButton : null)
				}}>
				<Icon
					size={23}
					boxWidth={655}
					boxHeight={488}
					translateX={0.025}
					translateY={-0.075}
					colour={isEraser ? foreground : `${foreground}80`}
					path="M630.999 441.067H343.466l169.866-169.854c18.459-18.458 28.599-42.932 28.527-68.926-.047-25.886-10.208-50.198-28.505-68.36L409.036 29.38c-37.917-37.917-99.62-37.917-137.533 0L36.476 264.42c-37.666 37.937-37.64 99.511.068 137.213l39.421 39.422H24.33c-12.895 0-23.333 10.437-23.333 23.333 0 12.896 10.438 23.333 23.333 23.333h606.667c12.896 0 23.333-10.437 23.333-23.333 0-12.901-10.437-23.333-23.333-23.333l.003.012zM69.546 297.347l61.864-61.87 175.826 175.827-29.76 29.755-135.506.005-72.416-72.416c-19.574-19.599-19.552-51.588 0-71.298l-.008-.003zm306.48-235L480.411 166.96c9.526 9.432 14.765 22.011 14.787 35.412.047 13.49-5.24 26.23-14.86 35.844L340.231 378.311 164.404 202.484 304.498 62.377c19.76-19.754 51.864-19.688 71.53-.026l-.002-.005z"
				/>
			</CircleButton>
		</View>
	);
};



const Styles = StyleSheet.create({
	Container: {
		flex: 1,
		backgroundColor: Colours.White,
		alignItems: "center",
		justifyContent: "center"
	},
	Canvas: {
		borderWidth: 1,
		borderColor: "yellow"
	},
	Toolbar: {
		position: "absolute",
		height: 70,
		maxWidth: 500,
		borderRadius: 35,
		backgroundColor: Colours.White,
		shadowColor: Colours.Black,
		shadowOffset: {width: 0, height: 0},
		shadowOpacity: 0.15,
		shadowRadius: 10,
		paddingHorizontal: 15,
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "space-between",
	},
	Grid: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
	GridLine: {
		position: "absolute",
		backgroundColor: `${Colours.Black}0a`
	},
	Button: {
		borderWidth: 2,
		borderColor: "transparent"
	},
	SelectedButton: {
		shadowColor: "black",
		shadowOffset: {width: 0, height: 0},
		shadowOpacity: 0.15,
		shadowRadius: 2.5,
	}
});




registerRootComponent(App);