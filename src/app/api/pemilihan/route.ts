import { v2 as cloudinary } from 'cloudinary'
import '@/utils/cloudinary'
import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  try {
    const useQuery = (allowedKey: string[]) => {
      const queries: any = {}

      allowedKey.forEach((key: any) => {
        const value = req.nextUrl.searchParams.get(key)
        if (value) {
          queries[key] = value
        }
      })

      return queries
    }

    const queryAllowed = ['id', 'judul', 'organisasi', 'kedaluwarsa']

    const wheres = useQuery(queryAllowed)

    const populateKandidat =
      req.nextUrl.searchParams.get('populate[kandidat]') === 'true'
        ? true
        : false
    const populateVote =
      req.nextUrl.searchParams.get('populate[vote]') === 'true' ? true : false

    const pemilihan = await prisma.pemilihan.findMany({
      where: {
        ...wheres,
      },
      include: {
        kandidat: populateKandidat,
        votes: populateVote,
      },
    })

    return NextResponse.json(
      {
        data: pemilihan,
        code: 200,
        message: pemilihan
          ? 'successfully get pemilihan data'
          : 'pemilihan data is not available',
        status: 'success',
      },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, PUT, DELETE, POST',
          'Access-Control-Allow-Headers': '*',
        },
      }
    )
  } catch (error) {
    return NextResponse.json(
      {
        code: 400,
        error,
        message: 'not found',
        status: 'error',
      },
      {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, PUT, DELETE, POST',
          'Access-Control-Allow-Headers': '*',
        },
      }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(req: NextRequest) {
  try {
    const reqBody: {
      data: {
        judul: string
        organisasi: 'OSIS' | 'MPK'
        kedaluwarsa: Date
        kandidat?: {
          create: {
            no_urut: number
            nama: string
            kelas: string
            jurusan: string
            foto: string
            moto: string
            visi: string
            misi: string
          }
        }
      }
    } = await req.json()

    /**
     * Example Payload 
    {
      "data": {
          "judul": "Pemilihan Osis 2023/2024",
          "organisasi": "OSIS",
          "kedaluwarsa": "2023-09-26T07:05:57.148Z",
          "kandidat": {
              "create": {
                  "no_urut": 1,
                  "nama": "kandidat 1",
                  "kelas": "1",
                  "jurusan": "1",
                  "foto": "FOTO.png",
                  "moto": "1",
                  "visi": "1",
                  "misi": "1"
              }
          }
      }
  }
  */

    let response

    if (typeof reqBody.data.kandidat !== 'undefined') {
      const result = await cloudinary.uploader.upload(
        reqBody.data.kandidat.create.foto,
        {
          folder:
            reqBody.data.organisasi === 'MPK' ||
            reqBody.data.organisasi === 'OSIS'
              ? reqBody.data.organisasi
              : undefined,
        },
        (error, result) => {
          if (error) return error
          return result
        }
      )
      reqBody.data.kandidat.create.foto = result.secure_url

      response = await prisma.pemilihan.create({
        ...reqBody,
      })
    } else {
      response = await prisma.pemilihan.create({
        ...reqBody,
      })
    }

    return NextResponse.json(
      {
        code: 201,
        data: response,
        message: 'successfully created new pemilihan data',
        status: 'seccess',
      },
      {
        status: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, PUT, DELETE, POST',
          'Access-Control-Allow-Headers': '*',
        },
      }
    )
  } catch (error) {
    return NextResponse.json(
      {
        code: 400,
        error,
        message: 'not found',
        status: 'error',
      },
      {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, PUT, DELETE, POST',
          'Access-Control-Allow-Headers': '*',
        },
      }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const where = await req.json()

    const deletedPemilihan = await prisma.pemilihan.deleteMany({
      ...where,
    })

    return NextResponse.json(
      {
        code: 200,
        data: deletedPemilihan,
        message: 'successfully deleted pemilihan data',
        status: 'success',
      },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, PUT, DELETE, POST',
          'Access-Control-Allow-Headers': '*',
        },
      }
    )
  } catch (error) {
    return NextResponse.json(
      {
        code: 400,
        error,
        message: 'not found',
        status: 'error',
      },
      {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, PUT, DELETE, POST',
          'Access-Control-Allow-Headers': '*',
        },
      }
    )
  } finally {
    await prisma.$disconnect()
  }
}
