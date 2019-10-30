import { LinkingService } from '..';
import openInformativeHandler from './openInformative';

export function register(linkingService: LinkingService) {
  linkingService.registerHandler(openInformativeHandler);
}
