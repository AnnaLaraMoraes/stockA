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
  const [productsToRemove, setProductsToRemove] = useState([]);

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

  // GET PRODUCTS AND STAKESHOLDERS

  useEffect(() => {
    const findProducts = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/products', {
          params: {
            userId: '',
          },
        });
        setProducts(data && data.products ? data.products : []);
        setProductsComplete(data && data.products ? data.products : []);
      } catch (error) {
        toast.error(
          'Erro ao buscar fornecedor, por favor atualize a página ou tente mais tarde'
        );
      } finally {
        setLoading(false);
      }
    };

    findProducts();

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

  // GET PRODUCTS AND STAKESHOLDERS END

  useEffect(() => {
    if (state && state.dataEdit) {
      setIsEdit(true);
      const dateProdut = new Date(state.dataEdit.date);
      dateProdut.setDate(dateProdut.getDate());

      state.dataEdit.date = dateProdut.toISOString().substr(0, 10);

      reset(state.dataEdit);

      setTestProducts(
        state.dataEdit.products.map((prod) => ({ ...prod, ...prod.product }))
      );
    } else {
      reset({});
      setIsEdit(false);
    }
  }, [state]);

  // SUBMIT

  const onSubmit = async (data) => {
    if (testProducts.length < 1) {
      toast.error('Adicione pelo menos 1 produto');
    }

    data.products = testProducts.map((dataProd) => ({
      product: dataProd._id,
      amount: dataProd.amount,
      value: dataProd.costSale * dataProd.amount,
    }));

    const { totalValue } = testProducts.reduce(
      (accumulator, sale) => {
        accumulator.totalValue += Number(sale.costSale) * Number(sale.amount);

        return accumulator;
      },
      {
        totalValue: 0,
      }
    );

    data.totalValue = totalValue;

    if (state && state.dataEdit) {
      data.products = data.products.map((product) => {
        const productValue = productsComplete.find(
          (productData) => productData._id === product.product
        );

        return {
          ...product,
          value: productValue?.costSale || 0,
          lastData:
            state && state.dataEdit
              ? state.dataEdit.products.find(
                  (value) => value.product._id === product.product
                )
              : '',
        };
      });
    }

    if (productsToRemove) {
      data.productsToRemove = productsToRemove;
    }

    try {
      setIsLoading(true);
      data.userId = '5fd4f81a30918238d4d6a8ef';

      if (isEdit) {
        await api.put(`/sales/${state.dataEdit._id}`, data);

        if (state.urlToReturn) {
          history.push(state.urlToReturn);
        }
      } else {
        await api.post('/sales', data);
        history.push('sales-list');
      }

      toast.success('Venda cadastrada com sucesso!');
    } catch (error) {
      toast.error('Erro ao cadastrar venda, tente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  // SUBMIT END

  // HANDLE SALE FUNCTIONS

  const AddNewProduct = (newProduct) => {
    setTestProducts([...testProducts, newProduct]);
    setShowModalAddNewProduct(!showModalAddNewProduct);

    setProducts(products.filter((product) => product._id !== newProduct._id));
  };

  const HandleModal = () => {
    setShowModalAddNewProduct(!showModalAddNewProduct);
  };

  const RemoveProductFromSale = (productToRemove) => {
    setTestProducts(
      testProducts.filter((product) => product._id !== productToRemove._id)
    );

    setProducts([...products, productToRemove]);

    if (isEdit) {
      setProductsToRemove([
        ...productsToRemove,
        { id: productToRemove._id, amount: productToRemove.amount },
      ]);
    }
  };

  // HANDLE SALE FUNCTIONS END

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
                <li className={style.ProductList} key={product._id}>
                  <button
                    className={style.ButtonDeleteProduct}
                    disabled={isLoading}
                    onClick={() => RemoveProductFromSale(product)}
                    type="button"
                  >
                    <MdDeleteForever />
                  </button>
                  <span>{product.category.label}</span>
                  <span>{`cod.: ${product.code}`}</span>
                  <span>{product.description}</span>
                  <span>{`R$${product.costSale}`}</span>
                  <span>{`${product.amount} unidade(s)`}</span>
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
