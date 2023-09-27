import { Kandidat, PrismaClient } from '@prisma/client'
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

    const queryAllowed = ['id', 'judul', 'organisasi', 'kedaluwarsa']

    const wheres = useQuery(queryAllowed)

    const populateKandidat =
      req.nextUrl.searchParams.get('populate[kandidat]') === 'true'
        ? true
        : false
    const populateVote =
      req.nextUrl.searchParams.get('populate[vote]') === 'true' ? true : false

    const pemilihan = await prisma.pemilihan.findMany({
      where: {
        ...wheres,
      },
      include: {
        kandidat: populateKandidat,
        votes: populateVote,
      },
    })
    console.log(new Date())

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

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json()

    const createdPemilihan = await prisma.pemilihan.create({
      ...reqBody,
    })

    return NextResponse.json({
      data: createdPemilihan,
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

export async function DELETE(req: NextRequest) {
  try {
    const where = await req.json()

    const deletedPemilihan = await prisma.pemilihan.deleteMany({
      ...where,
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
