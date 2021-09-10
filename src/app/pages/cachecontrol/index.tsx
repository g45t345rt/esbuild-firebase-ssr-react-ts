import React from 'react'
import { Helmet } from 'react-helmet'

export default (): JSX.Element => {
  return <div>
    <Helmet>
      <meta http-equiv="cache-control" content="public, max-age=300, s-maxage=600" />
    </Helmet>
    Testing FIREBASE CDN cache-control on dynamic content (ssr)
  </div>
}
