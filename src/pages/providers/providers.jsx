import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { MdDeleteForever, MdModeEdit } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import Layout from '../layouts';
import api from '../../services/api';
import Loader from '../components/loading';
import StackeholdersCard from '../stakeholders-card';
import emptyImg from '../../static/images/undraw_empty_re_opql.svg';

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
    const confirm = window.confirm(
      'você realmente deseja remover este fornecedor?'
    );
    if (confirm) {
      await api.put(`/stakeholders/${idRemove}`, { isActive: false });
      toast.success(`O fornecedor ${name} foi deletado com sucesso!`);
      findProviders();
    }
  };

  return (
    <Layout>
      <Layout.Content title="Fornecedores">
        <ToastContainer />
        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <div className={style.Loader}>
              <Loader />
            </div>
          ) : (
            <>
              {providers && providers.length > 0 ? (
                <>
                  <div className={style.Card}>
                    {providers
                      .filter((provider) => provider.isActive)
                      .map((provider) => {
                        const dataFormated = {
                          ...provider,
                          city: provider.address?.city,
                        };
                        return (
                          <StackeholdersCard
                            data={dataFormated}
                            handleRemove={handleRemove}
                            handleEdit={handleEdit}
                            key={provider._id}
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

                      {providers
                        .filter((provider) => provider.isActive)
                        .map((provider) => (
                          <tr key={provider._id}>
                            <td>{provider.name || '-'}</td>
                            <td>{provider.phone || '-'}</td>
                            <td>{provider.email || '-'}</td>
                            <td>
                              {provider.address
                                ? `${provider.address.city}-${provider.address.state}`
                                : '-'}
                            </td>
                            <td>
                              <button
                                onClick={() => handleEdit(provider)}
                                type="button"
                              >
                                <MdModeEdit className={style.EditButton} />
                              </button>
                            </td>
                            <td>
                              <button
                                onClick={() =>
                                  handleRemove(provider._id, provider.name)
                                }
                                type="button"
                              >
                                <MdDeleteForever
                                  className={style.DeleteButton}
                                />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </>
              ) : (
                <div className={style.Emptyimg}>
                  <h1>Não há fornecedores cadastrados</h1>
                  <img alt="Não existem fornecedores" src={emptyImg} />
                </div>
              )}
            </>
          )}
        </div>
      </Layout.Content>
    </Layout>
  );
}

export default Providers;
