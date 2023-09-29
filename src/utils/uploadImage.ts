import '@/utils/cloudinary'
import { v2 as cloudinary } from 'cloudinary'
import { NextResponse } from 'next/server'

export const uploadImage = () => {
  const apiKey = cloudinary.config().api_key
  const cloudName = cloudinary.config().cloud_name
  const apiSecret = cloudinary.config().api_secret

  const timestamp = Math.round(new Date().getTime() / 1000)

  if (typeof apiSecret === 'undefined') {
    return NextResponse.json(
      {
        message: 'your CLOUDINARY_API_SECRET is undifined',
      },
      {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': '*',
        },
      }
    )
  }

  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
    },
    apiSecret
  )

  return {
    signature: signature,
    timestamp: timestamp,
    cloudname: cloudName,
    apikey: apiKey,
  }
}
