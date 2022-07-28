import React from 'react';
import PropTypes from 'prop-types';

import styles from './content.module.scss';

const Content = ({ children, title, background }) => (
  <div className={styles.Container}>
    <div
      className={styles.ChildContainer}
      style={{
        backgroundColor: background,
      }}
    >
      <h1 className={styles.Title}>{title}</h1>
      {children}
    </div>
  </div>
);

Content.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  background: PropTypes.string,
};

Content.defaultProps = {
  background: 'white',
};

export default Content;
