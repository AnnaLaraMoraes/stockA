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
            <table className={style.Table}>
              <tr>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Email</th>
                <th>Cidade</th>
                <th>{}</th>
              </tr>

              {providers.length > 0 &&
                providers.map((employee) => (
                  <tr key={employee._id}>
                    <td>{employee.name}</td>
                    <td>{employee.phone}</td>
                    <td>{employee.email}</td>
                    <td>
                      {employee.address
                        ? `${employee.address.city}-${employee.address.state}`
                        : '-'}
                    </td>
                    <td className={style.ButtonTable}>
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

export default Providers;
