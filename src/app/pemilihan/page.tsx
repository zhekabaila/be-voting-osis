'use client'

import React, { useState } from 'react'

interface Pemilihan {
  judul: string
  organisasi: 'MPK' | 'OSIS'
  kedaluwarsa: Date | ''
  kandidat?: {
    createMany?: {
      data: Kandidat[]
    }
  }
}

interface Kandidat {
  no_urut: number | null
  nama: string
  kelas: string
  jurusan: string
  foto: string
  moto: string
  visi: string
  misi: string
}

const PemilihanPage = () => {
  const [formData, setFormData] = useState<Pemilihan>({
    judul: '',
    organisasi: 'MPK',
    kedaluwarsa: '',
    kandidat: {
      createMany: {
        data: [
          {
            no_urut: null,
            nama: '',
            kelas: '',
            jurusan: '',
            foto: '',
            moto: '',
            visi: '',
            misi: '',
          },
        ],
      },
    },
  })

  console.log(formData)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleKandidatInputChange = (
    index: number,
    e: { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target
    const updatedKandidat: any = [...formData.kandidat.createMany.data]
    updatedKandidat[index][name] = value

    setFormData({
      ...formData,
      kandidat: {
        createMany: {
          data: updatedKandidat,
        },
      },
    })
  }

  const handleAddKandidat = () => {
    const newKandidat = {
      no_urut: null,
      nama: '',
      kelas: '',
      jurusan: '',
      foto: '',
      moto: '',
      visi: '',
      misi: '',
    }

    setFormData({
      ...formData,
      kandidat: {
        createMany: {
          data: [...formData.kandidat.createMany.data, newKandidat],
        },
      },
    })
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    // Kirim formData ke server atau lakukan tindakan lain sesuai kebutuhan
  }

  return (
    <main>
      <div>
        <h1>Form Pemilihan Ketua Osis 2023/2024</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Judul :</label>
            <input
              type="text"
              name="judul"
              value={formData.judul}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Organisasi:</label>
            <input
              type="text"
              name="organisasi"
              value={formData.organisasi}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Kedaluwarsa:</label>
            <input
              type="date"
              name="kedaluwarsa"
              value={formData.kedaluwarsa}
              onChange={handleInputChange}
            />
          </div>
          <h2>Kandidat</h2>
          {formData.kandidat.createMany.data.map((kandidat, index) => (
            <div key={index}>
              <h3>Kandidat {kandidat.no_urut}</h3>
              <div>
                <input
                  type="text"
                  name="nama"
                  value={kandidat.nama}
                  onChange={(e) => handleKandidatInputChange(index, e)}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="kelas"
                  value={kandidat.kelas}
                  onChange={(e) => handleKandidatInputChange(index, e)}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="jurusan"
                  value={kandidat.jurusan}
                  onChange={(e) => handleKandidatInputChange(index, e)}
                />
              </div>
            </div>
          ))}
          <button type="button" onClick={handleAddKandidat}>
            Tambah Kandidat
          </button>
          <button type="submit">Simpan</button>
        </form>
      </div>
    </main>
  )
}

export default PemilihanPage
