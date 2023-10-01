'use client'

import axios from 'axios'
import React, { useState, useEffect } from 'react'

interface KandidatPayloadType {
  no_urut: number
  nama: string
  kelas: string
  jurusan: string
  foto: string
  moto: string
  visi: string
  misi: string
  pemilihanId: string
}

const HomePage = () => {
  const [pemilihanId, setPemilihanId] = useState([])
  const [result, setResult] = useState<any>(null)
  const [payload, setPayload] = useState<KandidatPayloadType>({
    no_urut: 0,
    nama: '',
    kelas: '',
    jurusan: '',
    foto: '',
    moto: '',
    visi: '',
    misi: '',
    pemilihanId: '',
  })

  useEffect(() => {
    axios.get('/api/pemilihan').then(({ data }) => setPemilihanId(data.data))
  }, [])

  console.log(pemilihanId)

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    alert('tunggu data sedang di proses!')

    const result = await axios.post('/api/kandidat', {
      data: {
        ...payload,
      },
    })

    alert('Cek Console untuk response')
    console.log(result.data)
  }

  const setFileToBase = (file: File) => {
    const reader: any = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setPayload({
        ...payload,
        foto: reader.result,
      })
    }
  }

  console.log(payload)

  return (
    <main className="h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        action=""
        className="bg-slate-500 rounded-lg p-8 max-w-xl space-y-4"
      >
        <h1>Contoh Form pendaftaran kandidat</h1>
        <br />
        <input
          type="number"
          name="no_urut"
          className="p-3 w-full bg-white text-black font-semibold"
          placeholder="no_urut"
          onChange={({ target }: { target: { value: string } }) =>
            setPayload({
              ...payload,
              no_urut: parseInt(target.value),
            })
          }
        />
        <input
          type="text"
          name="nama"
          className="p-3 w-full bg-white text-black font-semibold"
          placeholder="nama"
          onChange={({ target }: { target: { value: string } }) =>
            setPayload({
              ...payload,
              nama: target.value,
            })
          }
        />
        <input
          type="text"
          name="kelas"
          className="p-3 w-full bg-white text-black font-semibold"
          placeholder="kelas"
          onChange={({ target }: { target: { value: string } }) =>
            setPayload({
              ...payload,
              kelas: target.value,
            })
          }
        />
        <input
          type="text"
          name="jurusan"
          className="p-3 w-full bg-white text-black font-semibold"
          placeholder="jurusan"
          onChange={({ target }: { target: { value: string } }) =>
            setPayload({
              ...payload,
              jurusan: target.value,
            })
          }
        />
        <input
          type="file"
          name="foto"
          className="p-3 w-full bg-white text-black font-semibold"
          placeholder="foto"
          onChange={({ target }: any) => setFileToBase(target.files[0])}
        />
        <input
          type="text"
          name="moto"
          className="p-3 w-full bg-white text-black font-semibold"
          placeholder="moto"
          onChange={({ target }: { target: { value: string } }) => {
            setPayload({
              ...payload,
              moto: target.value,
            })
          }}
        />
        <input
          type="text"
          name="visi"
          className="p-3 w-full bg-white text-black font-semibold"
          placeholder="visi"
          onChange={({ target }: { target: { value: string } }) => {
            setPayload({
              ...payload,
              visi: target.value,
            })
          }}
        />
        <input
          type="text"
          name="misi"
          className="p-3 w-full bg-white text-black font-semibold"
          placeholder="misi"
          onChange={({ target }: { target: { value: string } }) => {
            setPayload({
              ...payload,
              misi: target.value,
            })
          }}
        />
        <p className="text-red-400 font-medium">
          * note: opsi pemilihanId harus di click dulu, biar value nya kebaca
        </p>
        <select
          name="pemilihanId"
          className="p-3 w-full bg-white text-black font-semibold"
          placeholder="pemilihanId"
          onChange={({ target }: { target: { value: string } }) =>
            setPayload({
              ...payload,
              pemilihanId: target.value,
            })
          }
        >
          {pemilihanId.map(({ id }, index: number) => (
            <option key={index} value={id}>
              {id}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="p-3 w-full bg-green-600 text-black font-semibold"
        >
          SUBMIT
        </button>
      </form>
    </main>
  )
}

export default HomePage
