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

    const populate =
      req.nextUrl.searchParams.get('populate[kandidat]') === 'true'
        ? true
        : false

    const pemilihan = await prisma.pemilihan.findMany({
      where: {
        ...wheres,
      },
      include: {
        kandidat: populate,
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
    const reqBody: {
      judul: string
      organisasi: 'OSIS' | 'MPK'
      kedaluwarsa: Date
      kandidat: {
        createMany: {
          data: {
            no_urut: number
            nama: string
            kelas: string
            jurusan: string
            foto: string
            moto: string
            visi: string
            misi: string
          }[]
        }
      }
    } = await req.json()

    const pemilihan = await prisma.pemilihan.create({
      data: {
        ...reqBody,
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

export async function DELETE(req: NextRequest) {
  const { id }: { id: string[] } = await req.json()

  try {
    const deletedPemilihan = await prisma.pemilihan.deleteMany({
      where: {
        id: {
          in: id,
        },
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
