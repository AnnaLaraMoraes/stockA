/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ToastContainer, toast } from 'react-toastify';
import { useLocation, useHistory } from 'react-router-dom';
import style from './register-sale.module.scss';
import Layout from '../layouts';
import Input from '../components/input';
import Button from '../components/button';
import api from '../../services/api';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../components/loading';
import emptyImage from '../../static/images/empty.svg';
import ButtonSecondary from '../components/button-secondary';

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
  const [productsToRemove, setProductsToRemove] = useState([]);
  const [loading, setLoading] = useState(false);
  const { state } = useLocation();
  const [isEdit, setIsEdit] = useState(false);
  const history = useHistory();

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
                text: `${value.category.label}, ${value.code}, ${value.description}, R$${value.costSale}`,
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

  const ArraySchema = {
    product: yup.string().required('Este campo é obrigatório'),
    amount: yup
      .string()
      .required('Informe a quantidade')
      .when('product', (product, field) =>
        product
          ? field.test(
              'is-valid',
              'Quantidade insuficiente em estoque',
              (value) => {
                const productValue = productsComplete.find(
                  (productData) => productData._id === product
                );
                return true; // Number(value) <= productValue.amountStock;
              }
            )
          : field
      ),
  };

  const schema = yup.object({
    // paymentType: yup.string().required('Este campo é obrigatório'),
    // divided: yup.string(),
    // date: yup.string().required('Este campo é obrigatório'),
    // client: yup.string(),
    // employee: yup.string(),
    // comments: yup.string(),
    // products: yup
    //   .array()
    //   .of(yup.object().shape(ArraySchema))
    //   .required('Must have fields')
    //   .min(1, 'Minimum of 1 field'),
  });

  const { register, errors, handleSubmit, reset, control } = useForm({
    resolver: yupResolver(schema),
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'products',
  });

  const onSubmit = async (data) => {
    if (!data.products || data.products.length < 1) {
      toast.error('Adicione pelo menos 1 produto');
    }
    if (data && data.products) {
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
                  (value) => value.product === product.product
                )
              : '',
        };
      });

      const { totalValue } = data.products.reduce(
        (accumulator, sale) => {
          accumulator.totalValue += sale.value * sale.amount;

          return accumulator;
        },
        {
          totalValue: 0,
        }
      );

      data.totalValue = totalValue;

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

      // state.dataEdit.products = state.dataEdit.products.map(
      //   (productData, index) => ({
      //     [`products.${index}.product`]: productData.product,
      //     [`products.${index}.amount`]: productData.amount,
      //   })
      // );

      /**    `products.${index}.product`: productData.product,
        `products.${index}.amount`: productData.amount, */
      reset(state.dataEdit);
    } else {
      reset({});
      setIsEdit(false);
    }
  }, [state]);

  return (
    <Layout>
      <Layout.Content>
        <div className={style.Container}>
          <ToastContainer />
          <div className={style.Form}>
            <div className={style.FormItem}>
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
            </div>
            <div className={style.FormItem}>
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
            <p className={style.TableTitle}>
              {isEdit
                ? 'Lista dos produtos vendidos'
                : 'Selecione os produtos a serem vedidos'}
            </p>
            <div className={style.ListProducts}>
              <ul>
                {fields.map((item, index) => (
                  <li key={item.id}>
                    <Input
                      name={`products.${index}.product`}
                      text={isEdit ? 'Produto' : 'Selecione o produto'}
                      value={item ? item.product : ''}
                      register={register}
                      type="select"
                      values={products}
                      errors={
                        errors.products &&
                        errors.products.length > 0 &&
                        errors.products[index] &&
                        errors.products[index].product
                          ? errors.products[index].product.message
                          : ''
                      }
                    />
                    <Input
                      name={`products.${index}.amount`}
                      text="Quantidade do produto"
                      defaultValue={item ? item.amount : ''}
                      register={register}
                      type="number"
                      min="0"
                      errors={
                        errors.products &&
                        errors.products.length > 0 &&
                        errors.products[index] &&
                        errors.products[index].amount
                          ? errors.products[index].amount.message
                          : ''
                      }
                    />
                    <ButtonSecondary
                      text="Remover"
                      disabled={isLoading}
                      onClick={() => {
                        remove(index);
                        setProductsToRemove([
                          ...productsToRemove,
                          { id: item.product, amount: item.amount },
                        ]);
                      }}
                      style={{ marginLeft: 0 }}
                    />
                  </li>
                ))}
              </ul>
              <Button
                text="Adicionar produto"
                disabled={isLoading}
                onClick={() => append({})}
              />
            </div>
            {/* <div className={style.Table}>
              {loading ? (
                <div className={style.Loader}>
                  <Loading />
                </div>
              ) : (
                <>
                  {products.length > 0 ? (
                    products
                      .filter((value) => value.amountStock >= 1)
                      .map((product) => {
                        console.log(
                          'PRODUCT..',
                          product,
                          getValues('products[0]')
                        );
                        return (
                          <div className={style.TableItem} key={product._id}>
                            <div className={style.CheckBox}>
                              <Input
                                name="products"
                                text=""
                                register={register}
                                value={product._id}
                                errors={
                                  errors.products && errors.products.message
                                }
                                type="checkbox"
                              />
                            </div>
                            <p>{product.code}</p>
                            <p>{product.category.label}</p>
                            <p>{product.description}</p>
                            <p>{`R$${product.costSale}`}</p>
                            <p>{`${product.amountStock} Em estoque`}</p>
                            <input
                              type="number"
                              min="1"
                              max={product.amountStock}
                              name="amount"
                              placeholder="Qtd."
                              onBlur={(e) => {
                                if (e.target.value > product.amountStock) {
                                  toast.error(
                                    `Essa qtd. de ${product.description} não pode ser cadastrada pois é maior a no estoque!`
                                  );
                                } else {
                                  setProductsAmount([
                                    ...productsAmount.filter(
                                      (data) => data.product !== product._id
                                    ),
                                    {
                                      product: product._id,
                                      amount: e.target.value,
                                      value: product.costSale,
                                    },
                                  ]);
                                }
                              }}
                            />
                          </div>
                        );
                      })
                  ) : (
                    <div className={style.EmptyImage}>
                      <img
                        style={{ width: '30vw' }}
                        src={emptyImage}
                        alt="Footer Action"
                      />
                      <p>Não há produtos cadastrados</p>
                    </div>
                  )}
                </>
              )}
            </div> */}
            {!loading && products.length > 0 && (
              <div className={style.FormButton}>
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
          </div>
        </div>
      </Layout.Content>
    </Layout>
  );
}

export default RegisterStakeholders;
