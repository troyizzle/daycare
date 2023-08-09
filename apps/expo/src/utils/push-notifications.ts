type NotificationOptionsType = {
  sound?: string,
  title?: string,
  body: string,
}
export async function sendNotification(token: string, options: NotificationOptionsType) {
  const { sound, title, body } = options

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      'host': 'exp.host',
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'accept-encoding': 'gzip, deflate',
    },
    body: JSON.stringify({
      to: token,
      sound: sound ?? 'default',
      title: 'Stepping Stones' ?? title,
      body: body,
    }),
  }).catch((error) => {
    console.log(error)
  })
}

