import { useState, useCallback, useEffect } from 'react';
import { api, getToken } from '../api/client';

const KEY = 'hl_avatar';

function readLocal(): string | null {
  try { return localStorage.getItem(KEY); } catch { return null; }
}

export function useAvatar() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(readLocal);

  // Fetch from API if logged in
  useEffect(() => {
    if (!getToken()) return;
    api.get('/profile')
      .then(({ data }) => {
        if (data.avatarUrl) {
          setAvatarUrl(data.avatarUrl);
          try { localStorage.setItem(KEY, data.avatarUrl); } catch { /* ignore */ }
        }
      })
      .catch(() => { /* fallback to local */ });
  }, []);

  const upload = useCallback(async (file: File) => {
    if (getToken()) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await api.post('/profile/avatar', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const url = data.avatarUrl;
        setAvatarUrl(url);
        try { localStorage.setItem(KEY, url); } catch { /* ignore */ }
        return;
      } catch {
        // fallback to local data URL
      }
    }

    // Fallback: store as data URL locally
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      try { localStorage.setItem(KEY, dataUrl); } catch { /* storage full */ }
      setAvatarUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  }, []);

  const remove = useCallback(() => {
    try { localStorage.removeItem(KEY); } catch { /* ignore */ }
    setAvatarUrl(null);
  }, []);

  return { avatarUrl, upload, remove };
}
