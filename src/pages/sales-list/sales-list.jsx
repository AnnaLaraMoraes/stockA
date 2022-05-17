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

  const handleRemove = async (sale) => {
    await api.delete(`/sales/${sale._id}`, { products: sale.products });
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
            <table>
              <tr>
                <th>Data</th>
                <th>Cliente</th>
                <th>Valor total</th>
                <th>{}</th>
              </tr>

              {sales.length > 0 &&
                sales.map((sale) => (
                  <tr key={sale._id}>
                    <td>{sale.date}</td>
                    {console.log(sale)}
                    <td>{sale.client.name}</td>
                    {/* <td>{`R$${sale.financeId.value}`}</td> */}
                    <td className={style.ButtonTable}>
                      <button onClick={() => handleEdit(sale)} type="button">
                        <MdModeEdit className={style.EditButton} />
                      </button>
                      <button onClick={() => handleRemove(sale)} type="button">
                        <MdDeleteForever className={style.DeleteButton} />
                      </button>
                    </td>
                  </tr>
                ))}
            </table>
          )}
        </div>
      </Layout.Content>
    </Layout>
  );
}

export default SalesList;
