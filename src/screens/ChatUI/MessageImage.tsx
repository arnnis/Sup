import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {RootState} from '../../reducers';
import {createSelector} from 'reselect';
import {Message, Team} from '../../models';
import px from '../../utils/normalizePixel';
import {connect} from 'react-redux';
import {meSelector} from './Message';
import {TeamsState} from '../../reducers/teams';

type Props = ReturnType<typeof mapStateToProps> & {
  messageId: string;
};

class MessageImage extends Component<Props> {
  renderImage(uri, width, height) {
    let {token} = this.props;
    return (
      <FastImage
        source={{uri, headers: {Authorization: 'Bearer ' + token}}}
        style={{width: width, height: height, marginBottom: px(7.5)}}
        resizeMode="cover"
      />
    );
  }

  render() {
    let {images} = this.props;
    if (!images) return null;

    let imageWidth = '100%';
    let imageHeight = px(200);
    if (images.length > 1) {
      imageWidth = '50%';
      imageHeight = px(125);
    }

    return (
      <View style={styles.container}>
        {images.map(image => this.renderImage(images.length > 1? image.thumb_360 : image.thumb_160, imageWidth, imageHeight))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: px(10),
  },
});

const messageImagesSelector = createSelector(
  (message: Message) => message,
  message => message.files && message.files.filter(file => file.mimetype.startsWith('image')),
);

export const currentTeamTokenSelector = createSelector(
  [(state: RootState) => state.teams.list, (state: RootState) => state.teams.currentTeam],
  (teamsList, currentTeamId) => teamsList.find(tm => tm.id === currentTeamId)?.token,
);

const mapStateToProps = (state: RootState, ownProps) => {
  const message = state.entities.messages.byId[ownProps.messageId];
  return {
    images: messageImagesSelector(message),
    token: currentTeamTokenSelector(state),
  };
};

export default connect(mapStateToProps)(MessageImage);
