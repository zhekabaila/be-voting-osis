import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const populateKandidat = req.nextUrl.searchParams.get('populate[kandidat]')
    const populatePemilihan = req.nextUrl.searchParams.get(
      'populate[pemilihan]'
    )
    const populateUser = req.nextUrl.searchParams.get('populate[user]')

    const votes = await prisma.vote.findUnique({
      where: {
        id: params.id,
      },
      include: {
        user: populateUser === 'true' ? true : false,
        pemilihan: populatePemilihan === 'true' ? true : false,
        kandidat: populateKandidat === 'true' ? true : false,
      },
    })

    return NextResponse.json(
      {
        data: votes,
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
