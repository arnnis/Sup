import React, {Component} from 'react';
import {File} from '../ChatUI/MessageFiles';
import {RootState} from '../../store/configureStore';
import {connect} from 'react-redux';
import {View, StyleSheet} from 'react-native';
import px from '../../utils/normalizePixel';
import withTheme, {ThemeInjectedProps} from '../../contexts/theme/withTheme';

type Props = ReturnType<typeof mapStateToProps> &
  ThemeInjectedProps & {
    fileId: string;
  };

class FileCell extends Component<Props> {
  renderAllFile = () => {
    let {file, theme} = this.props;

    return (
      <File
        file={file}
        containerStyle={{width: '100%'}}
        textStyle={{color: theme.foregroundColor}}
      />
    );
  };

  render() {
    let {file, theme} = this.props;
    if (file?.mimetype?.startsWith('image')) return null;
    if (file?.mimetype?.startsWith('video')) return null;
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
});

export default connect(mapStateToProps)(withTheme(FileCell));
