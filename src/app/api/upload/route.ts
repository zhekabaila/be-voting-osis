import { v2 as cloudinary } from 'cloudinary'
import '@/utils/cloudinary'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { image, organization } = await req.json()

  //   console.log(...file)

  if (!image || !organization) {
    return NextResponse.json(
      {
        message: 'Image or organization is undefined',
      },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': '*',
        },
      }
    )
  }

  const result = await cloudinary.uploader.upload(
    image,
    { folder: organization },
    function (error, result) {
      if (error) return error
      return result
    }
  )
  return NextResponse.json(
    { data: result },
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': '*',
      },
    }
  )
}
