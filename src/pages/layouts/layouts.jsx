import React from 'react';
import PropTypes from 'prop-types';

import styles from './layouts.module.scss';

import Header from './header';
import Footer from './footer';
import Content from './content';

const Layout = ({ children }) => (
  <div className={styles.contaier}>
    <Header />
    {children}
    <Footer />
  </div>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

Layout.Content = Content;

export default Layout;
