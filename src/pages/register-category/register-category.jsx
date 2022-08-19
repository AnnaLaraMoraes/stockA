/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import style from './register-category.module.scss';
import Input from '../components/input';
import Button from '../components/button';
import ButtonSecondary from '../components/button-secondary';
import api from '../../services/api';

const productTypeList = [
  { value: 'clothes', text: 'Roupas' },
  { value: 'shoes', text: 'Sapatos' },
  { value: 'accessories', text: 'Acessórios' },
  { value: 'others', text: 'Outros' },
];

function RegisterCategory({ handleModal }) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    setError,
    getValues,
  } = useForm({});

  const onSubmit = async (data) => {
    if (!data.productType) {
      toast.error('É necessário adicionar um tipo de produto');
    }

    data.label = data.name;

    try {
      setIsLoading(true);

      await api.post('/categories', data);

      toast.success('Categoria adicionada com sucesso');
    } catch (error) {
      toast.error('Erro ao tentar adicionar categoria');
    } finally {
      setIsLoading(false);
      handleModal(true);
    }
  };

  return (
    <div className={style.Container}>
      <ToastContainer />
      <Input
        setValue={setValue}
        setError={setError}
        name="productType"
        text="Tipo de produto"
        {...register('productType')}
        errors={errors.productType && errors.productType.message}
        type="select"
        values={productTypeList}
        value={getValues('productType')}
      />
      <Input
        setValue={setValue}
        setError={setError}
        name="name"
        text="Nome"
        {...register('name')}
        errors={errors.name && errors.name.message}
        type="input"
        value={getValues('name')}
      />
      <div className={style.ButtonsContainer}>
        <ButtonSecondary
          text="Cancelar"
          disabled={isLoading}
          onClick={handleModal}
        />
        <Button
          text="Adicionar"
          disabled={isLoading}
          onClick={handleSubmit(onSubmit)}
        />
      </div>
    </div>
  );
}

export default RegisterCategory;
