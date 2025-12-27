// API service to fetch data from backend

const API_BASE = '/api';



export const fetchActivitiesPreview = async () => {
  const response = await fetch(`${API_BASE}/kegiatan-preview`);
  return response.json();
};

export const fetchActivities = async () => {
  const response = await fetch(`${API_BASE}/kegiatan`);
  return response.json();
};

export const fetchPopulationStats = async () => {
  const response = await fetch(`${API_BASE}/population-stats`);
  return response.json();
};

export const fetchKepengurusan = async () => {
  const response = await fetch(`${API_BASE}/kepengurusan`);
  return response.json();
};

export const fetchKeuangan = async () => {
  const response = await fetch(`${API_BASE}/keuangan`);
  return response.json();
};

export const fetchAllKeuangan = async () => {
  const response = await fetch(`${API_BASE}/keuangan/all`);
  return response.json();
};

export const createKegiatan = async (data: any) => {
  const response = await fetch(`${API_BASE}/kegiatan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const updateKegiatan = async (id: string, data: any) => {
  const response = await fetch(`${API_BASE}/kegiatan/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const deleteKegiatan = async (id: string) => {
  const response = await fetch(`${API_BASE}/kegiatan/${id}`, {
    method: 'DELETE'
  });
  return response.json();
};

export const createKepengurusan = async (data: any) => {
  const response = await fetch(`${API_BASE}/kepengurusan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const updateKepengurusan = async (id: string, data: any) => {
  const response = await fetch(`${API_BASE}/kepengurusan/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const deleteKepengurusan = async (id: string) => {
  const response = await fetch(`${API_BASE}/kepengurusan/${id}`, {
    method: 'DELETE'
  });
  return response.json();
};

export const fetchAllWarga = async () => {
  const response = await fetch(`${API_BASE}/warga`);
  return response.json();
};

export const fetchLastUpdateWarga = async () => {
  const response = await fetch(`${API_BASE}/warga/last-update`);
  return response.json();
};

export const createWarga = async (data: any) => {
  const response = await fetch(`${API_BASE}/warga`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const updateWarga = async (id: string, data: any) => {
  const response = await fetch(`${API_BASE}/warga/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const deleteWarga = async (id: string) => {
  const response = await fetch(`${API_BASE}/warga/${id}`, {
    method: 'DELETE'
  });
  return response.json();
};

export const fetchAllResidents = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${API_BASE}/residents?${query}`);
  return response.json();
};

export const createResident = async (data: any) => {
  const response = await fetch(`${API_BASE}/residents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const updateResident = async (id: string, data: any) => {
  const response = await fetch(`${API_BASE}/residents/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const deleteResident = async (id: string) => {
  const response = await fetch(`${API_BASE}/residents/${id}`, {
    method: 'DELETE'
  });
  return response.json();
};

export const createKeuangan = async (data: any) => {
  const response = await fetch(`${API_BASE}/keuangan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const updateKeuangan = async (id: string, data: any) => {
  const response = await fetch(`${API_BASE}/keuangan/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const deleteKeuangan = async (id: string) => {
  const response = await fetch(`${API_BASE}/keuangan/${id}`, {
    method: 'DELETE'
  });
  return response.json();
};

export const uploadPengurusImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await fetch(`${API_BASE}/upload/pengurus`, {
    method: 'POST',
    body: formData
  });
  return response.json();
};