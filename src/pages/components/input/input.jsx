/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import style from './input.module.scss';

function Input({
  name,
  text,
  setError,
  setValue,
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

        <select
          name={name}
          id={name}
          {...props}
          {...props}
          onChange={(e) => {
            setError(name);
            setValue(name, e.target.value, { shouldValidate: true });
          }}
        >
          <option disabled selected="selected" value={null}>
            Selecione um item
          </option>
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
          id={name}
          type={type}
          {...props}
          onChange={(e) => {
            setError(name);
            setValue(name, e.target.value, { shouldValidate: true });
          }}
        />
        <span className={style.ErrorSpan}>{errors}</span>
      </div>
    );
  }

  return (
    <div className={style.Container}>
      <span>{text}</span>
      <input
        autoComplete="off"
        type={type}
        name={name}
        id={name}
        {...props}
        onChange={(e) => {
          setError(name);
          setValue(name, e.target.value, { shouldValidate: true });
        }}
      />
      <span className={style.ErrorSpan}>{errors}</span>
    </div>
  );
}

export default Input;
