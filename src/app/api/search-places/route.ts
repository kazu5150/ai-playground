import { NextRequest, NextResponse } from 'next/server'

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { query, location } = await request.json()

    if (!query) {
      return NextResponse.json(
        { error: '検索条件が提供されていません' },
        { status: 400 }
      )
    }

    if (!GOOGLE_PLACES_API_KEY) {
      return NextResponse.json(
        { error: 'Google Places APIキーが設定されていません' },
        { status: 500 }
      )
    }

    // Google Places APIのText Searchを使用
    const searchQuery = location ? `${query} in ${location}` : query
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${GOOGLE_PLACES_API_KEY}&language=ja&region=jp`

    console.log('Searching places with query:', searchQuery)

    const response = await fetch(url)
    
    if (!response.ok) {
      console.error('Google Places API error:', response.status, response.statusText)
      return NextResponse.json(
        { error: `Google Places APIエラー: ${response.status} ${response.statusText}` },
        { status: 500 }
      )
    }

    const data = await response.json()

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google Places API response error:', data.status, data.error_message)
      return NextResponse.json(
        { error: `Google Places API response error: ${data.status}` },
        { status: 500 }
      )
    }

    // 結果を最大10件に制限
    const places = (data.results || []).slice(0, 10)

    console.log(`Found ${places.length} places`)

    return NextResponse.json({
      places,
      status: data.status
    })

  } catch (error) {
    console.error('Places search API error:', error)
    return NextResponse.json(
      { error: '場所検索中にエラーが発生しました' },
      { status: 500 }
    )
  }
}