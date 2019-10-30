import { NotificationService } from '..';
import { handle as openProfileHandler } from './openProfile';

export function register(notificationService: NotificationService) {
  notificationService.registerHandler('open-profile', openProfileHandler);
}
