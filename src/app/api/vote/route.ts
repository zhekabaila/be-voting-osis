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

    const queryAllowed = ['id', 'userId', 'pemilihanId', 'kandidatId']
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const wheres = useQuery(queryAllowed)
    const populateKandidat = req.nextUrl.searchParams.get('populate[kandidat]')
    const populatePemilihan = req.nextUrl.searchParams.get(
      'populate[pemilihan]'
    )
    const populateUser = req.nextUrl.searchParams.get('populate[user]')

    const votes = await prisma.vote.findMany({
      where: {
        ...wheres,
      },
      include: {
        user: populateUser === 'true' ? true : false,
        pemilihan: populatePemilihan === 'true' ? true : false,
        kandidat: populateKandidat === 'true' ? true : false,
      },
    })

    return NextResponse.json(
      {
        code: 200,
        data: votes,
        message:
          votes.length > 0
            ? 'successfully get votes data'
            : 'votes data id not available',
        status: 'success',
      },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST',
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
          'Access-Control-Allow-Methods': 'GET, POST',
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
    const reqBody = await req.json()

    const result = await prisma.vote.create({
      ...reqBody,
    })

    return NextResponse.json(
      {
        code: 200,
        data: result,
        message: 'successfully created new votes data',
        status: 'success',
      },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST',
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
          'Access-Control-Allow-Methods': 'GET, POST',
          'Access-Control-Allow-Headers': '*',
        },
      }
    )
  } finally {
    await prisma.$disconnect()
  }
}
