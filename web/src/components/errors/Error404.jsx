import NotFound from '../../assets/404.svg'

const Error404 = () => {
  return (
    <div>
      <img src={NotFound} style={{ width: '100%' }} alt="404 not found" />
    </div>
  )
}

export default Error404
