/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ToastContainer, toast } from 'react-toastify';
import { useLocation, useHistory } from 'react-router-dom';
import { MdDeleteForever, MdModeEdit } from 'react-icons/md';
import style from './register-sale.module.scss';
import Layout from '../layouts';
import Input from '../components/input';
import Button from '../components/button';
import api from '../../services/api';
import 'react-toastify/dist/ReactToastify.css';
import ButtonSecondary from '../components/button-secondary';
import { AddProductToSale } from './add-product-to-sale';

const paymentTypeList = [
  { value: 'cash', text: 'Dinheiro' },
  { value: 'creditCard', text: 'Cartão de crédito' },
];

function RegisterStakeholders() {
  const [isLoading, setIsLoading] = useState(false);
  const [clientList, setClientList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsComplete, setProductsComplete] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [testProducts, setTestProducts] = useState([]);
  const [showModalAddNewProduct, setShowModalAddNewProduct] = useState(false);

  const { state } = useLocation();
  const history = useHistory();

  const schema = yup.object({
    paymentType: yup.string().required('Este campo é obrigatório'),
    divided: yup.string(),
    date: yup.string().required('Este campo é obrigatório'),
    client: yup.string(),
    employee: yup.string(),
    comments: yup.string(),
  });

  const { register, errors, handleSubmit, reset, control } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const findProducts = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/products', {
          params: {
            userId: '',
          },
        });
        setProducts(
          data && data.products
            ? data.products.map((value) => ({
                value: value._id,
                text: `${value.category.label} | cod.: ${value.code} | ${value.description} | R$${value.costSale} | disponível: ${value.amountStock} unidade(s)`,
                amountStock: value.amountStock,
                costSale: value.costSale,
              }))
            : []
        );
        setProductsComplete(data.products);
      } catch (error) {
        toast.error(
          'Erro ao buscar fornecedor, por favor atualize a página ou tente mais tarde'
        );
      } finally {
        setLoading(false);
      }
    };

    findProducts();
  }, []);

  const onSubmit = async (data) => {
    if (testProducts.length < 1) {
      toast.error('Adicione pelo menos 1 produto');
    }

    data.products = testProducts.map((dataProd) => ({
      product: dataProd.prodSelected.value,
      amount: dataProd.prodAmount,
      value: dataProd.prodSelected.costSale * dataProd.prodAmount,
    }));

    const { totalValue } = testProducts.reduce(
      (accumulator, sale) => {
        accumulator.totalValue +=
          Number(sale.prodSelected.costSale) * Number(sale.prodAmount);

        return accumulator;
      },
      {
        totalValue: 0,
      }
    );

    data.totalValue = totalValue;

    // if (state && state.dataEdit) {
    //   data.dataEdit = state.dataEdit.products;
    // }

    try {
      setIsLoading(true);
      data.userId = '5fd4f81a30918238d4d6a8ef';

      // if (isEdit) {
      //   await api.put(`/sales/${state.dataEdit._id}`, data);

      //   if (state.urlToReturn) {
      //     history.push(state.urlToReturn);
      //   }
      // } else {
      await api.post('/sales', data);
      history.push('sales-list');
      // }

      toast.success('Venda cadastrada com sucesso!');
    } catch (error) {
      toast.error('Erro ao cadastrar venda, tente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const findProvider = async () => {
      try {
        const { data } = await api.get('/stakeholders');
        setClientList(
          data.data
            .filter((value) => value.type === 'client')
            .map((value) => ({ value: value._id, text: value.name }))
        );
        setEmployeeList(
          data.data
            .filter((value) => value.type === 'employee')
            .map((value) => ({ value: value._id, text: value.name }))
        );
      } catch (error) {
        toast.error(
          'Erro ao buscar fornecedor, por favor atualize a página ou tente mais tarde'
        );
      }
    };

    findProvider();
  }, []);

  useEffect(() => {
    if (state && state.dataEdit) {
      setIsEdit(true);
      const dateProdut = new Date(state.dataEdit.date);
      dateProdut.setDate(dateProdut.getDate());
      state.dataEdit.date = dateProdut.toISOString().substr(0, 10);
      reset(state.dataEdit);
    } else {
      reset({});
      setIsEdit(false);
    }
  }, [state]);

  const AddNewProduct = (newProduct) => {
    setTestProducts([...testProducts, newProduct]);

    setShowModalAddNewProduct(!showModalAddNewProduct);

    setProducts(
      products.filter(
        (product) => product.value !== newProduct.prodSelected.value
      )
    );
  };

  const HandleModal = () => {
    setShowModalAddNewProduct(!showModalAddNewProduct);
  };

  const RemoveProductFromSale = (productToRemove) => {
    setTestProducts(
      testProducts.filter(
        (product) => product.prodSelected.value !== productToRemove.value
      )
    );

    setProducts([...products, productToRemove]);
  };

  return (
    <Layout>
      <Layout.Content>
        <ToastContainer />
        {showModalAddNewProduct && (
          <AddProductToSale
            products={products}
            AddNewProduct={AddNewProduct}
            HandleModal={HandleModal}
          />
        )}
        <form>
          <div className={style.InputsContainer}>
            <Input
              name="paymentType"
              text="Tipo de pagamento"
              register={register}
              errors={errors.paymentType && errors.paymentType.message}
              type="select"
              values={paymentTypeList}
            />
            <Input
              name="divided"
              text="Dividido em"
              register={register}
              errors={errors.divided && errors.divided.message}
              type="number"
              min="0"
            />
            <Input
              name="date"
              text="Data da venda"
              register={register}
              errors={errors.date && errors.date.message}
              type="date"
            />
            <Input
              name="client"
              text="Cliente"
              register={register}
              errors={errors.client && errors.client.message}
              type="select"
              values={clientList}
            />
            <Input
              name="employee"
              text="Vendido por"
              register={register}
              errors={errors.employee && errors.employee.message}
              type="select"
              values={employeeList}
            />
            <Input
              name="comments"
              text="Observações"
              register={register}
              errors={errors.comments && errors.comments.message}
              type="input"
            />
          </div>
          <ul>
            {testProducts.length > 0 &&
              testProducts.map((product) => (
                <li
                  className={style.ProductList}
                  key={product.prodSelected.value}
                >
                  <button
                    className={style.ButtonDeleteProduct}
                    disabled={isLoading}
                    onClick={() => RemoveProductFromSale(product.prodSelected)}
                    type="button"
                  >
                    <MdDeleteForever />
                  </button>
                  {product.prodSelected.text}
                  <span>{`${product.prodAmount} unidade(s)`}</span>
                </li>
              ))}
          </ul>
          <Button
            text="Adicionar produto"
            disabled={isLoading}
            onClick={HandleModal}
            style={{ marginTop: 16 }}
          />
          {!loading && testProducts.length > 0 && (
            <div className={style.ButtonsSaveOrCancelContainer}>
              <ButtonSecondary
                text="Cancelar"
                disabled={isLoading}
                onClick={() => history.push('sales-list')}
              />
              <Button
                text={isEdit ? 'Salvar' : 'Registrar venda'}
                disabled={isLoading}
                onClick={handleSubmit(onSubmit)}
              />
            </div>
          )}
        </form>
      </Layout.Content>
    </Layout>
  );
}

export default RegisterStakeholders;
