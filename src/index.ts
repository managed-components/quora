import { ComponentSettings, Manager, MCEvent } from '@managed-components/types'
import { getHashedString } from './utils'

const sendEvent = (pixelId: string) => async (event: MCEvent) => {
  const { client, payload } = event
  const em = payload.email ? await getHashedString(payload.email) : null

  const query = {
    u: client.url.href,
    tag: payload.en || 'ViewContent',
    ts: new Date().valueOf().toString(),
    j: '1', // this is hard-coded
    ...(em && { em }),
  }

  const params = new URLSearchParams(query).toString()

  client.fetch(`https://q.quora.com/_/ad/${pixelId}/pixel?${params}`, {
    credentials: 'include',
    keepalive: true,
    mode: 'no-cors',
  })
}

export default async function (manager: Manager, settings: ComponentSettings) {
  manager.addEventListener('pageview', sendEvent(settings.pixelId))
  manager.addEventListener('event', sendEvent(settings.pixelId))
}
