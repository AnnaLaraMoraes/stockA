/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';

const Testtt = ({ setValue, setError, id, ...props }) => (
  <input
    name={id}
    id={id}
    {...props}
    onChange={(e) => {
      setError(id);
      setValue(id, e.target.value, { shouldValidate: true });
    }}
  />
);

function ComponentTest() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
  } = useForm();

  const onSubmit = (data) => console.log('ddfadfta', data);

  console.log(errors.example);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Testtt
        {...register('example', { required: true })}
        setValue={setValue}
        id="example"
        setError={setError}
      />
      {errors.example && <span>This field is required</span>}

      {/* <input
        onChange={(e) =>
          setValue('exampleRequired', e.target.value, { shouldValidate: true })
        }
        ref={register('exampleRequired', { required: true })}
      />
      {errors.exampleRequired && <span>This field is required</span>} */}

      <input type="submit" />
    </form>
  );
}

Testtt.propTypes = {
  setValue: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

export default ComponentTest;
