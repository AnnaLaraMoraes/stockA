/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { MdDeleteForever, MdModeEdit } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import Layout from '../layouts';
import api from '../../services/api';
import style from './products-list.module.scss';
import Loader from '../components/loading';
import Card from './components/index';
import emptyImg from '../../static/images/undraw_empty_re_opql.svg';

function RegisterProduct() {
  const history = useHistory();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sales, setSales] = useState([]);

  const findSales = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/sales');
      setSales(data && data.sales ? data.sales : []);
      setLoading(false);
    } catch (error) {
      toast.error(
        'Erro ao buscar vendas, por favor atualize a página ou tente mais tarde'
      );
    }
  };

  useEffect(() => {
    findSales();
  }, []);

  const findProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/products', {
        params: {
          userId: '',
        },
      });

      setProducts(data.products);
      setLoading(false);
    } catch (error) {
      toast.error(
        'Erro ao buscar fornecedor, por favor atualize a página ou tente mais tarde'
      );
    }
  };

  useEffect(() => {
    findProducts();
  }, []);

  const handleEdit = (dataEdit) => {
    history.push('/register-product', {
      dataEdit,
      urlToReturn: '/products-list',
    });
  };

  const handleRemove = async (idRemove, name) => {
    const confirm = window.confirm(
      'você realmente deseja remover este produto?'
    );

    if (confirm) {
      let existSale = false;
      sales.map((saleData) => {
        const productExist = saleData.products.filter(
          (product) => product.product._id === idRemove
        );

        if (productExist.length > 0) {
          existSale = true;
        }
        return saleData;
      });

      if (existSale) {
        toast.error(
          'Esta ação nao pode ser realizada pois existe uma venda registrada com este produto'
        );
      } else {
        await api.delete(`/products/${idRemove}`);
        toast.success(`O produto ${name} foi deletado com sucesso!`);
        findProducts();
      }
    }
  };

  return (
    <Layout>
      <Layout.Content title="Produtos">
        <ToastContainer />
        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <div className={style.Loader}>
              <Loader />
            </div>
          ) : (
            <>
              {products && products.length > 0 ? (
                <>
                  <div className={style.Card}>
                    {products.map((product) => {
                      const dataFormated = {
                        ...product,
                        _id: product._id,
                        categoryLabel: product.category.label,
                        description: product.description,
                        code: product.code,
                        costSale: product.costSale,
                        costValue: product.costValue,
                        amountStock: product.amountStock,
                        date: product.date,
                      };
                      return (
                        <Card
                          data={dataFormated}
                          key={product._id}
                          handleRemove={handleRemove}
                          handleEdit={handleEdit}
                        />
                      );
                    })}
                  </div>
                  <table className={style.Table}>
                    <tbody>
                      <tr>
                        <th>Produto</th>
                        <th>Descrição</th>
                        <th>Código</th>
                        <th>Valor de custo</th>
                        <th>Valor de venda</th>
                        <th>Lucro</th>
                        <th>Estoque</th>
                        <th>Data</th>
                        <th>Editar</th>
                        <th>Excluir</th>
                      </tr>

                      {products.map((product) => (
                        <tr key={product._id}>
                          <td>{product.category.label}</td>
                          <td>{product.description}</td>
                          <td>{product.code}</td>
                          <td>{`R$${product.costValue}`}</td>
                          <td>{`R$${product.costSale}`}</td>
                          <td>{`R$${
                            product.costSale - product.costValue
                          } `}</td>
                          <td
                            style={{
                              color:
                                product.amountStock >= 1
                                  ? '#388E3C'
                                  : '#D32F2F',
                            }}
                          >
                            {product.amountStock >= 1
                              ? product.amountStock
                              : 'Sem estoque'}
                          </td>
                          <td>{new Date(product.date).toLocaleDateString()}</td>
                          <td>
                            <button
                              className={style.EditButton}
                              onClick={() => handleEdit(product)}
                              type="button"
                            >
                              <MdModeEdit />
                            </button>
                          </td>
                          <td>
                            <button
                              className={style.DeleteButton}
                              onClick={() =>
                                handleRemove(
                                  product._id,
                                  product.category.label
                                )
                              }
                              type="button"
                            >
                              <MdDeleteForever />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : (
                <div className={style.Emptyimg}>
                  <h1>Não há produtos cadastrados</h1>
                  <img alt="Não existem produtos" src={emptyImg} />
                </div>
              )}
            </>
          )}
        </div>
      </Layout.Content>
    </Layout>
  );
}

export default RegisterProduct;
