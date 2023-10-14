import * as React from 'react';
import { View, Text, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const DetailItem = ({ icon, text }: { icon: string, text: string }) => (
    <View style={styles.detailItem}>
        <Ionicons name={icon} style={styles.detailIcon} size={24} />
        <Text style={styles.detailText}>{text}</Text>
    </View>
);

const styles = StyleSheet.create({
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailIcon: {
        marginRight: 8,
        color: 'white',
    },
    detailText: {
        color: 'white',
        fontSize: 16,
    },
});

export default DetailItem;