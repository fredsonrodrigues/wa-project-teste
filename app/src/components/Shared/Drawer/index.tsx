import * as React from 'react';
import { ScrollView } from 'react-native';
import BaseComponent from '~/components/Shared/Abstract/Base';
import { DrawerNavigatorItems } from 'react-navigation-drawer';
import { DrawerNavigatorItemsProps } from 'react-navigation-drawer/lib/typescript/src/types';

export class Drawer extends BaseComponent<DrawerNavigatorItemsProps> {
  render() {
    return (
      <ScrollView>
        <DrawerNavigatorItems {...(this.props as any)} />
      </ScrollView>
    );
  }
}
