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
      general: [
        'no_urut',
        'nama',
        'kelas',
        'jurusan',
        'foto',
        'moto',
        'visi',
        'misi',
      ],
      votes: ['userId', 'pemilihanId', 'kandidatId'],
    }

    const wheres = useQuery(queryAllowed.general)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const searchVotes = useQueryVotes(queryAllowed.votes)
    const populate =
      req.nextUrl.searchParams.get('populate[votes]') === 'true' ? true : false
    const no_urut: any = req.nextUrl.searchParams.get('no_urut')

    const kandidats = await prisma.kandidat.findMany({
      where: {
        ...wheres,
        votes: {
          some: {
            ...searchVotes,
          },
        },
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
      }
    )
  } finally {
    await prisma.$disconnect()
  }
}

interface KandidatPostType {
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

export async function POST(req: NextRequest) {
  try {
    const { data }: { data: KandidatPostType[] } = await req.json()

    const kandidats = await prisma.kandidat.createMany({
      data,
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
      }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id }: { id: string[] } = await req.json()

    const deletedKandidats = await prisma.kandidat.deleteMany({
      where: {
        id: {
          in: id,
        },
      },
    })

    return NextResponse.json(
      {
        data: deletedKandidats,
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
      }
    )
  } finally {
    await prisma.$disconnect()
  }
}
