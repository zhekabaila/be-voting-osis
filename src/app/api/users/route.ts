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

    const queryAllowed = ['id', 'nisn', 'token', 'role']
    const wheres = useQuery(queryAllowed)
    const populate = req.nextUrl.searchParams.get('populate[vote]')

    const users = await prisma.user.findMany({
      where: {
        ...wheres,
      },
      include: {
        vote: populate === 'true' ? true : false,
      },
    })

    return NextResponse.json(
      {
        code: 200,
        data: users,
        message:
          users.length > 0
            ? `successfully get users data`
            : 'user data is not available',
        status: 'success',
      },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, PUT',
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
          'Access-Control-Allow-Methods': 'GET, PUT',
          'Access-Control-Allow-Headers': '*',
        },
      }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function PUT(req: NextRequest) {
  try {
    const role: any = req.nextUrl.searchParams.get('role') ?? undefined

    const reqBody = await req.json()

    const users = await prisma.user.updateMany({
      where: {
        role: role,
      },
      ...reqBody,
    })

    return NextResponse.json(
      {
        code: 200,
        data: users,
        message: 'successfully updated users data',
        status: 'success',
      },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, PUT',
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
          'Access-Control-Allow-Methods': 'GET, PUT',
          'Access-Control-Allow-Headers': '*',
        },
      }
    )
  } finally {
    await prisma.$disconnect()
  }
}
