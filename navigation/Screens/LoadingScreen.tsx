import { View, ActivityIndicator, StyleSheet, StatusBar } from "react-native";

export default function LoadingScreen() {
    return (
        <View style={styles.loadingContainer}>
        </View>
    );
}

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
});