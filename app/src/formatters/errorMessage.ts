import { IS_DEV } from '~/config';

export function errorMessageFormatter(err: any): string {
  if (IS_DEV) {
    console.error(err.response || err);
  }

  const status: any = {
    '-1': 'Servidor não encontrado',
    400: 'Dados inválidos',
    401: 'Sem permissão de acesso',
    403: 'Sem permissão de acesso',
    422: 'Dados inválidos'
  };

  if (typeof err === 'string') {
    return err;
  }

  switch ((err || {}).message) {
    case 'no-internet':
    case 'NETWORK_ERROR':
      return 'Sem conexão com a internet';
    case 'api-error':
      if (err.status == -1) {
        return 'Erro no servidor';
      }

      return status[err.status] || 'Algo deu errado...';
    default:
      return 'Algo deu errado...';
  }
}

export function errorIconFormatter(error: any): string {
  switch ((error || { message: '' }).message) {
    case 'no-internet':
    case 'NETWORK_ERROR':
      return 'wifi-off';
    case 'api-error':
      return 'weather-lightning';
    default:
      return 'emoticon-sad';
  }
}
