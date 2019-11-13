import React, {Component} from 'react';
import {MessageFile} from '../ChatUI/MessageFiles';
import {RootState} from '../../reducers';
import {connect} from 'react-redux';
import {View, StyleSheet} from 'react-native';
import px from '../../utils/normalizePixel';
import withTheme, {ThemeInjectedProps} from '../../contexts/theme/withTheme';
import {currentTeamTokenSelector} from '../../reducers/teams';

type Props = ReturnType<typeof mapStateToProps> &
  ThemeInjectedProps & {
    fileId: string;
  };

class FileCell extends Component<Props> {
  renderAllFile = () => {
    let {file, token, theme} = this.props;
    let File = withTheme(MessageFile);
    return (
      <File
        file={file}
        token={token}
        containerStyle={{width: '100%'}}
        textStyle={{color: theme.foregroundColor}}
      />
    );
  };

  render() {
    let {file, theme} = this.props;
    if (file.mimetype.startsWith('image')) return null;
    if (file.mimetype.startsWith('video')) return null;
    return (
      <View
        style={[
          styles.container,
          {backgroundColor: theme.backgroundColor, borderBottomColor: theme.backgroundColorDarker1},
        ]}>
        {this.renderAllFile()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: px(10),
    paddingVertical: px(7.5),
    borderBottomWidth: px(1),
    backgroundColor: '#fff',
  },
});

const mapStateToProps = (state: RootState, ownProps) => ({
  file: state.entities.files.byId[ownProps.fileId],
  token: currentTeamTokenSelector(state),
});

export default connect(mapStateToProps)(withTheme(FileCell));
