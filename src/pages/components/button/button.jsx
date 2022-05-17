/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import style from './button.module.scss';

function Input({ text, disabled, onClick, ...props }) {
  return (
    <div className={style.Container}>
      <button
        disabled={disabled}
        type="button"
        onClick={!disabled ? onClick : () => {}}
        {...props}
      >
        {text}
      </button>
    </div>
  );
}

Input.propTypes = {
  text: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

Input.defaultProps = {
  text: '',
  disabled: false,
  onClick: () => {},
};

export default Input;
