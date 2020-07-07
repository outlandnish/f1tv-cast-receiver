const context = cast.framework.CastReceiverContext.getInstance();
const playerManager = context.getPlayerManager();
const castOptions = new cast.framework.CastReceiverOptions();
let isLive = false
let playbackConfig = (Object.assign(new cast.framework.PlaybackConfig(), playerManager.getPlaybackConfig()));

playerManager.setMessageInterceptor(
  cast.framework.messages.MessageType.LOAD,
  request => {
    request.media.hlsSegmentFormat = cast.framework.messages.HlsSegmentFormat.TS
    isLive = request.media.streamType === cast.framework.messages.StreamType.LIVE

    // disable seeking for now on live videos (need to test if seeking is supported)
    if (isLive)
      playerManager.removeSupportedMediaCommands(cast.framework.messages.Command.SEEK, true)

    setCookies(request.media.customData)

    return request;
  }
);

playerManager.setMessageInterceptor(
  cast.framework.messages.MessageType.SEEK,
  seekData => {
      // if the SEEK supported media command is disabled, block seeking
      if (isLive && !(playerManager.getSupportedMediaCommands() & cast.framework.messages.Command.SEEK)) {
          return null;
      }

      return seekData;
})
  
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
    document.cookie = part
  }
}