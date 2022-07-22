import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { MdDeleteForever, MdModeEdit } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import Layout from '../layouts';
import api from '../../services/api';
import style from './products-list.module.scss';
import Loader from '../components/loading';

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
    let existSale = false;
    const sale = sales.map((saleData) => {
      const productExist = saleData.products.filter(
        (product) => product.product === idRemove
      );

      if (productExist.length > 0) {
        existSale = true;
      }
      return saleData;
    });

    console.log(sale, existSale, name);

    if (existSale) {
      toast.error(
        'Esta ação nao pode ser realizada pois já existe uma venda registrada com este produto'
      );
    } else {
      await api.delete(`/products/${idRemove}`);
      toast.success(`O produto ${name} foi deletado com sucesso!`);
      findProducts();
    }
  };

  return (
    <Layout>
      <Layout.Content>
        <ToastContainer />
        <div className={style.Container}>
          {loading ? (
            <div className={style.Loader}>
              <Loader />
            </div>
          ) : (
            <div className={style.Table}>
              <div className={style.TableItem}>
                <p className={style.TableTitle}>Data</p>
                <p className={style.TableTitle}>Produto</p>
                <p className={style.TableTitle}>Descrição</p>
                <p className={style.TableTitle}>Valor de venda</p>
                <p className={style.TableTitle}>Estoque</p>
                <p />
              </div>

              {products.map((product) => (
                <div key={product._id} className={style.TableItem}>
                  <p>{new Date(product.date).toLocaleDateString()}</p>
                  <p>{product.category.label}</p>
                  <p>{product.description}</p>
                  <p>{`R$${product.costSale}`}</p>
                  <p
                    style={{
                      color: product.amountStock >= 1 ? '#388E3C' : '#D32F2F',
                    }}
                  >
                    {product.amountStock >= 1
                      ? product.amountStock
                      : 'Sem estoque'}
                  </p>
                  <div className={style.ButtonContainer}>
                    <button onClick={() => handleEdit(product)} type="button">
                      <MdModeEdit className={style.EditButton} />
                    </button>
                    <button
                      onClick={() =>
                        handleRemove(product._id, product.category.label)
                      }
                      type="button"
                    >
                      <MdDeleteForever className={style.DeleteButton} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Layout.Content>
    </Layout>
  );
}

export default RegisterProduct;
