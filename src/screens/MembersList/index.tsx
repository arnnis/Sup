import React, {PureComponent, Component} from 'react';
import {DispatchProp} from 'react-redux';
import {View, StyleSheet, FlatList, ActivityIndicator} from 'react-native';
import {connect} from 'react-redux';
import MemberCell from './MemberCell';
import {RootState} from '../../reducers';
import {NavigationInjectedProps, withNavigation} from 'react-navigation';
import px from '../../utils/normalizePixel';
import withTheme, {ThemeInjectedProps} from '../../contexts/theme/withTheme';

type Props = ReturnType<typeof mapStateToProps> &
  ThemeInjectedProps &
  DispatchProp<any> &
  NavigationInjectedProps;

class MembersList extends PureComponent<Props> {
  renderLoading() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  renderMemberCell = ({item: memberId, index}) => {
    return <MemberCell memberId={memberId} />;
  };

  render() {
    let {membersList, theme} = this.props;

    return (
      <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
        {this.props.loading ? (
          this.renderLoading()
        ) : (
          <FlatList
            data={membersList}
            renderItem={this.renderMemberCell}
            getItemLayout={(data, index) => ({
              length: px(150),
              offset: px(150) * index,
              index,
            })}
            numColumns={3}
            initialNumToRender={10}
            contentContainerStyle={{paddingHorizontal: 15}}
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
  membersList: state.members.list,
  loading: state.members.loadingList,
});

export default connect(mapStateToProps)(withNavigation(withTheme(MembersList)));
