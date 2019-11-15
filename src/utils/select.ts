const select = (value: any, cases: any) => {
  return cases[value] || cases['default'];
};

export default select;
