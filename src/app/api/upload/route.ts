import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: 'dctqloe37',
  api_key: '622392768888815',
  api_secret: 'dVJqrG9WOsXq0MSlh2iPEbtY8aI',
})

export async function GET(req: any) {
  try {
    const uploadImage = await cloudinary.uploader.upload(
      'https://images.unsplash.com/photo-1682686580036-b5e25932ce9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1975&q=80',
      { public_id: 'mountain_image_1' },
      (error, result) => {
        if (error) {
          console.log(error)
          return error
        }
        return result
      }
    )

    return new NextResponse('ss', {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    return NextResponse.json({
      error,
    })
  }
}
