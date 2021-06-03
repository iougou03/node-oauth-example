window.fbAsyncInit = () => {
  FB.init({
    appId: APP_CONFIG.FB_APP_ID,
    version: 'v10.0',
  })

  function checkLoginState() {
    FB.getLoginStatus((response) => {
      fetch(
        `/users/auth/facebook?access_token=${response.authResponse.accessToken}`,
        {
          method: 'POST',
        }
      ).then(() => window.location.reload())
    })
  }

  document.getElementById('fb-login').addEventListener('click', () => {
    FB.login(
      () => {
        checkLoginState()
      },
      {
        scope: 'public_profile,email',
        return_scopes: true,
      }
    )
  })
}
;((d, s, id) => {
  const fjs = d.getElementsByTagName(s)[0]
  if (d.getElementById(id)) {
    return
  }
  const js = d.createElement(s)
  js.id = id
  js.src = 'https://connect.facebook.net/ko_KR/sdk.js'
  fjs.parentNode.insertBefore(js, fjs)
})(document, 'script', 'facebook-jssdk')
