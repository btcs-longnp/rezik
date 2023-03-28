export interface YouTubeVideo {
  id: string
  snippet: {
    title: string
    description: string
    channelTitle: string
    thumbnails: {
      high: {
        url: string
        width: number
        height: number
      }
    }
  }
  contentDetails: {
    duration: string
    aspectRatio: string
  }
}
