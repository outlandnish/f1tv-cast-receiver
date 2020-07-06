const context = cast.framework.CastReceiverContext.getInstance();
const playerManager = context.getPlayerManager();
const castOptions = new cast.framework.CastReceiverOptions();
let playbackConfig = (Object.assign(new cast.framework.PlaybackConfig(), playerManager.getPlaybackConfig()));

playerManager.setMessageInterceptor(
  cast.framework.messages.MessageType.LOAD,
  request => {
    console.log('loaded', request)

    request.media.hlsSegmentFormat = cast.framework.messages.HlsSegmentFormat.TS
    setCookies(request.media.customData)

    return request;
  });
  
playbackConfig.manifestRequestHandler = requestInfo => {
  requestInfo.withCredentials = true
  requestInfo.header = { 
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'cross-site',
    'x-countrycode': 'zero'
  }
  console.log('manifest request', requestInfo)
}

playbackConfig.segmentRequestHandler = requestInfo => {
  requestInfo.withCredentials = true
  requestInfo.header = { 
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'cross-site',
    'x-countrycode': 'zero'
  }
  console.log('segment request', requestInfo)
}

playbackConfig.licenseRequestHandler = requestInfo => {
  requestInfo.withCredentials = true;
  requestInfo.header = { 
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'cross-site',
    'x-countrycode': 'zero'
  }
  console.log('license request', requestInfo)
}

castOptions.playbackConfig = playbackConfig;
context.start(castOptions)

function setCookies(cookie) {
  let cookies = cookie.split(';')
  for (let part of cookies) {
    console.log('setting cookie', part)
    document.cookie = part
  }
}