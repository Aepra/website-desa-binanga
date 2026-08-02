'use client';

import React, { useState, useEffect } from 'react';
import { CloudSun, Sun, CloudRain, Clock, Map, Navigation, Thermometer, Wind, Droplets } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '@/components/Animate';
import styles from './wisata.module.css';

export default function GeographicDashboard() {
  const [weather, setWeather] = useState<{ temp: number, condition: string, wind: number, time: string, icon: any } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-3.3&longitude=118.9&current_weather=true');
        const data = await res.json();
        const code = data.current_weather.weathercode;
        const temp = data.current_weather.temperature;
        const wind = data.current_weather.windspeed;
        
        let condition = 'Cerah';
        let icon = <Sun size={32} />;
        
        if (code === 0) { condition = 'Cerah'; icon = <Sun size={32} color="#facc15" />; }
        else if (code >= 1 && code <= 3) { condition = 'Berawan'; icon = <CloudSun size={32} color="#f8fafc" />; }
        else if (code >= 51 && code <= 67) { condition = 'Hujan Ringan'; icon = <CloudRain size={32} color="#60a5fa" />; }
        else if (code >= 80 && code <= 99) { condition = 'Hujan Lebat'; icon = <CloudRain size={32} color="#3b82f6" />; }
        
        setWeather({ temp, condition, wind, time: data.current_weather.time, icon });
      } catch (e) {
        setWeather({ temp: 28, condition: 'Cerah', wind: 5, time: '', icon: <Sun size={32} color="#facc15" /> });
      }
    };
    fetchWeather();
  }, []);

  return (
    <StaggerContainer className={styles.bentoGrid}>
      
      {/* 1. Highlight Image (span 2x2) */}
      <StaggerItem className={`${styles.bentoCard} ${styles.bentoHighlight}`}>
        <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Pesona Alam Asri Binanga" className={styles.bBg} />
        <div className={styles.bOverlay}>
          <h3 className={styles.bTitleBig}>Pesona Alam Asri</h3>
          <p className={styles.bDesc}>Desa Binanga memiliki kontur perbukitan hijau yang menyejukkan, berpadu harmonis dengan pesisir laut tropis.</p>
        </div>
      </StaggerItem>

      {/* 2. Suhu Real-time (1x1) */}
      <StaggerItem style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
        borderRadius: '20px', padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', overflow: 'hidden', position: 'relative'
      }}>
        {/* Dekorasi Air/Angin di background */}
        <Wind size={120} color="#f8fafc" style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.8, transform: 'rotate(-20deg)' }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ background: '#fef3c7', color: '#f59e0b', padding: '10px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(245,158,11,0.2)' }}>
            <Thermometer size={24} />
          </div>
          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Suhu</span>
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '2.8rem', fontWeight: 900, color: '#0f172a', lineHeight: 1, letterSpacing: '-1px' }}>
            {weather ? `${Math.round(weather.temp)}°` : '--°'}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>Real-time Satelit</div>
        </div>
      </StaggerItem>
      
      {/* 3. Cuaca & Kondisi (1x1) */}
      <StaggerItem style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        borderRadius: '20px', padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        border: '1px solid #334155', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', overflow: 'hidden', position: 'relative'
      }}>
        {/* Glow effect di background */}
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(56,189,248,0.2) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%' }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '10px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
            {weather ? weather.icon : <CloudSun size={24} color="#fff" />}
          </div>
          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Kondisi</span>
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.5px' }}>
            {weather ? weather.condition : 'Memuat...'}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px', fontWeight: 500 }}>Cuaca Terkini</div>
        </div>
      </StaggerItem>

      {/* 4. Waktu (Span 2x1) */}
      <StaggerItem style={{
        gridColumn: 'span 2', background: 'linear-gradient(to right, #eff6ff, #e0e7ff)',
        borderRadius: '20px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px' }}>
              Waktu Lokal (WITA)
            </div>
            <div suppressHydrationWarning style={{ fontSize: '2rem', fontWeight: 900, color: '#1e3a8a', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
              {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
          </div>
        </div>
      </StaggerItem>

    </StaggerContainer>
  );
}
