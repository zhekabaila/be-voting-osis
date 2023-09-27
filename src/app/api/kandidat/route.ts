import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

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
        // votes: {
        //   every: {
        //     ...searchVotes,
        //   },
        // },
        no_urut: parseInt(no_urut) ? parseInt(no_urut) : undefined,
      },
      include: {
        votes: populate,
      },
    })

    return NextResponse.json(
      {
        data: kandidats,
        message: 'OK',
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    return NextResponse.json(
      {
        error,
      },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, DELETE',
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
    const reqBody: any = await req.json()

    if (Array.isArray(reqBody.data)) {
      const kandidats = await prisma.kandidat.createMany({
        ...reqBody,
      })
      return NextResponse.json(
        {
          data: kandidats,
          message: 'OK',
        },
        {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, DELETE',
            'Access-Control-Allow-Headers': '*',
          },
        }
      )
    } else {
      const kandidat = await prisma.kandidat.create({
        ...reqBody,
      })
      return NextResponse.json(
        {
          data: kandidat,
          message: 'OK',
        },
        {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, DELETE',
            'Access-Control-Allow-Headers': '*',
          },
        }
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        error,
      },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, DELETE',
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
    const reqBody = await req.json()

    const deletedKandidats = await prisma.kandidat.deleteMany({
      ...reqBody,
    })

    return NextResponse.json(
      {
        data: deletedKandidats,
        message: 'OK',
      },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, DELETE',
          'Access-Control-Allow-Headers': '*',
        },
      }
    )
  } catch (error) {
    return NextResponse.json(
      {
        error,
      },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, DELETE',
          'Access-Control-Allow-Headers': '*',
        },
      }
    )
  } finally {
    await prisma.$disconnect()
  }
}
