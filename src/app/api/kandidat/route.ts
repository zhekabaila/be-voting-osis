import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { v2 as cloudinary } from 'cloudinary'
import '@/utils/cloudinary'

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
    const useQueryVotes = (allowedKey: string[]) => {
      const queries: any = {}

      allowedKey.forEach((key: any) => {
        const value = req.nextUrl.searchParams.get(`votes[${key}]`)
        if (value) {
          queries[key] = value
        }
      })

      return queries
    }

    const queryAllowed = {
      general: ['nama', 'kelas', 'jurusan', 'foto', 'moto', 'visi', 'misi'],
      votes: ['userId', 'kandidatId'],
    }

    const wheres = useQuery(queryAllowed.general)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const searchVotes = useQueryVotes(queryAllowed.votes)
    const populate =
      req.nextUrl.searchParams.get('populate[votes]') === 'true' ? true : false
    const no_urut: any = req.nextUrl.searchParams.get('no_urut')
    const pemilihanId: string | undefined =
      req.nextUrl.searchParams.get('pemilihanId') ?? undefined

    const kandidats = await prisma.kandidat.findMany({
      where: {
        pemilihan: {
          id: pemilihanId,
        },
        votes: {
          every: {
            ...searchVotes,
          },
        },
        ...wheres,
        no_urut: parseInt(no_urut) ? parseInt(no_urut) : undefined,
      },
      include: {
        votes: populate,
      },
    })

    return NextResponse.json(
      {
        code: 200,
        data: kandidats,
        message:
          kandidats.length > 0
            ? 'successfully get kandidat data'
            : 'kandidat data not available',
        status: 'success',
      },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  } catch (error) {
    return NextResponse.json(
      {
        code: 400,
        error,
        message: 'Not Found',
        status: 'error',
      },
      {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(req: NextRequest) {
  try {
    let { data } = await req.json()

    const result = await cloudinary.uploader.upload(
      data.foto,
      {
        folder: data.organisasi ?? undefined,
      },
      (error, result) => {
        if (error) return error
        return result
      }
    )

    data.foto = result.secure_url

    const kandidat = await prisma.kandidat.create({
      data,
    })
    return NextResponse.json(
      {
        code: 201,
        data: kandidat,
        message: kandidat
          ? 'successfully created new kandidat data'
          : 'failed to create kandidat data',
        status: 'success',
      },
      {
        status: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
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
        },
      }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const reqBody = await req.json()

    const deletedKandidats = await prisma.kandidat.deleteMany({
      ...reqBody,
    })

    return NextResponse.json(
      {
        code: 200,
        data: deletedKandidats,
        message: 'successfully deleted kandidat data',
        status: 'success',
      },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
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
        },
      }
    )
  } finally {
    await prisma.$disconnect()
  }
}
