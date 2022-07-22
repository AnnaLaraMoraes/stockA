/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import './input.scss';

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
  if (
    type === 'input' ||
    type === 'password' ||
    type === 'number' ||
    type === 'date'
  ) {
    return (
      <div className="InputContainer">
        <p>{text}</p>
        <input name={name} ref={register} type={type} {...props} />
        <span>{errors}</span>
      </div>
    );
  }

  if (type === 'select') {
    return (
      <div className="SelectContainer">
        <p>{text}</p>
        <select name={name} ref={register} {...props}>
          {values.map((item) => (
            <option key={item.value} value={item.value}>
              {item.text}
            </option>
          ))}
        </select>
        <span>{errors}</span>
      </div>
    );
  }

  if (type === 'checkbox') {
    return (
      <div className="CheckBoxContainer">
        <p>{text}</p>
        <input name={name} ref={register} type={type} {...props} />
        <span>{errors}</span>
      </div>
    );
  }
}

Input.propTypes = {
  text: PropTypes.string,
  values: PropTypes.arrayOf(PropTypes.shape({ value: String, text: String })),
  type: PropTypes.string,
  name: PropTypes.string,
  register: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  errors: PropTypes.string,
  size: PropTypes.string,
  sizeSelect: PropTypes.string,
};

Input.defaultProps = {
  type: 'text',
  text: '',
  values: [{ value: '', text: '' }],
  register: null,
  errors: '',
  name: '',
  size: '',
  sizeSelect: '',
};

export default Input;
