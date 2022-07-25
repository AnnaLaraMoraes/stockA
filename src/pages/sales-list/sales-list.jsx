import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { MdDeleteForever, MdModeEdit } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import Layout from '../layouts';
import api from '../../services/api';
import Loader from '../components/loading';

import style from './sales-list.module.scss';

function SalesList() {
  const history = useHistory();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const handleEdit = (dataEdit) => {
    history.push('/register-sale', {
      dataEdit,
      urlToReturn: '/sales-list',
    });
  };

  const handleRemove = async (idRemove) => {
    await api.delete(`/sales/${idRemove}`, { isActive: false });
    toast.success(`A venda foi deletada com sucesso!`);
    findSales();
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
                <p className={style.TableTitle}>Cliente</p>
                <p className={style.TableTitle}>Valor total</p>
                <p />
              </div>

              {sales.length > 0 &&
                sales.map((sale) => (
                  <div key={sale._id} className={style.TableItem}>
                    <p>{new Date(sale.date).toLocaleDateString()}</p>
                    <p>{sale.client.name}</p>
                    <p>{`R$${sale?.totalValue}`}</p>
                    <div className={style.ButtonContainer}>
                      <button onClick={() => handleEdit(sale)} type="button">
                        <MdModeEdit className={style.EditButton} />
                      </button>
                      <button
                        onClick={() => handleRemove(sale._id)}
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

export default SalesList;
