import { Platform } from 'react-native'

let _isNative = Platform.OS === 'android' || Platform.OS === "ios"

export default () => _isNative