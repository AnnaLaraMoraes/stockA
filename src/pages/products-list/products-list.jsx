/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { MdDeleteForever, MdModeEdit, MdDetails } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import Layout from '../layouts';
import api from '../../services/api';
import style from './products-list.module.scss';
import Loader from '../components/loading';
import Button from '../components/button';

function RegisterProduct() {
  const history = useHistory();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sales, setSales] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [detailsID, setDetailsID] = useState("");

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
      console.log(data)
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

  const findSale = (id) => {
    let productExist = []
    sales.map((saleData) => {
       productExist = saleData.products.filter(
        (product) => product.product === id
      );

      return productExist
    });

    if (productExist.length > 0) {
      return productExist
    }

    return false
  }

  const handleRemove = async (idRemove, name) => {
    if (findSale(idRemove)) {
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
            <table>
              <tr>
                <th>Código</th>
                <th>Produto</th>
                <th>Descrição</th>
                <th>Valor de venda</th>
                <th>Estoque</th>
                <th>Detalhes | Editar | Excluir</th>
              </tr>

              {products.map((product) => (
                <>
                <tr key={product._id}>
                  <td>{product.code}</td>
                  <td>{product.category.label}</td>
                  <td>{product.description}</td>
                  <td>{`R$${product.costSale}`}</td>
                  <td
                    style={{
                      color: product.amountStock >= 1 ? '#388E3C' : '#D32F2F',
                    }}
                  >
                    {product.amountStock >= 1
                      ? product.amountStock
                      : 'Sem estoque'}
                  </td>
                  <td className={style.ButtonTable}>
                    <button
                      title={showDetails && detailsID === product._id ? "Esconder detalhes" : "Ver detalhes"}
                      onClick={
                        () => {
                        setShowDetails(!showDetails);
                        setDetailsID(product._id);
                      }}
                      type="button"
                    >
                      <MdDetails className={style.EditButton} style={{transform: showDetails && detailsID === product._id ? `rotate(180deg)` : `rotate(0deg)` }}/>
                    </button>
                    <button title="Editar" onClick={() => handleEdit(product)} type="button">
                      <MdModeEdit className={style.EditButton} />
                    </button>
                    <button
                      title="Excluir"
                      onClick={() =>
                        handleRemove(product._id, product.category.label)
                      }
                      type="button"
                    >
                      <MdDeleteForever className={style.DeleteButton} />
                    </button>
                  </td>
                </tr>
                  {showDetails && detailsID === product._id && (
                    <tr className={style.ProductDetails}>
                      <td>Data de entrada: {new Date(product.date).toLocaleDateString()}</td>
                      <td>Valor de custo: {`R$${product.costValue}`}</td>
                      <td>Tamanho: {product.size}</td>
                      {findSale(product._id) && (
                      <td>Vendas: {findSale(product._id).length}</td>
                      )}
                      <td>Categoria: {product.subcategory}</td>
                    </tr>
                  )}
                </>
              ))}
            </table>
          )}
          <Button
            text="Adicionar Produto"
            onClick={() => history.push('/register-product')}
          />
        </div>
      </Layout.Content>
    </Layout>
  );
}

export default RegisterProduct;
