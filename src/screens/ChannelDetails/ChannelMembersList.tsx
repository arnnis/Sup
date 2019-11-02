import React, {PureComponent, Component} from 'react';
import {DispatchProp} from 'react-redux';
import {View, StyleSheet, FlatList, ActivityIndicator, Platform} from 'react-native';
import {connect} from 'react-redux';
import ChannelMemberCell from './ChannelMemberCell';
import {RootState} from '../../reducers';
import {NavigationInjectedProps, withNavigation} from 'react-navigation';
import withTheme, {ThemeInjectedProps} from '../../contexts/theme/withTheme';
import {getChannelMembers} from '../../actions/chats/thunks';
import px from '../../utils/normalizePixel';

type Props = ReturnType<typeof mapStateToProps> &
  ThemeInjectedProps &
  DispatchProp<any> &
  NavigationInjectedProps & {
    chatId: string;
  };

class ChannelMembersList extends PureComponent<Props> {
  componentDidMount() {
    this.props.dispatch(getChannelMembers(this.props.chatId));
  }

  renderLoading() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  renderMemberCell = ({item: memberId, index}) => {
    return <ChannelMemberCell memberId={memberId} />;
  };

  render() {
    let {membersList, loading, theme} = this.props;
    return (
      <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
        {loading ? (
          this.renderLoading()
        ) : (
          <FlatList
            data={membersList}
            renderItem={this.renderMemberCell}
            initialNumToRender={10}
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
    minHeight: px(500),
  },
});

const mapStateToProps = (state: RootState, ownProps) => ({
  membersList: state.chats.membersList[ownProps.chatId],
  loading: state.chats.membersListLoading[ownProps.chatId],
});

export default connect(mapStateToProps)(withNavigation(withTheme(ChannelMembersList)));
