import React, {PureComponent, Component} from 'react';
import {DispatchProp} from 'react-redux';
import {View, StyleSheet, FlatList, ActivityIndicator, Platform} from 'react-native';
import {NavigationInjectedProps, withNavigation} from 'react-navigation';
import {connect} from 'react-redux';
import ChatCell from './ChatCell';
import {RootState} from '../../reducers';
import px from '../../utils/normalizePixel';
import withTheme, {ThemeInjectedProps} from '../../contexts/theme/withTheme';

type Props = ReturnType<typeof mapStateToProps> &
  ThemeInjectedProps &
  DispatchProp<any> &
  NavigationInjectedProps;

class DirectsList extends PureComponent<Props> {
  static whyDidYouRender = true;
  renderLoading() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  renderDirectCell = ({item: directId, index}) => <ChatCell chatId={directId} />;

  keyExtractor = (chatId: string) => chatId;

  getItemLayout = (data, index) => ({
    length: CELL_HEIGHT,
    offset: CELL_HEIGHT * index,
    index,
  });

  render() {
    let {directsList, loading, theme} = this.props;
    return (
      <View style={[styles.container, {backgroundColor: theme.backgroundColorDarker1}]}>
        {loading && directsList.length === 0 ? (
          this.renderLoading()
        ) : (
          <FlatList
            data={directsList}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderDirectCell}
            getItemLayout={this.getItemLayout}
            style={styles.listStyle}
            removeClippedSubviews={Platform.OS === 'android'}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
  listStyle: {
    flex: 1,
  },
});

const CELL_HEIGHT = px(72);

const mapStateToProps = (state: RootState) => ({
  directsList: state.chats.directsList,
  loading: state.chats.loading,
});

export default connect(mapStateToProps)(withNavigation(withTheme(DirectsList)));
