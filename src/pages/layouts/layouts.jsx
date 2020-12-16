import React from 'react';
import PropTypes from 'prop-types';

import styles from './layouts.module.scss';

import Header from './header';
import Footer from './footer';

const Layout = ({ children }) => (
  <div className={styles.wrap}>
    <Header />
    {children}
    <Footer />
  </div>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
