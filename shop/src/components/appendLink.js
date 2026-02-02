export default function appendLink (id, url) {
  let style = document.createElement('link')
  let exists = document.getElementById(id)
  if (exists) {
    exists.remove()
  }
  style.id = id
  style.type = 'text/css'
  style.rel = 'stylesheet'
  style.href = url
  document.head.appendChild(style)
}
