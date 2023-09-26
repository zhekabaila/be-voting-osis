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

    return NextResponse.json({
      data: pemilihan,
      message: 'OK',
    })
  } catch (error) {
    return NextResponse.json(
      { error },
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
    const {
      data,
    }: {
      data: {
        judul?: string
        organisasi?: 'OSIS' | 'MPK'
        kedaluwarsa?: Date
      }
    } = await req.json()

    const updatedPemilihan = await prisma.pemilihan.update({
      where: {
        id: params.id,
      },
      data,
    })

    return NextResponse.json({
      data: updatedPemilihan,
      message: 'OK',
    })
  } catch (error) {
    return NextResponse.json(
      { error },
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
    const deletedPemilihan = await prisma.pemilihan.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({
      data: deletedPemilihan,
      message: 'OK',
    })
  } catch (error) {
    return NextResponse.json(
      { error },
      {
        status: 500,
      }
    )
  } finally {
    await prisma.$disconnect()
  }
}
