/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
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

export default Input;
