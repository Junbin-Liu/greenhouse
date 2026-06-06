import { useState, useEffect, useCallback } from 'react';
import { PLANT_DATABASE } from '../data/plantDatabase';

const STORAGE_KEY = 'greenhouse_data_v1';

const getDefaultPlants = () => {
  const now = new Date().toISOString();
  const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString();
  const fiveDaysAgo = new Date(Date.now() - 5 * 86400000).toISOString();
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();

  return [
    { id: 'p1', plantId: 'jacaranda', nickname: '蓝花楹', addedAt: now, lastWatered: fiveDaysAgo, health: 85, logs: [{ type: 'water', date: fiveDaysAgo, note: '初次记录' }] },
    { id: 'p2', plantId: 'kalanchoe', nickname: '长寿花', addedAt: now, lastWatered: weekAgo, health: 92, logs: [{ type: 'water', date: weekAgo, note: '初次记录' }] },
    { id: 'p3', plantId: 'dracaena-reflexa', nickname: '百合竹', addedAt: now, lastWatered: threeDaysAgo, health: 88, logs: [{ type: 'water', date: threeDaysAgo, note: '初次记录' }] },
    { id: 'p4', plantId: 'anthurium', nickname: '红掌', addedAt: now, lastWatered: fiveDaysAgo, health: 80, logs: [{ type: 'water', date: fiveDaysAgo, note: '初次记录' }] },
    { id: 'p5', plantId: 'impatiens', nickname: '洋凤仙', addedAt: now, lastWatered: threeDaysAgo, health: 75, logs: [{ type: 'water', date: threeDaysAgo, note: '初次记录' }] },
    { id: 'p6', plantId: 'alocasia', nickname: '黑叶芋', addedAt: now, lastWatered: fiveDaysAgo, health: 82, logs: [{ type: 'water', date: fiveDaysAgo, note: '初次记录' }] },
  ];
};

const loadData = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('加载数据失败', e);
  }
  const defaults = { plants: getDefaultPlants(), settings: { city: null } };
  saveData(defaults);
  return defaults;
};

const saveData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('保存数据失败', e);
  }
};

export function usePlantStore() {
  const [data, setData] = useState(() => loadData());

  useEffect(() => {
    saveData(data);
  }, [data]);

  const getPlantInfo = useCallback((plantId) => {
    return PLANT_DATABASE.find(p => p.id === plantId) || null;
  }, []);

  const getMyPlants = useCallback(() => {
    return data.plants.map(mp => {
      const info = getPlantInfo(mp.plantId);
      const lastWatered = mp.lastWatered ? new Date(mp.lastWatered) : null;
      const daysSince = lastWatered ? Math.floor((Date.now() - lastWatered.getTime()) / 86400000) : 999;
      const interval = info?.waterInterval || 7;
      const dueDays = interval - daysSince;
      let status = 'healthy';
      if (dueDays < 0) status = 'overdue';
      else if (dueDays <= 1) status = 'due';

      return {
        ...mp,
        info,
        daysSince,
        dueDays,
        status,
      };
    });
  }, [data.plants, getPlantInfo]);

  const getPlantById = useCallback((id) => {
    const my = data.plants.find(p => p.id === id);
    if (!my) return null;
    const info = getPlantInfo(my.plantId);
    const lastWatered = my.lastWatered ? new Date(my.lastWatered) : null;
    const daysSince = lastWatered ? Math.floor((Date.now() - lastWatered.getTime()) / 86400000) : 999;
    const interval = info?.waterInterval || 7;
    const dueDays = interval - daysSince;
    let status = 'healthy';
    if (dueDays < 0) status = 'overdue';
    else if (dueDays <= 1) status = 'due';

    return {
      ...my,
      info,
      daysSince,
      dueDays,
      status,
    };
  }, [data.plants, getPlantInfo]);

  const waterPlant = useCallback((id, note = '') => {
    const now = new Date().toISOString();
    setData(prev => ({
      ...prev,
      plants: prev.plants.map(p => {
        if (p.id !== id) return p;
        const newHealth = Math.min(100, (p.health || 80) + 5);
        return {
          ...p,
          lastWatered: now,
          health: newHealth,
          logs: [{ type: 'water', date: now, note }, ...(p.logs || [])],
        };
      }),
    }));
  }, []);

  const addLog = useCallback((id, type, note = '') => {
    const now = new Date().toISOString();
    setData(prev => ({
      ...prev,
      plants: prev.plants.map(p => {
        if (p.id !== id) return p;
        return {
          ...p,
          logs: [{ type, date: now, note }, ...(p.logs || [])],
        };
      }),
    }));
  }, []);

  const updateNickname = useCallback((id, nickname) => {
    setData(prev => ({
      ...prev,
      plants: prev.plants.map(p => p.id === id ? { ...p, nickname } : p),
    }));
  }, []);

  const exportData = useCallback(() => {
    return JSON.stringify(data, null, 2);
  }, [data]);

  const importData = useCallback((json) => {
    try {
      const parsed = JSON.parse(json);
      if (parsed.plants) {
        setData(parsed);
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  }, []);

  const setCity = useCallback((city) => {
    setData(prev => ({ ...prev, settings: { ...prev.settings, city } }));
  }, []);

  return {
    data,
    getMyPlants,
    getPlantById,
    waterPlant,
    addLog,
    updateNickname,
    exportData,
    importData,
    city: data.settings?.city || null,
    setCity,
  };
}
