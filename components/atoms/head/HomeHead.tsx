import Head from 'next/head'
import { FC } from 'react'

const websiteURL = process.env.NEXT_PUBLIC_WEBSITE_URL

const HomeHead: FC = () => (
  <Head>
    <title>Watch Video Together — isling</title>
    <meta name="description" content="Let's watch videos together" />
    <meta property="og:url" content={websiteURL} />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="Watch Video Together — isling" />
    <meta property="og:description" content="Let's watch videos together" />
    <meta
      property="og:image"
      content="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2232&q=80"
    />
    <link rel="icon" href="/favicon.ico" />
  </Head>
)

export default HomeHead
