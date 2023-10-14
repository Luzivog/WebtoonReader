import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const InfoPopup = ({ details, setPopupVisible }: {

  details: { [key: string]: string } | undefined;
  setPopupVisible: (visible: boolean) => void;

}) => {
  return (
    <View style={styles.popupBackground}>
      <TouchableWithoutFeedback onPress={() => setPopupVisible(false)}>
        <View style={{ width: "100%", height: "100%", position: 'absolute', left: 0, top: 0 }}></View>
      </TouchableWithoutFeedback>
      <View style={styles.popupContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.titleText}>Summary:</Text>
          <TouchableOpacity style={styles.closeButton} onPress={() => setPopupVisible(false)}>
            <Ionicons name="close" style={styles.closeIcon} size={30} color="tomato" />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.popupContent}>
          <Text style={styles.synopsisText}>{details?.summary}</Text>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  popupBackground: {
    flex: 1,
    backgroundColor: 'rgba(25, 25, 25, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    backgroundColor: '#252525',
    borderRadius: 10,
    padding: 16,
    width: '90%',
    maxHeight: '80%',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  closeIcon: {
    marginTop: -10,
  },
  titleText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  popupContent: {
    flexGrow: 1,
  },
  synopsisText: {
    color: 'white',
  },
});

export default InfoPopup;