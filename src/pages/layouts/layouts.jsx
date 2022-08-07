import React from 'react';
import PropTypes from 'prop-types';

import Footer from './footer';
import Content from './content';
import Header from './header';

const Layout = ({ showMenu, children }) => (
  <>
    <Header showMenu={showMenu} />
    {children}
    <Footer />
  </>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  showMenu: PropTypes.bool,
};

Layout.defaultProps = {
  showMenu: true,
};

Layout.Content = Content;

export default Layout;
