import MaterialIcon from 'react-native-vector-icons/Fonts/MaterialIcons.ttf';
import MaterialCommunityIcons from 'react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf';

const loadFonts = () => {
  const iconFontStyles = `
    @font-face {
      src: url(${MaterialIcon});
      font-family: MaterialIcon;
    }
    @font-face {
      src: url(${MaterialCommunityIcons});
      font-family: MaterialCommunityIcons;
    }
  `;

  // Create stylesheet
  const style = document.createElement('style');
  style.type = 'text/css';
  let cssText = iconFontStyles;
  if (style.styleSheet) {
    style.styleSheet.cssText = cssText;
  } else {
    style.appendChild(document.createTextNode(cssText));
  }

  // Inject stylesheet
  document.head.appendChild(style);
};

export default loadFonts;
