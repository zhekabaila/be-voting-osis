import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const populate =
      req.nextUrl.searchParams.get('populate[votes]') === 'true' ? true : false

    const kandidat = await prisma.kandidat.findUnique({
      where: {
        id: params.id,
      },
      include: {
        votes: populate,
      },
    })

    return NextResponse.json(
      {
        code: 200,
        data: kandidat,
        message: kandidat
          ? `Successfully get data with id: ${params.id}`
          : `kandidat with id: ${params.id} not found`,
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
        error,
        code: 400,
        message: 'Bad Request',
        status: 'success',
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

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reqBody: {
      no_urut?: number
      nama?: string
      kelas?: string
      jurusan?: string
      foto?: string
      moto?: string
      visi?: string
      misi?: string
    } = await req.json()
    const { pemilihanId }: { pemilihanId?: string } = await req.json()

    const kandidat = await prisma.kandidat.update({
      where: {
        id: params.id,
      },
      data: {
        ...reqBody,
        pemilihan: {
          connect: {
            id: pemilihanId ? pemilihanId : undefined,
          },
        },
      },
    })

    return NextResponse.json(
      {
        code: 200,
        data: kandidat,
        message: kandidat
          ? `Kandidat with id: ${params.id} successfully updated`
          : `Kandidat with id: ${params.id} not found`,
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
        code: 200,
        error,
        message: `Kandidat with id: ${params.id} not found`,
        status: 'error',
      },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
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
    const deletedKandidat = await prisma.kandidat.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json(
      {
        code: 200,
        data: deletedKandidat,
        message: deletedKandidat
          ? `Kandidat with id: ${params.id} successfully deleted`
          : `Kandidat with id: ${params.id} not found`,
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
        error,
        code: 400,
        message: 'Bad request',
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
