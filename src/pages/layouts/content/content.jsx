import React from 'react';
import PropTypes from 'prop-types';

import styles from './content.module.scss';

const Content = ({ children, title }) => (
  <div className={styles.Container}>
    <div className={styles.ChildContainer}>
      <h1 className={styles.Title}>{title}</h1>
      {children}
    </div>
  </div>
);

Content.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
};

export default Content;
