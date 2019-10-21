import React, {Component} from 'react';
import {MessageFile} from '../ChatUI/MessageFiles';
import {RootState} from '../../reducers';
import {connect} from 'react-redux';
import {currentTeamTokenSelector} from '../ChatUI/MessageImages';
import {View, StyleSheet} from 'react-native';
import px from '../../utils/normalizePixel';

type Props = ReturnType<typeof mapStateToProps> & {
  fileId: string;
};

class FileCell extends Component<Props> {
  renderAllFile = () => {
    let {file, token} = this.props;
    return (
      <MessageFile
        file={file}
        token={token}
        containerStyle={{width: '100%'}}
        textStyle={{color: '#333333'}}
      />
    );
  };

  render() {
    let {file} = this.props;
    if (file.mimetype.startsWith('image')) return null;
    if (file.mimetype.startsWith('video')) return null;
    return <View style={styles.container}>{this.renderAllFile()}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: px(10),
    paddingVertical: px(7.5),
    marginBottom: px(10),
    backgroundColor: '#fff',
  },
});

const mapStateToProps = (state: RootState, ownProps) => ({
  file: state.entities.files.byId[ownProps.fileId],
  token: currentTeamTokenSelector(state),
});

export default connect(mapStateToProps)(FileCell);
