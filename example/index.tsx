import Svg, {Path} from "react-native-svg";
import {Button, Circle, CircleButton, Icon, Rectangle} from "@harrisontaee/react-native";
import {Canvas, Colours, Props, Tools} from "@harrisontaee/react-native-canvas";
import {Picture, Skia, createPicture} from "@shopify/react-native-skia";
import {Pressable, StyleSheet, View} from "react-native";
import {SafeAreaProvider, initialWindowMetrics, useSafeAreaInsets} from "react-native-safe-area-context";
import {registerRootComponent} from "expo";
import {useMemo, useReducer, useState} from "react";

import {CELLS_PER_ROW} from '../src/constants';

const merge = (prev: any, next: any) => ({...prev, ...next});
const InitialProps = {
	tool: Tools.Brush,
	foreground: Colours.Black,
	background: "transparent",
	brushColour: Colours.Blue,
	brushRadius: 0.0075,
	eraserRadius: 0.03,
};





const App = () => {
	const [layout, setLayout] = useState({width: 1, height: 1});
	const [props, setProps] = useReducer(merge, InitialProps);
	return (
		<SafeAreaProvider initialMetrics={initialWindowMetrics}>
			<View
				style={Styles.container}
				onLayout={event => setLayout(event.nativeEvent.layout)}>
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
				canvas.drawCircle(col * cellSize, cy, 2, paint);
			};
		};
	}), [width, height]);

	return <Picture picture={picture} />;
};





const Pen = ({
	size = 70,
	colour = Colours.Black,
	strokeWidth = 20,
	strokeColour = Colours.Black,
	...props
}) => (
	<Pressable {...props}>
		<Svg
			width={size * 265 / 574}
			height={size}
			viewBox="0 0 265 574"
			fill="none">
			<Path
				d="M10 573.12V508.125C10 508.125 11.8759 450.806 17.5 414.625C22.9851 379.337 38 325.625 38 325.625L91.5 128.125H172.5L225.5 325.625C225.5 325.625 240.821 379.322 246.5 414.625C252.318 450.791 254.5 508.125 254.5 508.125V573.12"
				stroke={strokeColour}
				strokeWidth={strokeWidth}
			/>
			<Path
				d="M180.67 119H84.3496L113.24 15.4983C118.682 -3.99784 146.323 -3.99935 151.767 15.4962L180.67 119Z"
				fill={colour}
			/>
		</Svg>
	</Pressable>
);





const Highlighter = ({
	size = 60,
	colour = Colours.Black,
	strokeWidth = 20,
	strokeColour = Colours.Black,
	...props
}) => (
	<Pressable {...props}>
		<Svg
			width={size * 310 / 489}
			height={size}
			viewBox="0 0 310 489"
			fill="none">
			<Path
				d="M10 489V357.5C18.2923 307.458 33.6646 286.682 77.9653 253.517C79.2318 252.569 80 251.067 80 249.485V129C80 123.477 84.4771 119 90 119H220C225.523 119 230 123.477 230 129V249.846C230 251.506 230.845 253.069 232.214 254.007C279.841 286.645 294.145 310.499 300 364V489"
				stroke={strokeColour}
				strokeWidth={strokeWidth}
			/>
			<Path
				d="M90 54.4632V109H220.5V14.7743C220.5 5.11873 210.95 -1.63971 201.856 1.6065C162.031 15.8234 134.996 26.2837 97.7537 42.5869C93.0405 44.6501 90 49.3182 90 54.4632Z"
				fill={colour}
			/>
		</Svg>
	</Pressable>
);





const Eraser = ({
	size = 50,
	width = 20,
	colour = Colours.Black,
	...props
}) => (
	<Pressable {...props}>
		<Svg
			width={size * 312 / 381}
			height={size}
			viewBox="0 0 312 381"
			fill="none">
			<Path
				d="M11 380.5V190.5C11 179.454 19.9543 170.5 31 170.5H31.5M301.5 380.5V190.5C301.5 179.454 292.546 170.5 281.5 170.5H280.5M31.5 170.5V31C31.5 19.9543 40.4543 11 51.5 11H187.532C192.649 11 197.57 12.9607 201.285 16.4787L274.253 85.5833C278.241 89.3604 280.5 94.6116 280.5 100.105V170.5M31.5 170.5H280.5"
				stroke={colour}
				strokeWidth={width}
			/>
		</Svg>
	</Pressable>
);





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
	const [isHighlighter, setIsHighlighter] = useState(false);
	const [highlighter, setHighlighter] = useReducer(merge, {
		tool: Tools.Brush,
		brushColour: Colours.Yellow,
		brushRadius: 0.05,
		brushOpacity: 0.4
	});

	const [pen, setPen] = useReducer(merge, {
		tool: Tools.Brush,
		brushColour: InitialProps.brushColour,
		brushRadius: InitialProps.brushRadius,
		brushOpacity: 1
	});
	

	
	return (
		<View style={{
			...Styles.toolbar,
			bottom: insets.bottom + 10,
		}}>
			<View style={Styles.tools}>
				<Pen
					colour={pen.brushColour || foreground}
					style={{opacity: tool === Tools.Brush && !isHighlighter ? 1 : 0.3}}
					onPress={() => {
						setProps(pen);
						setIsHighlighter(false);
					}}
				/>
				<Highlighter
					colour={highlighter.brushColour || foreground}
					style={{
						marginHorizontal: 10,
						opacity: tool === Tools.Brush && isHighlighter ? 1 : 0.3
					}}
					onPress={() => {
						setProps(highlighter);
						setIsHighlighter(true);
					}}
				/>
				<Eraser
					style={{opacity: tool === Tools.Eraser ? 1 : 0.3}}
					onPress={() => setProps({tool: Tools.Eraser})}
				/>
			</View>
			<View style={{width: 30}} />
			<View style={Styles.colours}>
				{[null, Colours.Blue, Colours.Green, Colours.Purple, Colours.Red, Colours.Yellow].map(colour => (
					<CircleButton
						size={30}
						key={colour}
						onPress={() => {
							setProps({brushColour: colour});
							if (isHighlighter) setHighlighter({brushColour: colour});
							else setPen({brushColour: colour});
						}}
						style={{
							margin: 2.5,
							borderWidth: 2,
							borderColor: (tool === Tools.Brush && colour === brushColour) ? colour || foreground : "transparent"
						}}>
						<View style={{
							width: 22,
							height: 22,
							borderRadius: 11,
							backgroundColor: colour || foreground
						}} />
					</CircleButton>
				))}
			</View>
		</View>
	);
};



const Styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colours.White,
		alignItems: "center",
		justifyContent: "center"
	},
	toolbar: {
		position: "absolute",
		height: 90,
		borderRadius: 45,
		backgroundColor: Colours.White,
		shadowColor: Colours.Black,
		shadowOffset: {width: 0, height: 0},
		paddingHorizontal: 30,
		shadowOpacity: 0.15,
		shadowRadius: 10,
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "space-around",
	},
	tools: {
		height: "100%",
		flexDirection: "row",
		alignItems: "flex-end",
	},
	tool: {
		marginHorizontal: 5,
	},
	button: {
		backgroundColor: Colours.White,
		shadowColor: Colours.Black,
		shadowOffset: {width: 0, height: 0},
		shadowOpacity: 0.15,
		shadowRadius: 10,
	},
	colours: {
		width: 110,
		height: "100%",
		flexDirection: "row",
		alignContent: "center",
		justifyContent: "center",
		flexWrap: "wrap",
	},
});




registerRootComponent(App);