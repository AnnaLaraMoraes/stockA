import React, { useEffect, useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import {
  MdDeleteForever,
  MdModeEdit,
  MdOutlineAddCircle,
  MdDoneAll,
  MdRemoveDone,
} from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import Layout from '../layouts';
import api from '../../services/api';
import Loader from '../components/loading';
import Card from './components/card';
import emptyImg from '../../static/images/undraw_empty_re_opql.svg';

import style from './sales-list.module.scss';

function SalesList() {
  const history = useHistory();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputPaymentRef = useRef([]);
  const inputDataRef = useRef([]);

  const findSales = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/sales');
      if (data && data.sales) {
        const dataFormated = data.sales.map((dataSale) => {
          const { totalValuePaid } = dataSale.received.reduce(
            (accumulator, receveidData) => {
              accumulator.totalValuePaid += Number(receveidData.value);

              return accumulator;
            },
            {
              totalValuePaid: 0,
            }
          );
          dataSale.totalValuePaid = totalValuePaid;
          dataSale.itsPaid =
            Number(totalValuePaid) >= Number(dataSale.totalValue);

          const productus = dataSale.products.map((prod) => ({
            amount: prod.amount,
            lucre: prod.product.costSale - prod.product.costValue,
            costValue: prod.product.costValue,
          }));

          const { costValue, lucre } = productus.reduce(
            (accumulator, prod) => {
              accumulator.costValue += Number(prod.costValue) * prod.amount;
              accumulator.lucre += Number(prod.lucre) * prod.amount;

              return accumulator;
            },
            {
              costValue: 0,
              lucre: 0,
            }
          );

          dataSale.costValue = costValue;
          dataSale.lucre = lucre;

          return dataSale;
        });
        setSales(dataFormated);
      } else {
        setSales([]);
      }
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
    const confirm = window.confirm('você realmente deseja remover esta venda?');

    if (confirm) {
      await api.delete(`/sales/${idRemove}`, { isActive: false });
      toast.success(`A venda foi deletada com sucesso!`);
      findSales();
    }
  };

  const onButtonClick = async (saleId, index, handleModal) => {
    if (inputPaymentRef.current[index].value && saleId) {
      try {
        await api.put(`/sales-payments/${saleId}`, {
          received: {
            value: inputPaymentRef.current[index].value,
            date: inputDataRef.current[index].value || new Date(),
          },
        });
        toast.success('Pagamento adicionado com sucesso!');
        if (handleModal) {
          handleModal();
        }
      } catch (error) {
        toast.error('Erro ao adicionar pagamento, tente mais tarde.');
      } finally {
        inputPaymentRef.current[index].value = null;
        inputDataRef.current[index].value = null;
        findSales();
      }
    } else {
      toast.error('Adicione o valor do pagamento');
    }
  };

  return (
    <Layout>
      <Layout.Content title="Vendas">
        <ToastContainer />
        <div className={style.Container}>
          {loading ? (
            <div className={style.Loader}>
              <Loader />
            </div>
          ) : (
            <>
              {sales && sales.length > 0 ? (
                <>
                  <div className={style.SalesCard}>
                    {sales.map((sale, index) => {
                      const saleDataFormated = {
                        ...sale,
                        _id: sale._id,
                        itsPaid: sale.itsPaid,
                        clientName: sale.client?.name,
                        date: sale.date,
                        totalValue: sale.totalValue,
                        totalValuePaid: sale.totalValuePaid,
                      };
                      return (
                        <Card
                          data={saleDataFormated}
                          onButtonClick={onButtonClick}
                          index={index}
                          inputPaymentRef={inputPaymentRef}
                          inputDataRef={inputDataRef}
                          key={sale._id}
                          handleEdit={handleEdit}
                          handleRemove={handleRemove}
                        />
                      );
                    })}
                  </div>
                  <table className={style.Table}>
                    <tbody>
                      <tr>
                        <th>Status</th>
                        <th>Data</th>
                        <th>Cliente</th>
                        <th>Valor total</th>
                        <th>Valor Pago</th>
                        <th>Adicionar pagamento</th>
                        <th>Lucro na venda</th>
                        <th>Valor de custo</th>
                        <th>Editar</th>
                        <th>Exluir</th>
                      </tr>
                      {sales.map((sale, i) => (
                        <tr key={sale._id}>
                          <td>
                            <div>
                              {sale.itsPaid ? (
                                <>
                                  <MdDoneAll style={{ color: '#388E3C' }} />
                                  Pago
                                </>
                              ) : (
                                <>
                                  <MdRemoveDone style={{ color: '#D32F2F' }} />
                                  Não pago
                                </>
                              )}
                            </div>
                          </td>
                          <td>{new Date(sale.date).toLocaleDateString()}</td>
                          <td>{sale.client?.name}</td>
                          <td>{`R$${sale?.totalValue}`}</td>
                          <td>{`R$${sale?.totalValuePaid}`}</td>
                          <td>
                            <div className={style.AddPayment}>
                              <input
                                type="number"
                                min="1"
                                ref={(el) => {
                                  inputPaymentRef.current[i] = el;
                                  return el;
                                }}
                              />
                              <input
                                type="date"
                                ref={(el) => {
                                  inputDataRef.current[i] = el;
                                  return el;
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => onButtonClick(sale._id, i)}
                              >
                                <MdOutlineAddCircle
                                  style={{ color: '#388E3C' }}
                                />
                              </button>
                            </div>
                          </td>
                          <td>{`R$${sale?.lucre}`}</td>
                          <td>{`R$${sale?.costValue}`}</td>
                          <td>
                            <button
                              onClick={() => handleEdit(sale)}
                              type="button"
                            >
                              <MdModeEdit className={style.EditButton} />
                            </button>
                          </td>
                          <td>
                            <button
                              onClick={() => handleRemove(sale._id)}
                              type="button"
                            >
                              <MdDeleteForever className={style.DeleteButton} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : (
                <div className={style.Emptyimg}>
                  <h1>Não há vendas cadastrados</h1>
                  <img alt="Não existem vendas" src={emptyImg} />
                </div>
              )}
            </>
          )}
        </div>
      </Layout.Content>
    </Layout>
  );
}

export default SalesList;
