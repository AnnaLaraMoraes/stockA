import React from 'react';
import ApexCharts from 'react-apexcharts';
import Layout from '../layouts';
import styles from './dashboard.module.scss';

function Dashboard() {
  const chaaart = {
    series: [
      {
        name: 'Vendas',
        type: 'column',
        data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
      },
      {
        name: 'Estoque',
        type: 'area',
        data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
      },
      {
        name: 'Financeiro',
        type: 'line',
        data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: 'line',
        stacked: false,
      },
      stroke: {
        width: [0, 2, 5],
        curve: 'smooth',
      },
      plotOptions: {
        bar: {
          columnWidth: '50%',
        },
      },
      fill: {
        opacity: [0.85, 0.25, 1],
        gradient: {
          inverseColors: false,
          shade: 'light',
          type: 'vertical',
          opacityFrom: 0.85,
          opacityTo: 0.55,
          stops: [0, 100, 100, 100],
        },
      },
      labels: [
        '01/01/2003',
        '02/01/2003',
        '03/01/2003',
        '04/01/2003',
        '05/01/2003',
        '06/01/2003',
        '07/01/2003',
        '08/01/2003',
        '09/01/2003',
        '10/01/2003',
        '11/01/2003',
      ],
      markers: {
        size: 0,
      },
      xaxis: {
        type: 'datetime',
      },
      yaxis: {
        title: {
          text: '',
        },
        min: 0,
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter(y) {
            if (typeof y !== 'undefined') {
              return `${y.toFixed(0)}`;
            }
            return y;
          },
        },
      },
    },
  };
  return (
    <Layout>
      <Layout.Content>
        <div className={styles.container}>
          <h1>Dashboard</h1>
          <h2>Visão geral dos últimos meses</h2>
          <div className={styles.Chart}>
            <ApexCharts
              options={chaaart.options}
              series={chaaart.series}
              type="line"
              height={350}
            />
          </div>
          <h2>Últimas vendas</h2>
          <div className={styles.CardsContainer}>
            <div className={styles.Card}>
              <h2>5 blusas - Maria </h2>
              <div className={styles.Item}>
                <p>Valor Total:</p>
                <p className={styles.Info}>R$100</p>
              </div>
              <div className={styles.Item}>
                <p>Data da venda: </p>
                <p className={styles.Info}>21/03/2020</p>
              </div>
            </div>
            <div className={styles.Card}>
              <h2>5 blusas - Maria </h2>
              <div className={styles.Item}>
                <p>Valor Total:</p>
                <p className={styles.Info}>R$100</p>
              </div>
              <div className={styles.Item}>
                <p>Data da venda: </p>
                <p className={styles.Info}>21/03/2020</p>
              </div>
            </div>
            <div className={styles.Card}>
              <h2>5 blusas - Maria </h2>
              <div className={styles.Item}>
                <p>Valor Total:</p>
                <p className={styles.Info}>R$100</p>
              </div>
              <div className={styles.Item}>
                <p>Data da venda: </p>
                <p className={styles.Info}>21/03/2020</p>
              </div>
            </div>
          </div>
        </div>
      </Layout.Content>
    </Layout>
  );
}

export default Dashboard;
