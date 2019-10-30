import { Button, Icon, Text, View } from 'native-base';
import React, { memo, useMemo } from 'react';
import { StyleSheet } from 'react-native';

interface IProps {
  icon: string;
  message: string;
  button?: string;
  onPress?: () => void;
  disableMargin?: boolean;
}

const IconMessage = memo(({ message, button, onPress, icon, disableMargin }: IProps) => {
  const containerStyle = useMemo(() => [styles.container, disableMargin ? null : styles.margin], [disableMargin]);

  return (
    <View padder style={containerStyle}>
      <Icon type='MaterialCommunityIcons' name={icon} style={styles.icon} />
      <Text style={styles.message}>{message}</Text>
      {!!button && (
        <Button block style={styles.button} onPress={onPress}>
          <Text>{button}</Text>
        </Button>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  margin: {
    marginTop: 90
  },
  icon: {
    fontSize: 100,
    opacity: 0.8
  },
  message: {
    marginTop: 5,
    fontSize: 18,
    opacity: 0.5,
    textAlign: 'center'
  },
  button: {
    marginTop: 20
  }
});

export default IconMessage;
