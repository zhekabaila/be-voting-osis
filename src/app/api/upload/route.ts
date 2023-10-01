import { v2 as cloudinary } from 'cloudinary'
import '@/utils/cloudinary'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  // const { image, organization } = await req.json()

  const { resources } = await cloudinary.api.resource(
    '',
    {
      // resource_type: 'image',
      all: true,
    },
    (err, result) => {
      console.log(err)
      console.log(result)
    }
  )

  return NextResponse.json(
    { data: resources },
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    }
  )
}
