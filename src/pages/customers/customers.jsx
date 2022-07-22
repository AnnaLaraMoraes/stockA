import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { MdDeleteForever, MdModeEdit } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import Layout from '../layouts';
import api from '../../services/api';
import Loader from '../components/loading';

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
                <p className={style.TableTitle}>Nome</p>
                <p className={style.TableTitle}>Telefone</p>
                <p className={style.TableTitle}>Email</p>
                <p className={style.TableTitle}>Cidade</p>
                <p />
              </div>

              {costumers.length > 0 &&
                costumers.map((costumer) => (
                  <div key={costumer._id} className={style.TableItem}>
                    <p>{costumer.name}</p>
                    <p>{costumer.phone}</p>
                    <p>{costumer.email}</p>
                    <p>
                      {costumer.address
                        ? `${costumer.address.city}-${costumer.address.state}`
                        : '-'}
                    </p>
                    <div className={style.ButtonContainer}>
                      <button
                        onClick={() => handleEdit(costumer)}
                        type="button"
                      >
                        <MdModeEdit className={style.EditButton} />
                      </button>
                      <button
                        onClick={() =>
                          handleRemove(costumer._id, costumer.name)
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

export default Costumers;
