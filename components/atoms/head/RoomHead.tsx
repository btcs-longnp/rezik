import Head from 'next/head'
import { RoomPublic } from '../../../models/room/Room'
import { FC } from 'react'

const websiteURL = process.env.NEXT_PUBLIC_WEBSITE_URL

export interface RoomHeadProps {
  roomPublic: RoomPublic
  path: string
}

const RoomHead: FC<RoomHeadProps> = ({ roomPublic, path }) => (
  <Head>
    <title>{`${roomPublic.name} — isling`}</title>
    <meta name="description" content={roomPublic.description} />
    <meta property="og:url" content={`${websiteURL}${path}`} />
    <meta property="og:type" content="article" />
    <meta property="og:title" content={`${roomPublic.name} — isling`} />
    <meta property="og:description" content={roomPublic.description} />
    <meta property="og:image" content={roomPublic.coverUrl} />
    <link rel="icon" href="/favicon.ico" />
  </Head>
)

export default RoomHead
