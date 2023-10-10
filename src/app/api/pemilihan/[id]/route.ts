import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const populate =
      req.nextUrl.searchParams.get('populate[kandidat]') === 'true'
        ? true
        : false

    const pemilihan = await prisma.pemilihan.findUnique({
      where: {
        id: params.id,
      },
      include: {
        kandidat: populate,
      },
    })

    return NextResponse.json(
      {
        code: 200,
        data: pemilihan,
        message: pemilihan
          ? 'successfully get pemilihan data'
          : 'pemilihan data is not available',
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
    const reqBody = await req.json()

    const updatedPemilihan = await prisma.pemilihan.update({
      where: {
        id: params.id,
      },
      ...reqBody,
    })

    return NextResponse.json(
      {
        code: 200,
        data: updatedPemilihan,
        message: `successfully updated pemilihan data with id: ${params.id}`,
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
        error,
        code: 400,
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
    const deletedPemilihan = await prisma.pemilihan.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json(
      {
        code: 200,
        data: deletedPemilihan,
        message: `successfully deleted pemilihan data with id: ${params.id}`,
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
