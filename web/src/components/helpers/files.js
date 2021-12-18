export const getBase64 = (file, cb) => {
  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = function () {
    cb(reader.result)
  }
  reader.onerror = function (error) {
    console.log('Error: ', error)
  }
}
