import React, {PureComponent, Component} from 'react';
import {DispatchProp} from 'react-redux';
import {
  View,
  StyleSheet,
  Button,
  FlatList,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import ChatCell from '../ChatsList/ChatCell';
import {RootState} from '../../reducers';
import {NavigationInjectedProps, withNavigation} from 'react-navigation';
import px from '../../utils/normalizePixel';
import withTheme, {ThemeInjectedProps} from '../../contexts/theme/withTheme';

type Props = ReturnType<typeof mapStateToProps> &
  ThemeInjectedProps &
  DispatchProp<any> &
  NavigationInjectedProps;

class GroupsList extends PureComponent<Props> {
  renderLoading() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  renderGroupCell = ({item: groupId, index}) => {
    return <ChatCell chatId={groupId} />;
  };

  render() {
    let {groupsList, theme} = this.props;

    return (
      <View
        style={[
          styles.container,
          {backgroundColor: theme.backgroundColorDarker1},
        ]}>
        {/* <Button
          onPress={() => this.props.dispatch(signinTeam())}
          title="login"
        /> */}
        {this.props.loading ? (
          this.renderLoading()
        ) : (
          <FlatList
            data={groupsList}
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
  groupsList: state.chats.groupsList,
  loading: state.chats.loading,
});

export default connect(mapStateToProps)(withNavigation(withTheme(GroupsList)));
