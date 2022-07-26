import React, { useState, useEffect } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ToastContainer, toast } from 'react-toastify';
import { useLocation, useHistory } from 'react-router-dom';
import style from './register-stakeholders.module.scss';
import Layout from '../layouts';
import Input from '../components/input';
import Button from '../components/button';
import api from '../../services/api';
import 'react-toastify/dist/ReactToastify.css';
import { phoneMask } from '../../utils/utils';
import ButtonSecondary from '../components/button-secondary';

const isLegalPersonList = [
  { value: false, text: 'Física' },
  { value: true, text: 'Jurídica' },
];

const typePersonList = [
  { value: 'employee', text: 'Funcionário' },
  { value: 'provider', text: 'Fornecedor' },
  { value: 'client', text: 'Cliente' },
];

function RegisterStakeholders() {
  const history = useHistory();
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isLegalPerson, setIsLegalPerson] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const schema = yup.object({
    name: yup.string().required('Este campo é obrigatório'),
    phone: yup.string().required('Este campo é obrigatório'),
    isLegalPerson: yup.string().required('Este campo é obrigatório'),
    cpf: yup.string(),
    cnpj: yup.string(),
    email: yup.string(),
    socialNetwork: yup.string(),
    comments: yup.string(),
    type: isEdit
      ? yup.string()
      : yup.string().required('Este campo é obrigatório'),
    address: yup.object({
      state: yup.string(),
      city: yup.string(),
      address: yup.string(),
      cep: yup.string(),
    }),
  });

  const { register, errors, handleSubmit, reset, setValue } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (state && state.dataEdit) {
      reset(state.dataEdit);
      setIsEdit(true);
    } else {
      reset({});
      setIsEdit(false);
    }
  }, [state]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      data.userId = '5fd4f81a30918238d4d6a8ef';

      if (isEdit) {
        await api.put(`/stakeholders/${state.dataEdit._id}`, data);

        if (state.urlToReturn) {
          history.push(state.urlToReturn);
        }
      } else {
        await api.post('/stakeholders', data);
      }

      reset({
        name: '',
        phone: '',
        isLegalPerson: '',
        cpf: '',
        cnpj: '',
        email: '',
        socialNetwork: '',
        comments: '',
        type: '',
        'address.state': '',
        'address.city': '',
        'address.address': '',
        'address.cep': '',
      });

      toast.success(`Pessoa ${isEdit ? 'editada' : 'cadastrada'} com sucesso!`);
    } catch (error) {
      toast.error(`Erro ao tentar ${isEdit ? 'editar' : 'cadastrar'} pessoa!`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <Layout.Content>
        <ToastContainer />
        <form>
          <div className={style.InputsContainer}>
            <Input
              name="type"
              text="Tipo de pessoa"
              disabled={isEdit}
              register={register}
              errors={errors.type && errors.type.message}
              type="select"
              values={typePersonList}
            />
            <Input
              name="name"
              text="Nome"
              register={register}
              errors={errors.name && errors.name.message}
              type="input"
            />
            <Input
              name="phone"
              text="Telefone"
              register={register}
              errors={errors.phone && errors.phone.message}
              type="input"
              onChange={(e) => setValue('phone', phoneMask(e.target.value))}
            />
            <Input
              name="email"
              text="E-mail"
              register={register}
              errors={errors.email && errors.email.message}
              type="input"
            />
            <Input
              name="isLegalPerson"
              text="Tipo de pessoa"
              register={register}
              errors={errors.isLegalPerson && errors.isLegalPerson.message}
              type="select"
              onChange={(e) => {
                setIsLegalPerson(e.target.value);
              }}
              values={isLegalPersonList}
            />
            {isLegalPerson === true || isLegalPerson === 'true' ? (
              <Input
                name="cnpj"
                text="CNPJ"
                register={register}
                errors={errors.cnpj && errors.cnpj.message}
                type="input"
              />
            ) : (
              <Input
                name="cpf"
                text="CPF"
                register={register}
                errors={errors.cpf && errors.cpf.message}
                type="input"
              />
            )}
            <Input
              name="socialNetwork"
              text="Rede social"
              register={register}
              errors={errors.socialNetwork && errors.socialNetwork.message}
              type="input"
            />
            <Input
              name="comments"
              text="Observações"
              register={register}
              errors={errors.comments && errors.comments.message}
              type="input"
            />
            <Input
              name="address.address"
              text="Endereco"
              register={register}
              errors={
                errors.address?.address && errors.address?.address.message
              }
              type="input"
            />
            <Input
              name="address.cep"
              text="CEP"
              register={register}
              errors={errors.address?.cep && errors.address?.cep.message}
              type="input"
            />
            <Input
              name="address.city"
              text="Cidade"
              register={register}
              errors={errors.address?.city && errors.address?.city.message}
              type="input"
            />
            <Input
              name="address.state"
              text="Estado"
              register={register}
              errors={errors.address?.state && errors.address?.state.message}
              type="input"
            />
          </div>
          <div className={style.ButtonsSaveOrCancelContainer}>
            <ButtonSecondary
              text="Cancelar"
              disabled={isLoading}
              onClick={() => history.push('costumers-list')}
            />
            <Button
              text={isEdit ? 'Editar' : 'Cadastrar'}
              disabled={isLoading}
              onClick={handleSubmit(onSubmit)}
            />
          </div>
        </form>
      </Layout.Content>
    </Layout>
  );
}

export default RegisterStakeholders;
