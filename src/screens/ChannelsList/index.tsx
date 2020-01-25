import React, {PureComponent, Component} from 'react';
import {DispatchProp} from 'react-redux';
import {View, StyleSheet, Button, FlatList, ActivityIndicator, Platform} from 'react-native';
import {connect} from 'react-redux';
import ChatCell from '../DirectsList/ChatCell';
import {RootState} from '../../reducers';
import {NavigationInjectedProps, withNavigation} from 'react-navigation';
import px from '../../utils/normalizePixel';
import withTheme, {ThemeInjectedProps} from '../../contexts/theme/withTheme';

type Props = ReturnType<typeof mapStateToProps> &
  ThemeInjectedProps &
  DispatchProp<any> &
  NavigationInjectedProps;

class ChannelsList extends PureComponent<Props> {
  renderLoading() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  renderGroupCell = ({item: groupId}) => {
    return <ChatCell chatId={groupId} />;
  };

  render() {
    let {channelsList, theme} = this.props;

    return (
      <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
        {this.props.loading && channelsList.length === 0 ? (
          this.renderLoading()
        ) : (
          <FlatList
            data={channelsList}
            renderItem={this.renderGroupCell}
            getItemLayout={(data, index) => ({
              length: px(72),
              offset: px(72) * index,
              index,
            })}
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
  },
});

const mapStateToProps = (state: RootState) => ({
  channelsList: state.chats.channelsList,
  loading: state.chats.loading,
});

export default connect(mapStateToProps)(withNavigation(withTheme(ChannelsList)));
