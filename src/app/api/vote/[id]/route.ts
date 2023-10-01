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
        code: 200,
        data: votes,
        message: votes
          ? `successfully get votes data with id: ${params.id}`
          : 'votes data is not available',
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
        code: 400,
        error,
        message: 'not found',
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
