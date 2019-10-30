import React, { memo } from 'react';

import IconMessage from './IconMessage';

interface IProps {
  disableMargin?: boolean;
  button?: string;
  onPress?: () => void;
}

const EmptyMessage = memo((props: IProps) => {
  return <IconMessage icon='cloud-off-outline' message='Nenhuma informação encontrada' {...props} />;
});

export default EmptyMessage;
