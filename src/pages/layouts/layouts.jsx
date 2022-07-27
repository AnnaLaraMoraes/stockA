import React from 'react';
import PropTypes from 'prop-types';

import Footer from './footer';
import Content from './content';

const Layout = ({ children }) => (
  <div>
    {children}
    <Footer />
  </div>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

Layout.Content = Content;

export default Layout;
