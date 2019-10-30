import { Dimensions, StyleSheet } from 'react-native';
import { IS_ANDROID } from '~/config';

import variablesThemeCore from './native-base-theme/variables/platform';

export const variablesTheme = variablesThemeCore;

export const classes = StyleSheet.create({
  buttonFacebook: {
    backgroundColor: '#3b5998'
  },
  buttonGoogle: {
    backgroundColor: '#de5245'
  },
  cardsContainer: {
    backgroundColor: '#f4f4f7'
  },
  cardsPadding: {
    padding: 8
  },
  fabPadding: {
    paddingBottom: 90
  },
  cardItemMultiline: {
    width: Dimensions.get('screen').width - 120
  },
  centerPage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height
  },
  emptyMessage: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  textCenter: {
    textAlign: 'center'
  },
  alignCenter: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  alignRight: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  listItem: {
    marginLeft: 0
  },
  listIconWrapper: {
    maxWidth: 45,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  listIconWrapperSmall: {
    maxWidth: 25,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  listIcon: {
    width: 40,
    fontSize: 30,
    marginLeft: 10,
    textAlign: 'center'
  },
  iconLarge: {
    fontSize: 80
  },
  headerButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    marginTop: IS_ANDROID ? 5 : 0,
    elevation: 0
  },
  headerButtonIcon: {
    color: variablesTheme.toolbarBtnTextColor
  }
});
