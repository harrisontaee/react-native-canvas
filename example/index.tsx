import {BrushRadii, Canvas, Colours, EraserRadii, Props, Tools} from "@harrisontaee/react-native-canvas";
import {Button} from "@harrisontaee/react-native";
import {SafeAreaProvider, initialWindowMetrics, useSafeAreaInsets} from "react-native-safe-area-context";
import {StyleSheet, View} from "react-native";
import {registerRootComponent} from "expo";
import {useReducer, useState} from "react";

import {CELLS_PER_ROW} from '../src/constants';

const InitialProps = {
	tool: Tools.Brush,
	brushColour: Colours.Purple,
	brushRadius: BrushRadii.Medium,
	eraserRadius: EraserRadii.Medium,
};

const App = () => {
	const [layout, setLayout] = useState({width: 1, height: 1});
	const [props, setProps] = useReducer((prev: Props, next: any) => ({...prev, ...next}), InitialProps);
	return (
		<SafeAreaProvider initialMetrics={initialWindowMetrics}>
			<View
				style={Styles.container}
				onLayout={event => setLayout(event.nativeEvent.layout)}>
				<Grid {...layout} />
				<Canvas {...layout} {...props} />
				<Toolbar {...layout} {...props} setProps={setProps} />
			</View>
		</SafeAreaProvider>
	);
};



const Grid = ({width, height}: {width: number, height: number}) => {
	const size = width / CELLS_PER_ROW;
	const cols = CELLS_PER_ROW - 1;
	const rows = Math.ceil(height / size);
	return (
		<View style={Styles.grid}>
			{Array(cols).fill(null).map((_, i) => (
				<View
					key={`col-${i}`}
					style={{
						...Styles.gridLine,
						height,
						width: 1,
						left: (i + 1) * size,
					}}
				/>
			))}
			{Array(rows).fill(null).map((_, i) => (
				<View
					key={`row-${i}`}
					style={{
						...Styles.gridLine,
						height: 1,
						width,
						top: (i + 1) * size,
					}}
				/>
			))}
		</View>
	);
};



const Toolbar = ({
	tool,
	width,
	setProps,
	brushColour,
	brushRadius,
	brushOpacity,
	eraserRadius,
}: Props & {
	setProps: (props: Props) => void
}) => {
	const insets = useSafeAreaInsets();
	return (
		<View style={{
			...Styles.toolbar,
			width: width - 40,
			bottom: insets.bottom + 10,
		}}>

		</View>
	);
};



const ToolButton = ({
	isSelected,
}: {isSelected?: boolean}) => {};



const Styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colours.White,
		alignItems: "center",
		justifyContent: "center"
	},
	canvas: {
		borderWidth: 1,
		borderColor: "yellow"
	},
	toolbar: {
		position: "absolute",
		height: 70,
		maxWidth: 500,
		borderRadius: 35,
		backgroundColor: Colours.White,
		shadowColor: Colours.Black,
		shadowOffset: {width: 0, height: 0},
		shadowOpacity: 0.15,
	},
	grid: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
	gridLine: {
		position: "absolute",
		backgroundColor: `${Colours.Black}0a`
	},
});




registerRootComponent(App);