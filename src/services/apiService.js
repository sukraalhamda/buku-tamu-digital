/**
 * Supabase-backed API Service
 * Replaces mockStorage + n8n fallback with real Supabase DB
 */
import { supabase } from '../lib/supabase'
import { generateVisitId, calculateDuration } from '../utils/formatters'

// map DB snake_case -> app camelCase
function mapFromDb(row) {
  if (!row) return null
  return {
    id: row.id,
    idKunjungan: row.id_kunjungan,
    nama: row.nama,
    instansi: row.instansi,
    jamKunjungan: row.jam_kunjungan,
    jamKeluar: row.jam_keluar,
    keterangan: row.keterangan,
    tandaTangan: row.tanda_tangan,
    tandaTanganKeluar: row.tanda_tangan_keluar,
    status: row.status,
    durasi: row.durasi,
    createdAt: row.created_at,
  }
}

function mapToDb(payload) {
  const db = {}
  if (payload.idKunjungan !== undefined) db.id_kunjungan = payload.idKunjungan
  if (payload.nama !== undefined) db.nama = payload.nama
  if (payload.instansi !== undefined) db.instansi = payload.instansi
  if (payload.jamKunjungan !== undefined) db.jam_kunjungan = payload.jamKunjungan
  if (payload.jamKeluar !== undefined) db.jam_keluar = payload.jamKeluar
  if (payload.keterangan !== undefined) db.keterangan = payload.keterangan
  if (payload.tandaTangan !== undefined) db.tanda_tangan = payload.tandaTangan
  if (payload.tandaTanganKeluar !== undefined) db.tanda_tangan_keluar = payload.tandaTanganKeluar
  if (payload.status !== undefined) db.status = payload.status
  if (payload.durasi !== undefined) db.durasi = payload.durasi
  return db
}

export const checkInGuest = async (formData) => {
  const idKunjungan = generateVisitId()
  const jamKunjungan = formData.jamKunjungan || new Date().toISOString()
  const row = {
    id_kunjungan: idKunjungan,
    nama: formData.nama,
    instansi: formData.instansi,
    jam_kunjungan: jamKunjungan,
    keterangan: formData.keterangan,
    tanda_tangan: formData.tandaTangan || null,
    status: 'SEDANG BERKUNJUNG',
    durasi: '-',
  }
  const { data, error } = await supabase.from('visits').insert(row).select().single()
  if (error) throw new Error(error.message)
  return { success: true, data: mapFromDb(data), viaSupabase: true, message: 'Check-In berhasil tercatat di Supabase!' }
}

export const checkOutGuest = async (checkoutData) => {
  const idKunjungan = checkoutData.idKunjungan?.trim()
  if (!idKunjungan) throw new Error('ID Kunjungan wajib diisi')
  if (!checkoutData.tandaTanganKeluar || !checkoutData.tandaTanganKeluar.trim()) {
    throw new Error('Tanda tangan saat keluar wajib diisi.')
  }
  // fetch existing to calc duration
  const { data: existing, error: fetchErr } = await supabase
    .from('visits')
    .select('*')
    .eq('id_kunjungan', idKunjungan)
    .single()
  if (fetchErr || !existing) throw new Error(`Data kunjungan dengan ID "${idKunjungan}" tidak ditemukan.`)
  if (existing.status === 'SELESAI') throw new Error(`Tamu dengan ID "${idKunjungan}" sudah check-out.`)

  const jamKeluar = checkoutData.jamKeluar || new Date().toISOString()
  const durasi = calculateDuration(existing.jam_kunjungan, jamKeluar)

  const { data, error } = await supabase
    .from('visits')
    .update({
      jam_keluar: jamKeluar,
      tanda_tangan_keluar: checkoutData.tandaTanganKeluar || null,
      status: 'SELESAI',
      durasi,
    })
    .eq('id_kunjungan', idKunjungan)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return { success: true, data: mapFromDb(data), viaSupabase: true, message: 'Check-Out berhasil!' }
}

export const fetchGuestVisits = async () => {
  const { data, error } = await supabase
    .from('visits')
    .select('*')
    .order('jam_kunjungan', { ascending: false })
  if (error) throw new Error(error.message)
  return (data || []).map(mapFromDb)
}

export const fetchVisitById = async (idKunjungan) => {
  if (!idKunjungan) return null
  const { data } = await supabase.from('visits').select('*').eq('id_kunjungan', idKunjungan.trim()).single()
  return mapFromDb(data)
}

export const searchVisits = async (query) => {
  if (!query?.trim()) return []
  const q = `%${query.trim()}%`
  const { data } = await supabase
    .from('visits')
    .select('*')
    .or(`nama.ilike.${q},instansi.ilike.${q},id_kunjungan.ilike.${q}`)
    .order('jam_kunjungan', { ascending: false })
  return (data || []).map(mapFromDb)
}

export const searchActiveVisits = async (query) => {
  let builder = supabase.from('visits').select('*').eq('status', 'SEDANG BERKUNJUNG').order('jam_kunjungan', { ascending: false })
  if (query?.trim()) {
    const q = `%${query.trim()}%`
    builder = builder.or(`nama.ilike.${q},instansi.ilike.${q}`)
  }
  const { data } = await builder
  return (data || []).map(mapFromDb)
}
