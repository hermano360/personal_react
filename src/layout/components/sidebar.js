import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router';

export class Sidebar extends React.Component {

  static propTypes = {
    location: React.PropTypes.shape({
      pathname: React.PropTypes.string.isRequired,
      query: React.PropTypes.object.isRequired,
    }),
  }

  state = {
    navItems: [
      { pathname: '/', label: 'Home', icon: 'home' },
      { pathname: '/about', label: 'About', icon: 'info' },
      { pathname: '/table-demo', label: 'Tables', icon: 'table' },
      { pathname: '/button-demo', label: 'Buttons', icon: 'dot-circle-o' },
      { pathname: '/progress-bars', label: 'Progress Bars', icon: 'spinner'},
      { pathname: '/modal-demo', label: 'Modals', icon: 'clipboard' },
      { pathname: '/tabs-demo', label: 'Tabs', icon: 'list-ul' },
      { pathname: '/input-demo', label: 'Inputs', icon: 'check-square' },
      { pathname: '/notifications-demo', label: 'Notifications', icon: 'exclamation' },
    ],
  }

  isSelected(navItem) {
    return this.props.location.pathname === navItem.pathname ? 'selected' : '';
  }

  renderLinks() {
    return _.map(this.state.navItems, (navItem) => {
      return (
        <li className={`al-sidebar-list-item ${this.isSelected(navItem)}`} key={navItem.pathname}>
          <Link className="al-sidebar-list-link" to={{ pathname: navItem.pathname, query: navItem.query }}>
            <i className={`fa fa-${navItem.icon}`}></i>
            <span>{navItem.label}</span>
          </Link>
        </li>
      );
    });
  }

  render() {
    return (
      <aside className="al-sidebar" ng-swipe-right="menuExpand()" ng-swipe-left="menuCollapse()"
        ng-mouseleave="hoverElemTop=selectElemTop">
        <ul className="al-sidebar-list">
          {this.renderLinks()}
        </ul>
      </aside>
    );
  }
}
