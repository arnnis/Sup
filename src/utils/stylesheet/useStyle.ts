import useStylesheet from './useStylesheet';

export default inputStyle => {
  let stylesheet = useStylesheet({style: inputStyle});
  return stylesheet?.style;
};
