import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { MdDeleteForever, MdModeEdit } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import Layout from '../layouts';
import api from '../../services/api';
import Loader from '../components/loading';
import StackeholdersCard from '../stakeholders-card';

import style from './customers.module.scss';

function Costumers() {
  const history = useHistory();
  const [costumers, setCostumers] = useState([]);
  const [loading, setLoading] = useState(false);

  const findCostumers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/stakeholders', {
        params: {
          type: 'client',
        },
      });

      setCostumers(data && data.data ? data.data : []);
      setLoading(false);
    } catch (error) {
      toast.error(
        'Erro ao buscar clientes, por favor atualize a página ou tente mais tarde'
      );
    }
  };

  useEffect(() => {
    findCostumers();
  }, []);

  const handleEdit = (dataEdit) => {
    history.push('/register-stakeholders', {
      dataEdit,
      urlToReturn: '/costumers-list',
    });
  };

  const handleRemove = async (idRemove, name) => {
    await api.put(`/stakeholders/${idRemove}`, { isActive: false });
    toast.success(`O cliente ${name} foi deletado com sucesso!`);
    findCostumers();
  };

  return (
    <Layout>
      <Layout.Content title="Clientes">
        <ToastContainer />
        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <div className={style.Loader}>
              <Loader />
            </div>
          ) : (
            <>
              <div className={style.Card}>
                {costumers.length > 0 &&
                  costumers
                    .filter((costumer) => costumer.isActive)
                    .map((costumer) => {
                      const dataFormated = {
                        ...costumer,
                        city: costumer.address.city,
                      };
                      return (
                        <StackeholdersCard
                          data={dataFormated}
                          handleRemove={handleRemove}
                          handleEdit={handleEdit}
                        />
                      );
                    })}
              </div>
              <table className={style.Table}>
                <tbody>
                  <tr>
                    <th>Nome</th>
                    <th>Telefone</th>
                    <th>Email</th>
                    <th>Cidade</th>
                    <th>Editar</th>
                    <th>Exluir</th>
                  </tr>

                  {costumers.length > 0 &&
                    costumers
                      .filter((costumer) => costumer.isActive)
                      .map((costumer) => (
                        <tr key={costumer._id}>
                          <td>{costumer.name || '-'}</td>
                          <td>{costumer.phone || '-'}</td>
                          <td>{costumer.email || '-'}</td>
                          <td>
                            {costumer.address
                              ? `${costumer.address.city}-${costumer.address.state}`
                              : '-'}
                          </td>
                          <td>
                            <button
                              onClick={() => handleEdit(costumer)}
                              type="button"
                            >
                              <MdModeEdit className={style.EditButton} />
                            </button>
                          </td>
                          <td>
                            <button
                              onClick={() =>
                                handleRemove(costumer._id, costumer.name)
                              }
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
          )}
        </div>
      </Layout.Content>
    </Layout>
  );
}

export default Costumers;
