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
        data: kandidat,
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
        data: kandidat,
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
        data: deletedKandidat,
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
