import React, { PureComponent } from 'react';
import { Route, Switch } from 'react-router-dom';

import OrderListPage from './ListOrders';

export default class OrderIndexPage extends PureComponent {
  render() {
    return (
      <Switch>
        <Route path='/' component={OrderListPage} />
      </Switch>
    );
  }
}
