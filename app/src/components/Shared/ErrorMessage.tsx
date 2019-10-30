import React, { memo, useMemo } from 'react';
import { errorIconFormatter, errorMessageFormatter } from '~/formatters/errorMessage';

import IconMessage from './IconMessage';

interface IProps {
  error?: any;
  disableMargin?: boolean;
  button?: string;
  onPress?: () => void;
}

const ErrorMessage = memo(({ error, onPress, button, ...props }: IProps) => {
  const icon = useMemo(() => errorIconFormatter(error), [error]);
  const message = useMemo(() => errorMessageFormatter(error), [error]);

  return (
    <IconMessage
      icon={icon}
      message={message}
      button={button || (onPress ? 'Tentar novamente' : '')}
      onPress={onPress}
      {...props}
    />
  );
});

export default ErrorMessage;
