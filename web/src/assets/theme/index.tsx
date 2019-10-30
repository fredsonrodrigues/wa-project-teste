import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

import overrides from './overrides';
import props from './props';
import variables from './variables';

const primary = {
  light: '#4f5b62',
  main: '#263238',
  dark: '#000a12',
  contrastText: '#fff'
};

const secondary = {
  light: '#7f85ff',
  main: '#3d58f6',
  dark: '#002fc2',
  contrastText: '#fff'
};

export const theme = createMuiTheme({
  palette: { primary, secondary },
  overrides,
  variables,
  props
});

export const reverseTheme = createMuiTheme({
  palette: { primary: secondary, secondary: primary },
  overrides,
  variables,
  props
});
