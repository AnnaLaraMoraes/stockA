import React, { useState } from 'react';
import { BsFacebook } from 'react-icons/bs';
import { FcGoogle } from 'react-icons/fc';
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ToastContainer, toast } from 'react-toastify';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
} from 'firebase/auth';
import api from '../../services/api';
import Input from '../components/input';
import Button from '../components/button';
import ButtonSecondary from '../components/button-secondary';
import style from './create-account.module.scss';
import { phoneMask, validateCpf } from '../../utils/utils';
import Layout from '../layouts';
import { auth } from '../../firebase-config';

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
  isLegalPerson: yup.boolean(),
  name: yup.string(),
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
        : field.test('is-cpf-valid', 'CPF inválido.', validateCpf)
    ),
  storeName: yup.string(),
  merchantType: yup.string(),
  password: yup.string().min(8, 'Senha muito curta'),
  phone: yup.string(),
  address: yup.object({
    state: yup.string(),
    city: yup.string(),
    address: yup.string(),
    cep: yup.string(),
  }),
});

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLegalPerson, setIsLegalPerson] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const history = useHistory();

  const providerGoogle = new GoogleAuthProvider();
  const providerFaceBook = new FacebookAuthProvider();

  const { register, handleSubmit, setValue, errors } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
        .then(async (userCredential) => {
          const { user } = userCredential;
          data.firebaseUid = user.uid;
          await api.post('/user', data);
        })
        .catch(() => {
          toast.error(
            'Erro ao criar conta. Tente mais tarde ou entre em contato'
          );
        });

      toast.success('Cadastro feito com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar conta. Tente mais tarde ou entre em contato');
    } finally {
      setIsLoading(false);
      history.push('/dashboard');
    }
  };

  const loginGoogle = async () => {
    try {
      signInWithPopup(auth, providerGoogle)
        .then(async (result) => {
          const data = {
            firebaseUid: result.user.uid,
            email: result.user.email,
            name: result.user.displayName,
          };
          await api.post('/user', data);
        })
        .catch(() => {
          toast.error(
            'Erro ao criar conta. Tente mais tarde ou entre em contato'
          );
        });
      toast.success('Cadastro feito com sucesso!');
    } catch (error) {
      toast.error('Erro ao tentar acessar conta com Google');
    } finally {
      setIsLoading(false);
      history.push('/dashboard');
    }
  };

  const loginFaceBook = async () => {
    try {
      signInWithPopup(auth, providerFaceBook)
        .then(async (result) => {
          const data = {
            firebaseUid: result.user.uid,
            email: result.user.email,
            name: result.user.displayName,
          };
          await api.post('/user', data);
        })
        .catch(() => {
          toast.error(
            'Erro ao criar conta. Tente mais tarde ou entre em contato'
          );
        });
      toast.success('Cadastro feito com sucesso!');
    } catch (error) {
      toast.error('Erro ao tentar acessar conta com Google');
    } finally {
      setIsLoading(false);
      history.push('/dashboard');
    }
  };

  return (
    <Layout showMenu={false}>
      <Layout.Content title="Cadastrar">
        <ToastContainer />
        <>
          <div className={style.LoginButtons}>
            <button type="button" onClick={loginFaceBook}>
              <BsFacebook />
              Cadastrar com Facebook
            </button>
            <button type="button" onClick={loginGoogle}>
              <FcGoogle />
              Cadastrar com Google
            </button>
          </div>
          <span className={style.Text}>ou cadastre com e-mail e senha</span>
          <form>
            <div className={style.InputsContainer}>
              <Input
                name="email"
                text="E-mail"
                register={register}
                errors={errors.email && errors.email.message}
                type="input"
                onChange={(event) => setRegisterEmail(event.target.value)}
              />
              <Input
                name="password"
                text="Senha"
                onChange={(event) => setRegisterPassword(event.target.value)}
                type="password"
              />
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
              <Input
                name="address.address"
                text="Endereco"
                register={register}
                errors={
                  errors.address?.address && errors.address?.address.message
                }
                type="input"
              />
            </div>
            <div className={style.ButtonsSaveOrCancelContainer}>
              <ButtonSecondary
                text="Cancelar"
                disabled={isLoading}
                onClick={() => history.push('/')}
              />
              <Button
                text="Criar Conta"
                disabled={isLoading}
                onClick={handleSubmit(onSubmit)}
              />
            </div>
          </form>
        </>
      </Layout.Content>
    </Layout>
  );
}

export default Login;
