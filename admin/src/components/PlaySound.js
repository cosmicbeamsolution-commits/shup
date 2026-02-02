module.exports = function (audio, vol) {
  if (vol === undefined) vol = 1
  if (audio === undefined) audio = 'tag.mp3'

  const sound = new Audio('/sounds/' + audio)
  sound.volume = vol

  var promise = sound.play()

  if (promise !== undefined) {
    promise.then(_ => {
      // Automatic playback started!
    }).catch(error => {
      console.log(error)
    })
  }
}
