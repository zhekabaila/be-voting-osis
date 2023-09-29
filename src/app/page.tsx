'use client'

import axios from 'axios'
import Image from 'next/image'
import React, { useState } from 'react'

const Home = () => {
  const [image, setImage] = useState<string>('')
  const [organization, setOrganization] = useState<string>('')

  const handleImage = (e: any) => {
    const file = e.target.files[0]
    setFileToBase(file)
    console.log(file)
  }

  const setFileToBase = (file: File) => {
    const reader: any = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setImage(reader.result)
    }
  }

  console.log(image)

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    const { data } = await axios.post('http://localhost:3000/api/upload', {
      image: image,
      organization: organization,
    })

    console.log(data)
    setImage('')

    // const formData = new FormData()
    // for (let i = 0; i < files.length; i++) {
    //   let file = files[i]
    //   formData.append('file', file)
    //   formData.append('api_key', signData.apikey)
    //   formData.append('timestamp', signData.timestamp)
    //   formData.append('signature', signData.signature)
    // formData.append('folder', 'OSIS')

    //   console.log(formData)

    //   const url = `https://api.cloudinary.com/v1_1/${signData.cloudname}/image/upload`

    //   axios
    //     .post('/api/upload', {
    //       formData,
    //     })
    //     .then((res) => console.log(res))
    //     .catch((err) => console.log(err))

    // fetch(url, {
    //   method: 'POST',
    //   body: formData,
    // })
    //   .then((response) => {
    //     return response.text()
    //   })
    //   .then((data) => {
    //     console.log(JSON.parse(data))
    //   })
    // }
  }

  return (
    <main>
      {image && image !== '' && (
        <Image
          src={image}
          width={500}
          height={500}
          alt={image}
          style={{ objectFit: 'cover' }}
        />
      )}
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleImage} />
        <select
          name=""
          id=""
          required
          onChange={({ target }: { target: { value: string } }) =>
            setOrganization(target.value)
          }
        >
          <option value="OSIS">OSIS</option>
          <option value="MPK">MPK</option>
        </select>
        <button
          type="submit"
          className="px-7 py-2.5 text-3xl font-white bg-orange-400"
        >
          submit
        </button>
      </form>
    </main>
  )
}

export default Home
