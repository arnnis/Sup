import React, {Component} from 'react';
import {View, StyleSheet, FlatList, ActivityIndicator, Platform} from 'react-native';
import {RootState} from '../../reducers';
import {connect} from 'react-redux';
import FileCell from './FileCell';
import px from '../../utils/normalizePixel';

type Props = ReturnType<typeof mapStateToProps>;

class FilesList extends Component<Props> {
  keyExtractor = (chatId: string) => chatId;

  getItemLayout = (data, index) => ({
    length: px(50),
    offset: px(50) * index,
    index,
  });

  renderLoading() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  renderCell = ({item: fileId, index}) => <FileCell fileId={fileId} />;

  render() {
    let {filesList, loading} = this.props;
    return (
      <View style={styles.container}>
        {loading && filesList.length === 0 ? (
          this.renderLoading()
        ) : (
          <FlatList
            data={filesList}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderCell}
            getItemLayout={this.getItemLayout}
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
  filesList: state.files.list,
  loading: state.files.listLoading,
});

export default connect(mapStateToProps)(FilesList);
