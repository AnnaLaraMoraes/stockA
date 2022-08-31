/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AiOutlineAppstoreAdd } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import { useLocation, useHistory } from 'react-router-dom';
import style from './register-product.module.scss';
import Layout from '../layouts';
import Input from '../components/input';
import Button from '../components/button';
import ButtonSecondary from '../components/button-secondary';
import api from '../../services/api';
import 'react-toastify/dist/ReactToastify.css';
import Modal from '../components/modal';
import RegisterCategory from '../register-category';

const productTypeList = [
  { value: 'clothes', text: 'Roupas' },
  { value: 'shoes', text: 'Sapatos' },
  { value: 'accessories', text: 'Acessórios' },
  { value: 'others', text: 'Outros' },
];

const subCategoryList = [
  { value: 'female', text: 'Feminino adulto' },
  { value: 'male', text: 'Masculino adulto' },
  { value: 'boy', text: 'Feminino criança' },
  { value: 'girl', text: 'Masculino criança' },
];

const productStockTypeList = [
  { value: 'retail', text: 'Varejo' },
  { value: 'wholesale', text: 'Atacado' },
];

const schema = yup.object({
  code: yup.string().required('Este campo é obrigatório'),
  category: yup.string().required('Este campo é obrigatório'),
  subcategory: yup.string(),
  amountStock: yup
    .string()
    .required('Este campo é obrigatório')
    .test(
      'is-valid',
      'Esse valor deve ser maior que 1',
      (value) => Number(value) >= 1
    ),
  size: yup.string(),
  costValue: yup
    .string()
    .required('Este campo é obrigatório')
    .test(
      'is-valid',
      'Esse valor deve ser maior que 1',
      (value) => Number(value) >= 1
    ),
  costSale: yup
    .string()
    .required('Este campo é obrigatório')
    .test(
      'is-valid',
      'Esse valor deve ser maior que 1',
      (value) => Number(value) >= 1
    ),
  productType: yup.string().required('Este campo é obrigatório'),
  provider: yup.string(),
  description: yup.string(),
  productStockType: yup.string().required('Este campo é obrigatório'),
  date: yup.string().required('Este campo é obrigatório'),
});

function RegisterProduct() {
  const { state } = useLocation();
  const history = useHistory();
  const [categoryList, setCategoryList] = useState([]);
  const [categoryListFilter, setCategoryListFilter] = useState([]);
  const [providerList, setProviderList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showModalAddNewCategory, setShowModalAddNewCategory] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    setError,
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      date: new Date(),
    },
  });

  useEffect(() => {
    if (state && state.dataEdit) {
      const dateProdut = new Date(state.dataEdit.date);
      dateProdut.setDate(dateProdut.getDate());
      state.dataEdit.date = dateProdut.toISOString().substr(0, 10);
      state.dataEdit.category =
        state.dataEdit.category?._id || state.dataEdit.category;
      state.dataEdit.provider =
        state.dataEdit.provider?._id || state.dataEdit.provider;

      reset(state.dataEdit);
      setIsEdit(true);
    } else {
      reset({});
      setIsEdit(false);
    }
  }, [state]);

  const findCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategoryList(
        data.data.map((value) => ({
          value: value._id,
          text: value.label,
          productType: value.productType,
        }))
      );
      setCategoryListFilter(
        data.data.map((value) => ({
          value: value._id,
          text: value.label,
          productType: value.productType,
        }))
      );
    } catch (error) {
      toast.error(
        'Erro ao buscar categorias, por favor atualize a página ou tente mais tarde.'
      );
    }
  };

  useEffect(() => {
    const findProvider = async () => {
      try {
        const { data } = await api.get('/stakeholders');
        setProviderList(
          data.data
            .filter((value) => value.type === 'provider' && value.isActive)
            .map((value) => ({ value: value._id, text: value.name }))
        );
      } catch (error) {
        toast.error(
          'Erro ao buscar fornecedor, por favor atualize a página ou tente mais tarde'
        );
      }
    };

    findProvider();
    findCategories();
  }, []);

  const onSubmit = async (data, keepPage) => {
    try {
      setIsLoading(true);
      data.userId = '5fd4f81a30918238d4d6a8ef';

      if (!data.provider || data.provider === '') {
        delete data.provider;
      }

      if (!data.subcategory || data.subcategory === '') {
        delete data.subcategory;
      }

      if (isEdit) {
        await api.put(`/products/${state.dataEdit._id}`, data);

        if (state.urlToReturn) {
          history.push(state.urlToReturn);
        }
      } else {
        await api.post('/products', data);
        if (!keepPage) {
          history.push('products-list');
        }
      }

      reset({
        code: '',
        category: '',
        subcategory: '',
        amountStock: '',
        size: '',
        costValue: '',
        costSale: '',
        productType: '',
        provider: '',
        description: '',
        productStockType: '',
      });
      toast.success(
        `Produto ${isEdit ? 'editado' : 'cadastrado'} com sucesso!`
      );
    } catch (error) {
      toast.error(`Erro ao tentar ${isEdit ? 'editar' : 'cadastrar'} produto!`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCategoryListFilter(
      categoryList.filter(
        (value) =>
          (getValues('productType') === 'shoes' &&
            value.productType === 'shoes') ||
          (getValues('productType') === 'clothes' &&
            value.productType === 'clothes') ||
          (getValues('productType') === 'accessories' &&
            value.productType === 'accessories') ||
          (getValues('productType') === 'others' &&
            value.productType === 'others')
      )
    );
  }, [getValues('productType')]);

  const handleAddNewCategory = (refreshPage) => {
    setShowModalAddNewCategory(!showModalAddNewCategory);
    if (refreshPage) {
      findCategories();
    }
  };

  return (
    <Layout>
      <Layout.Content title="Cadastrar Produto">
        <ToastContainer />
        {showModalAddNewCategory && (
          <Modal handleModal={handleAddNewCategory} title="Adicionar Categoria">
            <RegisterCategory handleModal={handleAddNewCategory} />
          </Modal>
        )}
        <form>
          <div className={style.InputsContainer}>
            <Input
              setValue={setValue}
              setError={setError}
              name="code"
              text="Código"
              {...register('code')}
              errors={errors.code && errors.code.message}
              type="input"
              value={getValues('code')}
            />
            <Input
              setValue={setValue}
              setError={setError}
              name="description"
              text="Descrição"
              {...register('description')}
              errors={errors.description && errors.description.message}
              type="input"
              value={getValues('description')}
            />
            <Input
              setValue={setValue}
              setError={setError}
              name="date"
              text="Data da entrada"
              {...register('date')}
              errors={errors.date && errors.date.message}
              type="date"
              value={getValues('date')}
            />
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
            <div className={style.Category}>
              <Input
                setValue={setValue}
                setError={setError}
                name="category"
                text="Categoria"
                {...register('category')}
                errors={errors.category && errors.category.message}
                type="select"
                values={categoryListFilter}
                value={getValues('category')}
              />
              <button type="button" onClick={handleAddNewCategory}>
                <AiOutlineAppstoreAdd />
              </button>
            </div>
            <Input
              setValue={setValue}
              setError={setError}
              name="subcategory"
              text="Subcategoria"
              {...register('subcategory')}
              errors={errors.subcategory && errors.subcategory.message}
              type="select"
              values={subCategoryList}
              value={getValues('subcategory')}
            />
            <Input
              setValue={setValue}
              setError={setError}
              name="size"
              text="Tamanho"
              {...register('size')}
              errors={errors.size && errors.size.message}
              value={getValues('size')}
            />
            <Input
              setValue={setValue}
              setError={setError}
              name="productStockType"
              text="Tipo"
              {...register('productStockType')}
              errors={
                errors.productStockType && errors.productStockType.message
              }
              type="select"
              values={productStockTypeList}
              value={getValues('productStockType')}
            />
            <Input
              setValue={setValue}
              setError={setError}
              name="provider"
              text="Fornecedor"
              {...register('provider')}
              errors={errors.provider && errors.provider.message}
              type="select"
              values={providerList}
              value={getValues('provider')}
            />
            <Input
              setValue={setValue}
              setError={setError}
              name="amountStock"
              text="Quantidade em estoque"
              {...register('amountStock')}
              errors={errors.amountStock && errors.amountStock.message}
              type="number"
              value={getValues('amountStock')}
            />
            <Input
              setValue={setValue}
              setError={setError}
              name="costValue"
              text="Valor de custo"
              {...register('costValue')}
              errors={errors.costValue && errors.costValue.message}
              type="number"
              value={getValues('costValue')}
            />
            <Input
              setValue={setValue}
              setError={setError}
              name="costSale"
              text="Valor de venda"
              {...register('costSale')}
              errors={errors.costSale && errors.costSale.message}
              type="number"
              value={getValues('costSale')}
            />
          </div>
          <div className={style.ButtonsSaveOrCancelContainer}>
            <ButtonSecondary
              text="Cancelar"
              disabled={isLoading}
              onClick={() => history.push('products-list')}
            />
            {!isEdit && (
              <Button
                text="Cadastrar e continuar cadastrando"
                disabled={isLoading}
                onClick={handleSubmit((data) => onSubmit(data, true))}
              />
            )}
            <Button
              text={isEdit ? 'Editar' : 'Cadastrar e voltar para lista'}
              disabled={isLoading}
              onClick={handleSubmit((data) => onSubmit(data, false))}
            />
          </div>
        </form>
      </Layout.Content>
    </Layout>
  );
}

export default RegisterProduct;
