import React from 'react';
import PropTypes from 'prop-types';

import Footer from './footer';
import Content from './content';
import Header from './header';

const Layout = ({ children }) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

Layout.Content = Content;

export default Layout;
