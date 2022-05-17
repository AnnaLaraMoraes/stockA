import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import api from '../../services/api';
import Input from '../components/input';

import style from './create-account.module.scss';
import logoImg from '../../static/images/logo.svg';
import formImg from '../../static/images/forms2.png';
import { phoneMask, validateCpf } from '../../utils/utils';

const merchantTypeList = [
  { value: 'autonomous', text: 'Autonomo' },
  { value: 'wholesaler', text: 'Atacado' },
  { value: 'retailer', text: 'Varejo' },
];

const isLegalPersonList = [
  { value: false, text: 'Física' },
  { value: true, text: 'Jurídica' },
];

const schema = yup.object({
  email: yup
    .string()
    .required('Este campo é obrigatório')
    .email('Este email nao é válido'),
  isLegalPerson: yup.boolean().required('Este campo é obrigatório'),
  name: yup.string().required('Este campo é obrigatório'),
  cnpj: yup
    .string()
    .when('isLegalPerson', (isLegalPerson, field) =>
      isLegalPerson ? field.required() : field.strip()
    ),
  cpf: yup
    .string()
    // .transform((cpf) => (cpf ? cpf.replace(/\D/g, '') : ''))
    .when('isLegalPerson', (isLegalPerson, field) =>
      isLegalPerson
        ? field
        : field.required().test('is-cpf-valid', 'CPF inválido.', validateCpf)
    ),
  storeName: yup.string().required('Este campo é obrigatório'),
  merchantType: yup.string().required('Este campo é obrigatório'),
  password: yup
    .string()
    .required('Este campo é obrigatório')
    .min(8, 'Senha muito curta'),
  phone: yup.string().required('Este campo é obrigatório'),
  address: yup.object({
    state: yup.string().required('Este campo é obrigatório'),
    city: yup.string().required('Este campo é obrigatório'),
    address: yup.string().required('Este campo é obrigatório'),
    cep: yup.string().required('Este campo é obrigatório'),
  }),
});
// TO DO: adicionar campo de cep no form e corrigir textos
function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLegalPerson, setIsLegalPerson] = useState(false);
  const history = useHistory();

  const { register, handleSubmit, setValue, errors } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const resp = await api.post('/user', data);
      alert(resp);
    } catch (error) {
      alert('Erro ao criar conta');
    } finally {
      setIsLoading(false);
      history.push('/login');
    }
  };

  return (
    <div className={style.Container}>
      <div className={style.Logo}>
        <img className={style.LogoImg} src={logoImg} alt="Footer Action" />
      </div>
      <h1>Criar Conta</h1>
      <div className={style.FormContainer}>
        <div className={style.FormLine}>
          <Input
            name="name"
            text="Nome"
            register={register}
            errors={errors.name && errors.name.message}
            type="input"
          />
          <Input
            name="storeName"
            text="Nome da loja"
            register={register}
            errors={errors.storeName && errors.storeName.message}
            type="input"
          />
          <Input
            name="email"
            text="E-mail"
            register={register}
            errors={errors.email && errors.email.message}
            type="input"
          />
        </div>
        <div className={style.FormLine}>
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
            name="merchantType"
            text="Tipo de loja"
            register={register}
            errors={errors.merchantType && errors.merchantType.message}
            values={merchantTypeList}
            type="select"
          />
        </div>
        <div className={style.FormLine}>
          <Input
            name="phone"
            text="Celular"
            register={register}
            errors={errors.phone && errors.phone.message}
            type="input"
            onChange={(e) => setValue('phone', phoneMask(e.target.value))}
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
        <div className={style.FormLine}>
          <Input
            name="address.address"
            text="Endereco"
            register={register}
            errors={errors.address?.address && errors.address?.address.message}
            type="input"
          />
          <Input
            name="password"
            text="Senha"
            register={register}
            errors={errors.password && errors.password.message}
            type="password"
          />
        </div>
      </div>
      <div className={style.ButtonContainer}>
        <button
          disabled={isLoading}
          type="button"
          onClick={handleSubmit(onSubmit)}
        >
          Criar conta
        </button>
        <button
          className={style.BackButton}
          type="button"
          onClick={() => history.push('/login')}
        >
          Voltar
        </button>
      </div>
      <div className={style.FormImgContainer}>
        <img className={style.FormImg} src={formImg} alt="Footer Action" />
      </div>
    </div>
  );
}

export default Login;
