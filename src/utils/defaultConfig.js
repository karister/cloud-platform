export const DEFAULT_CONFIG = {
  appName: '云平台数据通信',
  themeId: 'teal',
  cloud: {
    productId: '85zH3LlDLF',
    deviceName: 'device',
    getUrl:
      'https://iot-api.heclouds.com/thingmodel/query-device-property?product_id=85zH3LlDLF&device_name=device',
    postUrl: 'https://iot-api.heclouds.com/thingmodel/set-device-desired-property',
    authorization:
      'version=2018-10-31&res=products%2F85zH3LlDLF%2Fdevices%2Fdevice&et=1993491199&method=md5&sign=u4vFu18O1Pc6BhNnosz%2BJQ%3D%3D',
    mockMode: true
  },
  displayPoints: [
    { label: '温度', identifier: 'temp', unit: 'C' },
    { label: '湿度', identifier: 'humi', unit: '%' }
  ],
  switchPoints: [{ label: '设备开关', identifier: 'switch', unit: '' }],
  thresholdPoints: [
    {
      label: '温度阈值',
      identifier: 'temp_threshold',
      unit: 'C',
      min: 0,
      max: 100,
      step: 1,
      value: 35
    }
  ],
  recommendedPoints: {
    display: [
      { label: '温度', identifier: 'temp', unit: 'C' },
      { label: '湿度', identifier: 'humi', unit: '%' },
      { label: '光照', identifier: 'light', unit: 'lx' },
      { label: '二氧化碳', identifier: 'co2', unit: 'ppm' },
      { label: '土壤湿度', identifier: 'soil_humi', unit: '%' },
      { label: '电池电量', identifier: 'battery', unit: '%' }
    ],
    switch: [
      { label: '设备开关', identifier: 'switch', unit: '' },
      { label: '风机开关', identifier: 'fan', unit: '' },
      { label: '水泵开关', identifier: 'pump', unit: '' },
      { label: '补光灯', identifier: 'light_switch', unit: '' }
    ],
    threshold: [
      { label: '温度阈值', identifier: 'temp_threshold', unit: 'C', min: 0, max: 100, step: 1, value: 35 },
      { label: '湿度阈值', identifier: 'humi_threshold', unit: '%', min: 0, max: 100, step: 1, value: 70 },
      { label: '光照阈值', identifier: 'light_threshold', unit: 'lx', min: 0, max: 2000, step: 10, value: 800 }
    ]
  }
}

export const HISTORY_LIMIT = 80

export function buildGetUrl(cloud) {
  const productId = encodeURIComponent(cloud.productId || '')
  const deviceName = encodeURIComponent(cloud.deviceName || '')
  return `https://iot-api.heclouds.com/thingmodel/query-device-property?product_id=${productId}&device_name=${deviceName}`
}

export function createPoint(kind = 'display') {
  if (kind === 'threshold') {
    return {
      label: '',
      identifier: '',
      unit: '',
      min: 0,
      max: 100,
      step: 1,
      value: 50
    }
  }

  return {
    label: '',
    identifier: '',
    unit: ''
  }
}
