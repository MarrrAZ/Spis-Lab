// Pengambilan data dari Supabase untuk website publik (server-side, anon key + RLS).
import { createClient as sb } from '@supabase/supabase-js';
import { CONTENT_DEFAULTS } from '../content-schema';

let client = null;
export function db() {
  if (!client) client = sb(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, { auth: { persistSession: false } });
  return client;
}
const rows = async (p) => { try { const { data, error } = await p; return error ? [] : data || []; } catch (e) { return []; } };
const one = async (p) => { try { const { data, error } = await p; return error ? null : data; } catch (e) { return null; } };

// Teks situs: nilai default + isian admin (tabel site_content). Kalau tabel belum ada, pakai default.
export async function loadContent() {
  const list = await rows(db().from('site_content').select('key,value'));
  const map = { ...CONTENT_DEFAULTS };
  for (const r of list) if (r && r.key in map && r.value !== null && r.value !== undefined) map[r.key] = r.value;
  const c = (k) => (k in map ? map[k] : '');
  c.map = map;
  return c;
}

export const members = () => rows(db().from('members').select('*').order('order_index', { ascending: true }));
export const achievements = () => rows(db().from('achievements').select('*, achievement_members(member_id)').order('year', { ascending: false }).order('title'));
export const labPhotos = () => rows(db().from('lab_photos').select('*').order('order_index', { ascending: true }));
export const abdimas = () => rows(db().from('abdimas').select('*').order('activity_date', { ascending: false }));
export const projects = () => rows(db().from('projects').select('*').order('order_index', { ascending: true }));
export const project = (slug) => one(db().from('projects').select('*').eq('slug', slug).maybeSingle());
export const member = (id) => one(db().from('members').select('*').eq('id', id).maybeSingle());
export const about = () => one(db().from('about_content').select('*').limit(1).maybeSingle());

export async function recruitment() {
  const list = await rows(db().from('recruitment').select('*').order('created_at', { ascending: false }));
  return list[0] || null; // sama dengan fungsi submit_application: rekrutmen terbaru
}
export async function recruitmentForm() {
  const secs = await rows(db().from('recruitment_sections').select('*').order('position', { ascending: true }));
  const qs = await rows(db().from('recruitment_questions').select('*').order('position', { ascending: true }));
  return secs.map((s) => ({ ...s, questions: qs.filter((q) => q.section_id === s.id) })).filter((s) => s.questions.length);
}
export async function pubsOf(memberId) {
  const links = await rows(db().from('achievement_members').select('achievement_id').eq('member_id', memberId));
  const ids = links.map((l) => l.achievement_id);
  if (!ids.length) return [];
  return rows(db().from('achievements').select('*').in('id', ids).order('year', { ascending: false }));
}
