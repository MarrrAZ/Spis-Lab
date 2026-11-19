'use client';
import { useEffect } from 'react';

// Memuat three.js + runtime animasi setelah halaman tampil.
export default function Runtime({ intro = false }) {
  useEffect(() => {
    let inst = null, dead = false;
    (async () => {
      try {
        const THREE = await import('three');
        window.THREE = THREE;
      } catch (e) { console.error('[SPIS] three.js gagal dimuat', e); }
      const { mount } = await import('@/lib/runtime/core');
      if (!dead) inst = mount({ intro });
    })();
    return () => { dead = true; if (inst) inst.unmount(); };
  }, [intro]);
  return null;
}
