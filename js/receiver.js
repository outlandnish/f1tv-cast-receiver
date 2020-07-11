const context = cast.framework.CastReceiverContext.getInstance()
const playerManager = context.getPlayerManager()
const castOptions = new cast.framework.CastReceiverOptions()

const playerData = new cast.framework.ui.PlayerData()
const playerDataBinder = new cast.framework.ui.PlayerDataBinder(playerData)

let isLive = false
let playbackConfig = (Object.assign(new cast.framework.PlaybackConfig(), playerManager.getPlaybackConfig()))

playerManager.setMessageInterceptor(
  cast.framework.messages.MessageType.LOAD,
  request => {
    request.media.hlsSegmentFormat = cast.framework.messages.HlsSegmentFormat.TS
    isLive = request.media.streamType === cast.framework.messages.StreamType.LIVE

    // sets auth cookies that need to be sent with each segment request
    setCookies(request.media.customData)

    return request;
  }
);
  
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

const touchControls = cast.framework.ui.Controls.getInstance()

playerDataBinder.addEventListener(
  cast.framework.ui.PlayerDataEventType.MEDIA_CHANGED,
  (e) => {
    if (!e.value) return;

    // clear default buttons and re-assign
    touchControls.clearDefaultSlotAssignments()

    touchControls.assignButton(
      cast.framework.ui.ControlsSlot.SLOT_SECONDARY_1,
      cast.framework.ui.ControlsButton.CAPTIONS
    )

    touchControls.assignButton(
      cast.framework.ui.ControlsSlot.SLOT_SECONADRY_2,
      cast.framework.ui.ControlsButton.NONE
    )

    touchControls.assignButton(
      cast.framework.ui.ControlsSlot.SLOT_PRIMARY_1,
      cast.framework.ui.ControlsButton.SEEK_BACKWARD_30
    )

    touchControls.assignButton(
      cast.framework.ui.ControlsSlot.SLOT_PRIMARY_2,
      cast.framework.ui.ControlsButton.SEEK_FORWARD_30
    )
  }
)

castOptions.supportedCommands = cast.framework.messages.Command.ALL_BASIC_MEDIA
context.start(castOptions)

function setCookies(cookie) {
  let cookies = cookie.split(';')
  for (let part of cookies) {
    document.cookie = part
  }
}