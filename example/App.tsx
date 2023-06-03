import {Canvas} from "@harrisontaee/react-native-canvas";
import {StyleSheet, View} from "react-native";

const App = () => (
	<View style={Styles.container}>
		<Canvas
			width={300}
			height={300}
			background="#ff0000"
		/>
	</View>
);



const Styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#0000ff",
		alignItems: "center",
		justifyContent: "center"
	},
});



export default App;
