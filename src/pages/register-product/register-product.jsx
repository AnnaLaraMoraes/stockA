import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ToastContainer, toast } from 'react-toastify';
import { useLocation, useHistory } from 'react-router-dom';
import style from './register-product.module.scss';
import Layout from '../layouts';
import Input from '../components/input';
import Button from '../components/button';
import ButtonSecondary from '../components/button-secondary';
import api from '../../services/api';
import 'react-toastify/dist/ReactToastify.css';

const productTypeList = [
  { value: 'clothes', text: 'Roupas' },
  { value: 'shoes', text: 'Sapatos' },
  { value: 'accessories', text: 'Acessórios' },
];

const subCategoryList = [
  { value: 'female', text: 'Femino' },
  { value: 'male', text: 'Masculino' },
  { value: 'boy', text: 'Menino' },
  { value: 'girl', text: 'Menina' },
];

const productStockTypeList = [
  { value: 'retail', text: 'Varejo' },
  { value: 'wholesale', text: 'Atacado' },
];

const schema = yup.object({
  code: yup.string().required('Este campo é obrigatório'),
  category: yup.string().required('Este campo é obrigatório'),
  subcategory: yup.string().required('Este campo é obrigatório'),
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

  const { register, errors, handleSubmit, reset } = useForm({
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

      reset(state.dataEdit);
      setIsEdit(true);
    } else {
      reset({});
      setIsEdit(false);
    }
  }, [state]);

  useEffect(() => {
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

    const findProvider = async () => {
      try {
        const { data } = await api.get('/stakeholders');
        setProviderList(
          data.data
            .filter((value) => value.type === 'provider')
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

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      data.userId = '5fd4f81a30918238d4d6a8ef';

      if (!data.provider || data.provider === '') {
        delete data.provider;
      }

      if (isEdit) {
        await api.put(`/products/${state.dataEdit._id}`, data);

        if (state.urlToReturn) {
          history.push(state.urlToReturn);
        }
      } else {
        await api.post('/products', data);
        history.push('products-list');
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

  const changeProductType = (type) => {
    setCategoryListFilter(
      categoryList.filter(
        (value) =>
          (type === 'shoes' && value.productType === 'shoes') ||
          (type === 'clothes' && value.productType === 'clothes') ||
          (type === 'accessories' && value.productType === 'accessories')
      )
    );
  };

  return (
    <Layout>
      <Layout.Content>
        <ToastContainer />
        <form>
          <div className={style.InputsContainer}>
            <Input
              name="code"
              text="Código"
              register={register}
              errors={errors.code && errors.code.message}
              type="input"
            />
            <Input
              name="productType"
              text="Tipo de produto"
              register={register}
              errors={errors.productType && errors.productType.message}
              type="select"
              onChange={(e) => changeProductType(e.target.value)}
              values={productTypeList}
            />
            <Input
              name="category"
              text="Categoria"
              register={register}
              errors={errors.category && errors.category.message}
              type="select"
              values={categoryListFilter}
            />
            <Input
              name="subcategory"
              text="Subcategoria"
              register={register}
              errors={errors.subcategory && errors.subcategory.message}
              type="select"
              values={subCategoryList}
            />
            <Input
              name="amountStock"
              text="Quantidade em estoque"
              register={register}
              errors={errors.amountStock && errors.amountStock.message}
              type="number"
            />
            <Input
              name="size"
              text="Tamanho"
              register={register}
              errors={errors.size && errors.size.message}
              type="number"
            />
            <Input
              name="costValue"
              text="Valor de custo"
              register={register}
              errors={errors.costValue && errors.costValue.message}
              type="number"
            />

            <Input
              name="costSale"
              text="Valor de venda"
              register={register}
              errors={errors.costSale && errors.costSale.message}
              type="number"
            />
            <Input
              name="productStockType"
              text="Tipo"
              register={register}
              errors={
                errors.productStockType && errors.productStockType.message
              }
              type="select"
              values={productStockTypeList}
            />
            <Input
              name="provider"
              text="Fornecedor"
              register={register}
              errors={errors.provider && errors.provider.message}
              type="select"
              values={providerList}
            />
            <Input
              name="description"
              text="Descrição"
              register={register}
              errors={errors.description && errors.description.message}
              type="input"
            />
            <Input
              name="date"
              text="Data da entrada"
              register={register}
              errors={errors.date && errors.date.message}
              type="date"
            />
          </div>
          <div className={style.ButtonsSaveOrCancelContainer}>
            <ButtonSecondary
              text="Cancelar"
              disabled={isLoading}
              onClick={() => history.push('products-list')}
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

export default RegisterProduct;
