import https from 'https'

https.get('https://shree-ayurveda.netlify.app/', (res) => {
  let data = ''
  res.on('data', chunk => data += chunk)
  res.on('end', () => {
    console.log('Status code:', res.statusCode)
    const scriptMatch = data.match(/src=["']([^"']+\.js)["']/)
    console.log('Live Script:', scriptMatch ? scriptMatch[1] : 'No script found')
    const cssMatch = data.match(/href=["']([^"']+\.css)["']/)
    console.log('Live CSS:', cssMatch ? cssMatch[1] : 'No CSS found')
  })
}).on('error', err => console.error(err))
