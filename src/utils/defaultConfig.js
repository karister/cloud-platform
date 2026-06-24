export const DEFAULT_CONFIG = {
  appName: '云平台数据通信',
  themeId: 'amber',
  cloud: {
    productId: '85zH3LlDLF',
    deviceName: 'device',
    accessKey: '',
    signMethod: 'md5',
    tokenTtlDays: 365,
    // 验证通过后保存的 token 与过期时间；未验证时为空对象由 storage 层补默认
    token: '',
    tokenExpiresAt: 0,
    // TODO: 临时调试字段 — token 算法修好后删除
    manualToken: '',
    getUrl:
      'https://iot-api.heclouds.com/thingmodel/query-device-property?product_id=85zH3LlDLF&device_name=device',
    postUrl: 'https://iot-api.heclouds.com/thingmodel/set-device-desired-property',
    // 全局轮询间隔（秒）。dataStore.start() 读这个值；非法值时回退到 3
    pollIntervalSeconds: 3,
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
    unit: '',
    alarmThresholdId: ''
  }
}
