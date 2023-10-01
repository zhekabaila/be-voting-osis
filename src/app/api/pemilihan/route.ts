import { Kandidat, PrismaClient } from '@prisma/client'
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

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json()

    const createdPemilihan = await prisma.pemilihan.create({
      ...reqBody,
    })

    return NextResponse.json(
      {
        code: 201,
        data: createdPemilihan,
        message: 'successfully created new pemilihan data',
        status: 'seccess',
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
