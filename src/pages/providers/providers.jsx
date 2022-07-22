import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { MdDeleteForever, MdModeEdit } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import Layout from '../layouts';
import api from '../../services/api';
import Loader from '../components/loading';

import style from './providers.module.scss';

function Providers() {
  const history = useHistory();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);

  const findProviders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/stakeholders', {
        params: {
          type: 'provider',
        },
      });

      setProviders(data && data.data ? data.data : []);
      setLoading(false);
    } catch (error) {
      toast.error(
        'Erro ao buscar fornecedores, por favor atualize a página ou tente mais tarde'
      );
    }
  };

  useEffect(() => {
    findProviders();
  }, []);

  const handleEdit = (dataEdit) => {
    history.push('/register-stakeholders', {
      dataEdit,
      urlToReturn: '/providers-list',
    });
  };

  const handleRemove = async (idRemove, name) => {
    await api.put(`/stakeholders/${idRemove}`, { isActive: false });
    toast.success(`O fornecedor ${name} foi deletado com sucesso!`);
    findProviders();
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

              {providers.length > 0 &&
                providers.map((employee) => (
                  <div key={employee._id} className={style.TableItem}>
                    <p>{employee.name}</p>
                    <p>{employee.phone}</p>
                    <p>{employee.email}</p>
                    <p>
                      {employee.address
                        ? `${employee.address.city}-${employee.address.state}`
                        : '-'}
                    </p>
                    <div className={style.ButtonContainer}>
                      <button
                        onClick={() => handleEdit(employee)}
                        type="button"
                      >
                        <MdModeEdit className={style.EditButton} />
                      </button>
                      <button
                        onClick={() =>
                          handleRemove(employee._id, employee.name)
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

export default Providers;
