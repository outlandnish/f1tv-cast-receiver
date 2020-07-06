const context = cast.framework.CastReceiverContext.getInstance();
const playerManager = context.getPlayerManager();
const castOptions = new cast.framework.CastReceiverOptions();

let playbackConfig = (Object.assign(new cast.framework.PlaybackConfig(), playerManager.getPlaybackConfig()));

let cookie = null

playerManager.setMessageInterceptor(
  cast.framework.messages.MessageType.LOAD,
  request => {
    cookie = request.customData
    document.cookie = cookie
    // const tokenQueryString = cookie.substring(cookie.indexOf('lvlt_tk_q='), )
    request.url += 
    return request;
  });
  
  playbackConfig.manifestRequestHandler = requestInfo => {
    requestInfo.withCredentials = true;
    // requestInfo.headers = { Cookie: cookie }
    requestInfo.header = { 
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-site'
    }
    console.log('manifest request', requestInfo)
  };
  
  playbackConfig.segmentRequestHandler = requestInfo => {
    requestInfo.withCredentials = true;
    // requestInfo.headers = { Cookie: cookie }
    requestInfo.header = { 
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-site'
    }
    console.log('segment request', requestInfo)
  };
  
  playbackConfig.licenseRequestHandler = requestInfo => {
    requestInfo.withCredentials = true;
    // requestInfo.headers = { Cookie: cookie }
    requestInfo.header = { 
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-site'
    }
    console.log('license request', requestInfo)
  };
  
  castOptions.playbackConfig = playbackConfig;
  context.start(castOptions);