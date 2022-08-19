/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { toast } from 'react-toastify';
import { MdPointOfSale } from 'react-icons/md';
import { GiMoneyStack } from 'react-icons/gi';
import { CgSandClock } from 'react-icons/cg';
// import { FaBoxes } from 'react-icons/fa';
import Layout from '../layouts';
import styles from './dashboard.module.scss';
import api from '../../services/api';
import Loader from '../components/loading';

function Card({ color, title, value, dataChart, Icon }) {
  const optionsDate = {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  };

  const dates = dataChart.map((data) =>
    new Date(data.date).toLocaleDateString('pt-br', optionsDate)
  );
  const values = dataChart.map((data) => data.value);
  const arrayTest = {
    options: {
      chart: {
        id: 'basic-bar',
      },
      xaxis: {
        categories: dates,
      },
      yaxis: {
        labels: {
          formatter: (v) => `R$${v}`,
        },
      },
      colors: [color],
      dataLabels: {
        style: {
          colors: ['#573F4A'],
        },
      },
    },
    series: [
      {
        name: 'valor da venda',
        data: values,
      },
    ],
  };
  return (
    <div className={styles.CardContainer}>
      <div style={{ backgroundColor: color }} className={styles.Card}>
        <div className={styles.ChildCard}>
          <h2>
            {title} {Icon}
          </h2>
          <h3 style={{ color }}>R${value}</h3>
          <Chart
            options={arrayTest.options}
            series={arrayTest.series}
            type="bar"
            height={260}
          />
        </div>
      </div>
    </div>
  );
}

// function CardWith4Data({ color, title, dataChart, Icon }) {
//   const dates = dataChart.map((data) =>
//     new Date(data.dateSale).toLocaleDateString()
//   );

//   const lucre = dataChart.map((data) => data.lucre);
//   const costSale = dataChart.map((data) => data.costSale);
//   const costValue = dataChart.map((data) => data.costValue);

//   console.log(dataChart);

//   const arrayTest = {
//     options: {
//       chart: {
//         height: 350,
//         type: 'line',
//       },
//       stroke: {
//         width: [0, 4],
//       },
//       dataLabels: {
//         enabled: true,
//         enabledOnSeries: [1],
//       },
//       labels: dates,
//       xaxis: {
//         type: 'datetime',
//       },
//       yaxis: [
//         {
//           labels: {
//             formatter: (v) => `R$${v}`,
//           },
//         },
//       ],
//     },
//     series: [
//       {
//         name: 'Lucro',
//         type: 'column',
//         data: lucre,
//       },
//       {
//         name: 'Valor de venda',
//         type: 'column',
//         data: costSale,
//       },
//       {
//         name: 'Valor de custo',
//         type: 'column',
//         data: costValue,
//       },
//     ],
//   };
//   return (
//     <div className={styles.CardContainer}>
//       <div style={{ backgroundColor: color }} className={styles.Card}>
//         <div className={styles.ChildCard}>
//           <h2>
//             {title} {Icon}
//           </h2>
//           <Chart
//             options={arrayTest.options}
//             series={arrayTest.series}
//             type="bar"
//             height={260}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

function Dashboard() {
  const [sales, setSales] = useState([]);
  const [toReceived, setToReceived] = useState([]);
  const [totalValue, setTotalValue] = useState([]);
  const [received, setReceived] = useState([]);
  // const [detailSale, setDetailSale] = useState([]);
  const [loading, setLoading] = useState(false);

  const findSales = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/reports');
      if (data && data.salesData) {
        setSales(data.salesData);

        // setDetailSale(
        //   Array.prototype.concat.apply(
        //     [],
        //     data.salesData.saleFomated.map((dataSale) => dataSale.productsSale)
        //   )
        // );

        setReceived(
          data.salesData.saleFomated.map((dataSale) => dataSale.received)
        );

        setToReceived(
          data.salesData.saleFomated.map((dataSale) => ({
            value: dataSale.toReceived,
            date: dataSale.date,
          }))
        );

        setTotalValue(
          data.salesData.saleFomated.map((dataSale) => ({
            value: dataSale.totalValue,
            date: dataSale.date,
          }))
        );
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

  return (
    <Layout>
      <Layout.Content title="Dashboard">
        {loading ? (
          <div className={styles.Loader}>
            <Loader />
          </div>
        ) : (
          <div className={styles.SalesContainer}>
            <div className={styles.SalesContainerChild1}>
              <Card
                color="#2F67D3"
                title="Vendas"
                value={sales?.totalSale || 0}
                dataChart={totalValue}
                Icon={<MdPointOfSale style={{ color: '#2F67D3' }} />}
              />
              <Card
                color="#388E3C"
                title="Vendas recebidas"
                value={sales?.totalReceived || 0}
                dataChart={received.flat(1)}
                Icon={<GiMoneyStack style={{ color: '#388E3C' }} />}
              />
              <Card
                color="#D32F2F"
                title="Vendas a receber"
                value={sales?.totalToReceived || 0}
                dataChart={toReceived}
                Icon={<CgSandClock style={{ color: '#D32F2F' }} />}
              />
            </div>
            {/* <CardWith4Data
            color="#A34672"
            title="Vendas detalhadas"
            dataChart={detailSale}
            Icon={<FaBoxes style={{ color: '#A34672' }} />}
          /> */}
          </div>
        )}
      </Layout.Content>
    </Layout>
  );
}

export default Dashboard;
