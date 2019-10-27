import React, {FC, useRef} from 'react';
import {Modal, TouchableWithoutFeedback} from 'react-native';
import ChatUI from '../ChatUI';
import {RootState} from '../../reducers';
import {connect, DispatchProp} from 'react-redux';
import {View, Dimensions, StyleSheet} from 'react-native';
import UserProfile from '../UserProfile';
import {closeBottomSheet} from '../../actions/app';

const dims = Dimensions.get('window');

type Props = ReturnType<typeof mapStateToProps> & DispatchProp<any>;

const BottomSheet: FC<Props> = ({bottomSheet, dispatch}) => {
  if (!bottomSheet.screen) return null;
  const _handleBackgroundPress = () => {
    dispatch(closeBottomSheet());
  };

  const _renderScene = () => {
    switch (bottomSheet.screen) {
      case 'ChatUI':
        return <ChatUI {...bottomSheet.params} />;
      case 'UserInfo':
        return <UserProfile {...bottomSheet.params} />;
    }
  };

  let content = () => (
    <TouchableWithoutFeedback onPress={_handleBackgroundPress}>
      <View style={styles.panelContainer} pointerEvents="box-only">
        <View style={styles.panel} pointerEvents="none">
          <View style={styles.panelHeader}>
            <View style={styles.panelHandle} />
          </View>
          {_renderScene()}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <View style={styles.container}>
      <Modal
        visible={bottomSheet.screen ? true : false}
        animationType="slide"
        transparent
        supportedOrientations={['landscape', 'portrait']}
        style={{margin: 0}}>
        {content()}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  panelContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  panel: {
    height: dims.height - 100,
    width: dims.width - dims.width / 2,
    paddingHorizontal: 5,
    backgroundColor: 'rgb(72.0, 32.0, 70.0)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 5,
    shadowOpacity: 0.4,
  },
  panelHeader: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginTop: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#318bfb',
    alignItems: 'center',
    marginVertical: 10,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
});

const mapStateToProps = (state: RootState) => ({
  bottomSheet: state.app.bottomSheet,
});

export default connect(mapStateToProps)(BottomSheet);
