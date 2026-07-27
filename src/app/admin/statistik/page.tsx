import React from 'react';
import StatistikClient from './StatistikClient';
import { getStatistikByTahun, getAllStatistikHistory } from './actions';

export const metadata = {
  title: 'Data & Statistik - Admin Binanga',
};

export default async function StatistikAdminPage() {
  const currentYear = new Date().getFullYear();
  const { globalStats, dusunStats } = await getStatistikByTahun(currentYear);
  const history = await getAllStatistikHistory();

  return (
    <StatistikClient 
      initialTahun={currentYear}
      initialGlobal={globalStats} 
      initialDusun={dusunStats} 
      initialHistory={history}
    />
  );
}
