import { useState } from 'react';

const KEY = 'hl_avatar';

function read(): string | null {
  try { return localStorage.getItem(KEY); } catch { return null; }
}

function write(dataUrl: string) {
  try { localStorage.setItem(KEY, dataUrl); } catch { /* storage full */ }
}

function clear() {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}

export function useAvatar() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(read);

  function upload(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      write(dataUrl);
      setAvatarUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  }

  function remove() {
    clear();
    setAvatarUrl(null);
  }

  return { avatarUrl, upload, remove };
}
