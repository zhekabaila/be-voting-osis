import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const populate = req.nextUrl.searchParams.get('populate')

    const oneUser = await prisma.user.findUnique({
      where: {
        id: params.id
      },
      include: {
        vote: populate === 'true' ? true : false
      }
    })

    return NextResponse.json({
      data: oneUser,
      message: 'OK'
    })
  } catch (error) {
    return NextResponse.json(
      {
        error
      },
      {
        status: 500
      }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const {
      nisn,
      password,
      token
    }: {
      nisn?: string
      password?: string
      token?: boolean
    } = await req.json()

    const updatedOneUser = await prisma.user.update({
      where: {
        id: params.id
      },
      data: {
        nisn,
        password,
        token
      }
    })

    return NextResponse.json({
      data: updatedOneUser,
      message: 'OK'
    })
  } catch (error) {
    return NextResponse.json(
      {
        error
      },
      {
        status: 500
      }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deletedOneUser = await prisma.user.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json({
      data: deletedOneUser,
      message: 'OK'
    })
  } catch (error) {
    return NextResponse.json(
      {
        error
      },
      {
        status: 500
      }
    )
  } finally {
    await prisma.$disconnect()
  }
}
