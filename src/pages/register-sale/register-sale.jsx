/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ToastContainer, toast } from 'react-toastify';
import { useLocation, useHistory } from 'react-router-dom';
import { MdDeleteForever } from 'react-icons/md';
import { RiUserAddFill } from 'react-icons/ri';
import style from './register-sale.module.scss';
import Layout from '../layouts';
import Input from '../components/input';
import Button from '../components/button';
import api from '../../services/api';
import 'react-toastify/dist/ReactToastify.css';
import ButtonSecondary from '../components/button-secondary';
import { AddProductToSale } from './add-product-to-sale';
import Modal from '../components/modal';
import RegisterStakeholders from '../register-stakeholders/register-stakeholders';

const paymentTypeList = [
  { value: 'cash', text: 'Dinheiro' },
  { value: 'creditCard', text: 'Cartão de crédito' },
];

function RegisterSale() {
  const [isLoading, setIsLoading] = useState(false);
  const [clientList, setClientList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsComplete, setProductsComplete] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [testProducts, setTestProducts] = useState([]);
  const [showModalAddNewProduct, setShowModalAddNewProduct] = useState(false);
  const [showModalAddNewClient, setShowModalAddNewClient] = useState(false);
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
  });

  // GET PRODUCTS AND STAKESHOLDERS

  const findCustomers = async () => {
    try {
      const { data } = await api.get('/stakeholders');
      setClientList(
        data.data
          .filter((value) => value.type === 'client' && value.isActive)
          .map((value) => ({ value: value._id, text: value.name }))
      );
    } catch (error) {
      toast.error(
        'Erro ao buscar clientes, por favor atualize a página ou tente mais tarde'
      );
    }
  };

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
            .filter((value) => value.type === 'client' && value.isActive)
            .map((value) => ({ value: value._id, text: value.name }))
        );
        setEmployeeList(
          data.data
            .filter((value) => value.type === 'employee' && value.isActive)
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
      state.dataEdit.client =
        state.dataEdit.client?._id || state.dataEdit.client;

      reset(state.dataEdit);

      setTestProducts(
        state.dataEdit?.products?.map((prod) => ({ ...prod, ...prod.product }))
      );
    } else {
      reset({});
      setIsEdit(false);
    }
  }, [state]);

  // SUBMIT

  const onSubmit = async (data) => {
    if (testProducts?.length < 1) {
      toast.error('Adicione pelo menos 1 produto');
    }

    if (!data.employee || data.employee === '') {
      delete data.employee;
    }

    if (!data.client || data.client === '') {
      delete data.client;
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

  const HandleAddNewClient = (refreshPage) => {
    setShowModalAddNewClient(!showModalAddNewClient);
    if (refreshPage) {
      findCustomers();
    }
  };

  return (
    <Layout>
      <Layout.Content title="Cadastrar Venda">
        <ToastContainer />
        {showModalAddNewProduct && (
          <AddProductToSale
            products={products}
            AddNewProduct={AddNewProduct}
            HandleModal={HandleModal}
          />
        )}
        {showModalAddNewClient && (
          <Modal handleModal={HandleAddNewClient} title="Adicionar Cliente">
            <RegisterStakeholders handleModal={HandleAddNewClient} />
          </Modal>
        )}
        <form>
          <div className={style.InputsContainer}>
            <Input
              setValue={setValue}
              setError={setError}
              {...register('paymentType')}
              value={getValues('paymentType')}
              name="paymentType"
              text="Tipo de pagamento"
              errors={errors.paymentType && errors.paymentType.message}
              type="select"
              values={paymentTypeList}
            />
            <Input
              setValue={setValue}
              setError={setError}
              {...register('divided')}
              value={getValues('divided')}
              name="divided"
              text="Dividido em"
              errors={errors.divided && errors.divided.message}
              type="number"
              min="0"
            />
            <Input
              setValue={setValue}
              setError={setError}
              {...register('date')}
              value={getValues('date')}
              name="date"
              text="Data da venda"
              errors={errors.date && errors.date.message}
              type="date"
            />
            <div className={style.ClientContainer}>
              <Input
                setValue={setValue}
                setError={setError}
                {...register('client')}
                value={getValues('client')}
                name="client"
                text="Cliente"
                errors={errors.client && errors.client.message}
                type="select"
                values={clientList}
              />
              <button type="button" onClick={HandleAddNewClient}>
                <RiUserAddFill />
              </button>
            </div>
            <Input
              setValue={setValue}
              setError={setError}
              {...register('employee')}
              value={getValues('employee')}
              name="employee"
              text="Vendido por"
              errors={errors.employee && errors.employee.message}
              type="select"
              values={employeeList}
            />
            <Input
              setValue={setValue}
              setError={setError}
              {...register('comments')}
              value={getValues('comments')}
              name="comments"
              text="Observações"
              errors={errors.comments && errors.comments.message}
              type="input"
            />
          </div>
          <div style={{ overflowX: 'auto', marginTop: 16, marginBottom: 16 }}>
            <table>
              <tbody>
                <tr>
                  <th>Excluir</th>
                  <th>Produto</th>
                  <th>Código</th>
                  <th>Descrição</th>
                  <th>Valor</th>
                  <th>Quantidade</th>
                </tr>
                {testProducts?.length > 0 &&
                  testProducts.map((product) => (
                    <tr>
                      <td key={product._id}>
                        <button
                          className={style.ButtonDeleteProduct}
                          disabled={isLoading}
                          onClick={() => RemoveProductFromSale(product)}
                          type="button"
                        >
                          <MdDeleteForever />
                        </button>
                      </td>
                      <td>{product.category.label}</td>
                      <td>{`cod.: ${product.code}`}</td>
                      <td>{product.description}</td>
                      <td>{`R$${product.costSale}`}</td>
                      <td>{`${product.amount} unidade(s)`}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <Button
            text="Adicionar produto +"
            disabled={isLoading}
            onClick={HandleModal}
            style={{ marginTop: 16 }}
          />
          {!loading && testProducts?.length > 0 && (
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

export default RegisterSale;
