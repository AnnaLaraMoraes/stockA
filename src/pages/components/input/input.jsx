/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import style from './input.module.scss';

function Input({
  name,
  text,
  register,
  errors,
  type,
  values,
  size,
  sizeSelect,
  ...props
}) {
  if (type === 'select') {
    return (
      <div className={style.Container}>
        <span>{text}</span>
        <select name={name} ref={register(name, { required: true })} {...props}>
          {values.map((item) => (
            <option key={item.value} value={item.value}>
              {item.text}
            </option>
          ))}
        </select>
        <span className={style.ErrorSpan}>{errors}</span>
      </div>
    );
  }

  if (type === 'checkbox') {
    return (
      <div className={style.Container}>
        <span>{text}</span>
        <input
          name={name}
          ref={register(name, { required: true })}
          type={type}
          {...props}
        />
        <span className={style.ErrorSpan}>{errors}</span>
      </div>
    );
  }

  return (
    <div className={style.Container}>
      <span>{text}</span>
      <input
        name={name}
        ref={register(name, { required: true })}
        type={type}
        {...props}
      />
      <span className={style.ErrorSpan}>{errors}</span>
    </div>
  );
}

Input.propTypes = {
  text: PropTypes.string,
  values: PropTypes.arrayOf(PropTypes.shape({ value: String, text: String })),
  type: PropTypes.string,
  name: PropTypes.string,
  register: PropTypes.func,
  errors: PropTypes.string,
  size: PropTypes.string,
  sizeSelect: PropTypes.string,
};

Input.defaultProps = {
  type: 'text',
  text: '',
  values: [{ value: '', text: '' }],
  register: () => {},
  errors: '',
  name: '',
  size: '',
  sizeSelect: '',
};

export default Input;
