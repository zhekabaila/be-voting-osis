import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const populate = req.nextUrl.searchParams.get('populate[vote]')

    const oneUser = await prisma.user.findUnique({
      where: {
        id: params.id,
      },
      include: {
        vote: populate === 'true' ? true : false,
      },
    })

    return NextResponse.json(
      {
        code: 200,
        data: oneUser,
        message: oneUser
          ? `successfully get user data with id: ${params.id}`
          : 'user data is not available',
        status: 'success',
      },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, PUT, DELETE',
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
          'Access-Control-Allow-Methods': 'GET, PUT, DELETE',
          'Access-Control-Allow-Headers': '*',
        },
      }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const {
      nisn,
      password,
      token,
    }: {
      nisn?: string
      password?: string
      token?: boolean
    } = await req.json()

    const updatedOneUser = await prisma.user.update({
      where: {
        id: params.id,
      },
      data: {
        nisn,
        password,
        token,
      },
    })

    return NextResponse.json(
      {
        code: 200,
        data: updatedOneUser,
        message: `successfully updated user with id: ${params.id}`,
        status: 'success',
      },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, PUT, DELETE',
          'Access-Control-Allow-Headers': '*',
        },
      }
    )
  } catch (error) {
    return NextResponse.json(
      {
        code: 400,
        error,
        message: `not found`,
        status: 'error',
      },
      {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, PUT, DELETE',
          'Access-Control-Allow-Headers': '*',
        },
      }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deletedOneUser = await prisma.user.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json(
      {
        code: 200,
        data: deletedOneUser,
        message: `successfully deleted user with id: ${params.id}`,
        status: 'success',
      },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, PUT, DELETE',
          'Access-Control-Allow-Headers': '*',
        },
      }
    )
  } catch (error) {
    return NextResponse.json(
      {
        code: 400,
        error,
        message: `not found`,
        status: 'error',
      },
      {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, PUT, DELETE',
          'Access-Control-Allow-Headers': '*',
        },
      }
    )
  } finally {
    await prisma.$disconnect()
  }
}
