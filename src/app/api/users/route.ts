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

    const queryAllowed = ['id', 'nisn', 'token', 'Role']
    // eslint-disable-next-line react-hooks/rules-of-hooks
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
        data: users,
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

export async function PUT(req: NextRequest) {
  try {
    const Role: any = req.nextUrl.searchParams.get('Role')

    const {
      token,
    }: {
      nisn?: string
      password?: string
      token?: boolean
    } = await req.json()

    const users = await prisma.user.updateMany({
      where: {
        Role: Role,
      },
      data: {
        token,
      },
    })

    return NextResponse.json(
      {
        data: users,
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
