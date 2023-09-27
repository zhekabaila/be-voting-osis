'use client'

import { useState } from 'react'

function UploadImage() {
  const [image, setImage] = useState<any>(null)

  const handleImageChange = (e: any) => {
    const file = e.target.files[0]
    setImage(file)
  }

  const handleUpload = async () => {
    const formData = new FormData()
    formData.append('image', image)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        console.log('URL gambar yang diunggah:', data.url)
        // Simpan URL gambar ini atau gunakan sesuai kebutuhan Anda
      } else {
        console.error('Gagal mengunggah gambar.')
      }
    } catch (error) {
      console.error('Terjadi kesalahan:', error)
    }
  }

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  )
}
