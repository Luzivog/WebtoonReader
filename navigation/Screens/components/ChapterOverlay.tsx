import { View, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ChapterScreenNavigationProp, ChapterScreenRouteProp } from "../../stacks/WebtoonStack";
import { config } from "../../config";

export default function ChapterScreenOverlay({ navigation, route }: {
    navigation: ChapterScreenNavigationProp,
    route: ChapterScreenRouteProp
}) {

    return (
        <View style={styles.overlay}>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="list" style={[styles.icon, {marginTop: config.StatusBarHeight}]} />
                </TouchableOpacity>
            </View>
            <View style={styles.bottomBar}>
                <TouchableOpacity onPress={() => { /* Add left arrow functionality here */ }}>
                    <Ionicons name="caret-back" style={styles.icon}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { /* Add right arrow functionality here */ }}>
                    <Ionicons name="caret-forward" style={styles.icon}/>
                </TouchableOpacity>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'space-between',
    },
    topBar: {
        height: config.StatusBarHeight + 50,
        backgroundColor: '#252525',
        justifyContent: 'center',
        paddingLeft: 15,
    },
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        backgroundColor: '#252525',
        paddingLeft: 15,
        paddingRight: 15,
    },
    clickableArea: {
        position: 'absolute',
        width: "100%",
        height: "100%",
        backgroundColor: 'transparent',
    },
    icon: {
        fontSize: 35,
        color: 'white'
    }
});
