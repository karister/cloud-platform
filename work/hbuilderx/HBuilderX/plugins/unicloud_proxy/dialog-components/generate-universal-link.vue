<template>
  <q-view layout="hbox" id="wrap" layout-spacing="0" v-if="!isLoading">
    <q-view layout="vbox" id="steps" layout-spacing="0">
      <q-view layout="hbox" id="steps__item" :layout-spacing="0" v-for="(step, index) in steps">
        <q-view layout="vbox" :layout-spacing="0" id="steps__item-no">
          <q-view layout="hbox">
            <q-view id="steps__item-no-line--selected" v-if="currentStep === index"></q-view>
            <q-view id="steps__item-no-line--normal" v-else></q-view>
          </q-view>
          <q-label :text="index + 1" alignment='AlignCenter' id="steps__item-no-number--selected"
                   v-if="currentStep === index"></q-label>
          <q-label :text="index + 1" alignment='AlignCenter' id="steps__item-no-number--normal"
                   v-else></q-label>
          <q-view layout="hbox">
            <q-view id="steps__item-no-line--selected" v-if="currentStep === index"></q-view>
            <q-view id="steps__item-no-line--normal" v-else></q-view>
          </q-view>
        </q-view>
        <q-view layout="vbox">
          <q-label :text="step.title" id="steps__item-title"></q-label>
        </q-view>
      </q-view>
    </q-view>
    <q-view layout="vbox" id="steps-body" :layout-spacing="0">
      <q-view layout="vbox" id="step-body__item-0" v-if="currentStep === 0">
        <q-view vertical-size-policy="Expanding"></q-view>
        <q-view layout="vbox" v-if="!isLogin">
          <q-view layout="vbox">
            <q-label :text="`项目[${workspaceFolder.name}]使用了uniCloud，需要进行uniCloud初始化操作。`"
                     id="text-primary-color" alignment='AlignCenter'></q-label>
            <q-label text="检测到您还未登录，请先登录" id="text-primary-color" alignment='AlignCenter'></q-label>
            <q-view layout="hbox">
              <q-button text="登录" @clicked="showLogin" style="min-width: 100px; max-width: 100px;"
                        id="HXButton"></q-button>
            </q-view>
          </q-view>
        </q-view>
        <q-view layout="vbox" v-else-if="!isRealName">
          <q-view layout="vbox">
            <q-label :text="`项目[${workspaceFolder.name}]使用了uniCloud服务，根据国家法律要求，使用云服务需要实名认证`"
                     id="text-primary-color"></q-label>
            <q-view layout="hbox" :layout-spacing="0">
              <q-label text="请先完成" id="text-primary-color"></q-label>
              <q-button text="实名认证" id="text-selected-color"
                        style="border: 0; text-decoration: underline;"
                        @clicked="redirectRealNamePageUrl"></q-button>
              <q-label text="或者使用临时服务空间。" id="text-primary-color"></q-label>
              <q-view horizontal-size-policy="Expanding"></q-view>
            </q-view>
            <q-radio-group layout="vbox">
              <q-radio id='RadioButton' text="已完成实名认证" :checked="isRealNameFinish" :data-value="true"
                       @toggled="readNameRadioGroupChanged"></q-radio>
              <q-radio id='RadioButton' text="先不认证,临时体验" :checked="!isRealNameFinish"
                       v-if="provider === 'aliyun'" :data-value="false"
                       @toggled="readNameRadioGroupChanged"></q-radio>
            </q-radio-group>
            <q-label v-if="provider === 'aliyun'" text="临时服务空间创建后4小时自动销毁，如在临时服务空间销毁之前完成"
                     id="text-second-color"></q-label>
            <q-label v-if="provider === 'aliyun'" text="实名认证，则该服务空间会继续保留。" id="text-second-color"></q-label>
          </q-view>
        </q-view>
        <q-view vertical-size-policy="Expanding"></q-view>
      </q-view>
      <q-view layout="vbox" id="step-body__item-1" v-if="currentStep === 1">
<!--        <q-view vertical-size-policy="Expanding"></q-view>-->
        <q-view layout="hbox">
          <q-label text="选择服务空间" id="text-primary-color"></q-label>
          <q-view horizontal-size-policy='Expanding'></q-view>
          <q-view layout="hbox">
            <q-view horizontal-size-policy='Expanding'></q-view>
            <q-button id="btn" text="新增" icon='@icon.folder@unicloud_add.png'
                      @clicked="redirectUniCloudConsole"></q-button>
            <q-button id="btn" text="刷新" icon='@icon.folder@unicloud_refresh.png'
                      @clicked="refresh"></q-button>
          </q-view>
        </q-view>
        <q-list-view id="list" currentIndex="-1" @currentRowChanged="currentRowChanged">
          <q-list-item layout="hbox" v-for="space in spaces">
            <q-view layout="hbox">
              <q-radio id='checkBox' :enabled='false' :checked='space.selected'></q-radio>
            </q-view>
            <q-label :text="space.spaceName" id="list__label" :toolTip="space.spaceName"
                     :style="{color: space.selected ? '#4EAB57': '#405E42'}"></q-label>
            <q-view horizontal-size-policy='Expanding'></q-view>
            <q-view layout="hbox" style="min-width: 100px">
              <q-label :text="space.spaceProvider" id="list__label"
                       :style="{color: space.selected ? '#4EAB57': '#405E42'}"></q-label>
            </q-view>
          </q-list-item>
        </q-list-view>
      </q-view>
      <q-view layout="vbox" id="step-body__item-2" v-if="currentStep === 2">
        <q-view vertical-size-policy="Expanding"></q-view>
        <q-radio-group layout="vbox">
          <q-view layout="hbox">
            <q-radio id="HXRadioButton" text="默认域名(建议用于测试)" style="min-width: 300px" data-type="default"
                     :checked="domainType === 'default'" @toggled="onDomainTypeChanged" :enabled="domains['default']"></q-radio>
            <q-view horizontal-size-policy="Expanding"></q-view>
          </q-view>
          <q-view layout="hbox">
            <q-radio id="HXRadioButton" text="自定义域名" data-type="custom"
                     :checked="domainType === 'custom'" @toggled="onDomainTypeChanged" :enabled="domains['custom']"></q-radio>
            <q-button text="去配置" id="text-selected-color" style="border: 0"
                      @clicked="redirectWebHostUrl"></q-button>
            <q-view horizontal-size-policy="Expanding"></q-view>
          </q-view>
        </q-radio-group>

        <q-view layout="hbox" v-if="domain" style="margin-top: 20px;">
          <q-view layout="vbox">
            <q-label :text="domain" id="domain-text"></q-label>
          </q-view>
        </q-view>
        <!--        <q-label text="包含db_init.json配置的数据项及数据项同名的DB Schema" id="text-second-color"></q-label>-->
        <!--        <q-label text="database下的扩展校验函数" id="text-second-color"></q-label>-->
        <q-view vertical-size-policy="Expanding"></q-view>
      </q-view>
      <q-view layout="hbox" id="steps-body__footer">
        <q-label :openExternalLinks="true"
                 text="<a href='https://uniapp.dcloud.io/api/plugins/universal-links' style='color: #4EAB57'>通用连接生成指南?</a>"
                 id="text-selected-color"></q-label>
        <q-view horizontal-size-policy="Expanding"></q-view>
        <q-button id="HXButton"
                  :text="currentStep === 0 || (currentStep === 1 && this.userInfoOk) ? '取消(&C)': '上一步(&P)'"
                  @clicked="prev"></q-button>
        <q-button id="HXButton" :text="processButtonText" v-if="showProcessButton"></q-button>
        <q-button id="HXButton" :text="currentStep < (steps.length - 1) ? '下一步(&N)': '完成(&O)'" @clicked="next"
                  v-else></q-button>
      </q-view>
    </q-view>
  </q-view>
</template>

<script>
const hx = require('hbuilderx')
const url = require('url')

const providerMap = {
  tcb: '腾讯云',
  aliyun: '阿里云',
  alipay: '支付宝云'
}

export default {
  data() {
    return {
      appid: '',
      currentStep: 0,
      currentSpaceId: null,
      isLoading: true,
      isLogin: false,
      isRealName: false,
      isRealNameFinish: true,
      processButtonText: "",
      showProcessButton: false,
      steps: [{
        title: '检查用户信息',
        fullTitle: '检查用户信息'
      }, {
        title: '选择服务空间',
        fullTitle: '选择需要生成通用链接的云服务空间'
      }, {
        title: '配置域名',
        fullTitle: `配置域名`
      }],
      spaces: [],
      provider: '',
      workspaceFolder: {},
      domains: {},
      domainType: 'default'
    }
  },
  computed: {
    userInfoOk() {
      return this.isLogin && this.isRealName
    },
    domain () {
      return this.domains[this.domainType] || ''
    }
  },
  watch: {
    currentStep(newValue) {
      if (newValue === 1 && this.spaces.length <= 0) {
        this.$nextTick(() => {
          this.getSpaceServices()
        })
      }

      // 更新 form dialog title
      this.$formDialog.updateForm({
        title: this.buildTitle(this.steps[newValue].fullTitle)
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.startFlowCtrl()
    })
  },
  methods: {
    async startFlowCtrl() {
      this.$formDialog.showLoading({
        maskAt: 'generateUniversalLink'
      })

      // 检查用户信息
      await this.checkUserStatus()
      if (this.userInfoOk) {
        this.currentStep = 1
      }
      this.isLoading = false

      await this.updateUi()
      this.$formDialog.hideLoading()
    },
    readNameRadioGroupChanged(e) {
      const {
        'data-value': value
      } = e.target
      this.isRealNameFinish = value
    },
    async onDomainTypeChanged(e) {
      const {
        'data-type': type
      } = e.target

      this.domainType = type || ''

      await this.updateUi()
    },
    async checkUserStatus() {
      const {
        isLogin
      } = await hx.authorize.requestUserInfo()

      this.isLogin = isLogin

      await this.updateUi()

      if (!isLogin) return

      const userInfo = await this.getUserInfo()

      if (userInfo && userInfo.authenticated) {
        this.isRealName = true
        await this.updateUi()
      }
    },
    async getUserInfo() {
      const {
        email
      } = await hx.authorize.requestUserInfo()

      const res = await hx.http.request({
        url: `https://ide.liuyingyong.cn/user/info`,
        method: 'get',
        connectionTimeout: 10000,
        readTimeout: 30000,
        params: {
          param: JSON.stringify({
            header: {
              token: '${user.checked.token}'
            },
            body: {
              email
            }
          })
        }
      })

      let response
      try {
        response = JSON.parse(res.data)
      } catch (e) {}
      const code = response && response.header && response.header.result && response.header.result.rspcode
      const data = response && response.body || {}

      if (code === '1001') {
        return data
      }
    },
    async showLogin() {
      hx.authorize.onUserLogin(() => {
        this.$formDialog.hideLoading()

        if (this.isLogin) return

        this.isLogin = true
        this.updateUi()
        this.startFlowCtrl()
      })

      const loginContinue = await hx.http.checkLogin({
        forceLogin: true
      })

      if (loginContinue) {
        this.$nextTick(() => {
          this.$formDialog.showLoading({
            maskAt: 'generateUniversalLink'
          })
        })
      }
    },
    async getSpaceServices() {
      this.$formDialog.showLoading({
        maskAt: 'generateUniversalLink'
      })

      const res = await hx.http.request({
        url: 'https://ide.liuyingyong.cn/serverless/space/list',
        method: 'post',
        connectionTimeout: 10000,
        readTimeout: 30000,
        serviceOptions: {
          serviceRequest: true,
          body: {
            provider: this.provider,
            appid: this.appid
          }
        }
      })

      if (res.service && res.service.code === 1001 && res.service.body.spaces) {
        this.spaces = res.service.body.spaces.filter(item => item.status.toLowerCase() === 'normal').map(
          item => {
            return {
              spaceId: item.id,
              spaceName: item.name,
              spaceProvider: providerMap[item.provider] + (item.isActor ? '(协作)' : ''),
              openedHosting: item.haveHostingService,
              selected: item.id === this.currentSpaceId,
              provider: item.provider,
              clientSecret: item.clientSecret,
              apiEndpoint: item.apiEndpoint,
              isOwner: item.isOwner,
              isActor: item.isActor
            }
          })
      }

      this.$formDialog.hideLoading()
      this.updateUi()
    },
    async redirectUniCloudConsole() {
      const redirectURL = url.format({
        protocol: 'https',
        hostname: 'dev.dcloud.net.cn',
        pathname: '/auth/dcloud/callback',
        search: new url.URLSearchParams({
          return_url: encodeURIComponent(
            'https://dev.dcloud.net.cn/unicloud/auth?action=openConsole')
        }).toString()
      })

      await hx.env.openExternal(
        url.format({
          protocol: 'https',
          hostname: 'account.dcloud.net.cn',
          pathname: '/oauth2/login',
          search: 'email=${email}&deviceId=${deviceId}&sign=${askSign}&timestamp=${timestamp}&source=hbuilder.win32&client_id=DCLOUD_DEV' +
            `&sourceversion=${hx.env.appVersion}&redirectURL=${encodeURIComponent(redirectURL)}`,
        })
      )
    },
    async redirectRealNamePageUrl() {
      const redirectURL = url.format({
        protocol: 'https',
        hostname: 'dev.dcloud.net.cn',
        pathname: '/auth/dcloud/callback',
        search: new url.URLSearchParams({
          return_url: encodeURIComponent("https://dev.dcloud.net.cn/user/reg")
        }).toString()
      })

      await hx.env.openExternal(
        url.format({
          protocol: 'https',
          hostname: 'account.dcloud.net.cn',
          pathname: '/oauth2/login',
          search: 'email=${email}&deviceId=${deviceId}&sign=${askSign}&timestamp=${timestamp}&source=hbuilder.win32&client_id=DCLOUD_DEV' +
            `&sourceversion=${hx.env.appVersion}&redirectURL=${encodeURIComponent(redirectURL)}`,
        })
      )
    },
    async redirectWebHostUrl() {
      const space = this.spaces.find(item => item.selected)

      const redirectURL = url.format({
        protocol: 'https',
        hostname: 'dev.dcloud.net.cn',
        pathname: '/auth/dcloud/callback',
        search: new url.URLSearchParams({
          return_url: encodeURIComponent(
            `https://dev.dcloud.net.cn/unicloud/auth?action=hosting&spaceId=${space.spaceId}&provider=${space.provider}&spaceName=${space.spaceName}`
          )
        }).toString()
      })

      await hx.env.openExternal(
        url.format({
          protocol: 'https',
          hostname: 'account.dcloud.net.cn',
          pathname: '/oauth2/login',
          search: 'email=${email}&deviceId=${deviceId}&sign=${askSign}&timestamp=${timestamp}&source=hbuilder.win32&client_id=DCLOUD_DEV' +
            `&sourceversion=${hx.env.appVersion}&redirectURL=${encodeURIComponent(redirectURL)}`,
        })
      )
    },
    async refresh() {
      if (this.spaceLoading) return

      this.spaces = []
      await this.updateUi()

      this.$nextTick(() => {
        this.getSpaceServices()
      })
    },
    currentRowChanged(e) {
      const {
        currentRow
      } = e.target

      // 单选
      this.spaces.forEach((item, index) => {
        item.selected = false
      })

      this.spaces[currentRow].selected = !this.spaces[currentRow].selected
      this.updateUi()
    },
    async prev() {
      if (this.currentStep === 0 || (this.currentStep === 1 && this.userInfoOk)) {
        return this.$formDialog.close && this.$formDialog.close()
      }

      await this.stepCtrl(-1)
    },
    async next() {
      if (!this.isLogin) return false
      if (this.currentStep === this.steps.length - 1) {

        this.$mitt.emit('finish', {
          space: this.spaces.find(item => item.selected),
          domain: this.domain
        })

        this.$formDialog.close && this.$formDialog.close()

        return
      }

      if (this.currentStep === 0) {
        if (this.isRealNameFinish) {
          this.processButtonText = "请稍后..."
          this.showProcessButton = true
          await this.updateUi()

          const userInfo = await this.getUserInfo()
          this.showProcessButton = false
          await this.updateUi()

          if (userInfo && !userInfo.authenticated) {
            return hx.window.showMessageBox({
              type: 'warning',
              title: '',
              text: '请先完成实名认证后在进行下一步',
              buttons: ['确定']
            })
          }

          this.isRealName = userInfo && userInfo.authenticated
          await this.updateUi()
        } else {
          this.processButtonText = "创建中..."
          this.showProcessButton = true
          await this.updateUi()

          const createSuccess = await this.createTempSpace()
          this.showProcessButton = false
          await this.updateUi()

          if (createSuccess && !createSuccess.success) return
        }

        this.currentStep = 1
        this.updateUi()

        return
      }

      if (this.currentStep === 1) {
        const selectedSpace = this.spaces.find(item => item.selected)
        if (!selectedSpace) {
          return await hx.window.showMessageBox({
            type: 'warning',
            title: '',
            text: '请选择一个服务空间',
            buttons: ['确定']
          })
        }
        this.domainType = 'default'
        this.getSpaceBindDomain()
      }

      await this.stepCtrl(1)
    },
    async createTempSpace() {
      if (this.provider !== 'aliyun') {
        return hx.window.showMessageBox({
          type: 'warning',
          title: '',
          text: '仅阿里云支持创建临时服务空间',
          buttons: ['确定']
        })
      }

      const trialInfoRes = await hx.http.request({
        url: 'https://ide.liuyingyong.cn/serverless/space/create-trial',
        method: 'post',
        connectionTimeout: 10000,
        readTimeout: 30000,
        serviceOptions: {
          serviceRequest: true
        }
      })

      if (trialInfoRes.service && trialInfoRes.service.code !== 1001) {
        return hx.window.showMessageBox({
          type: 'warning',
          title: '',
          text: trialInfoRes.service.description || '创建临时服务空间失败',
          buttons: ['确定']
        })
      }

      if (trialInfoRes.service.body && trialInfoRes.service.body.trialInfo) {
        const {
          isCanTrial,
          isAlreadyTrial,
          trialSpace
        } = trialInfoRes.service.body.trialInfo

        if (!isCanTrial) {
          return hx.window.showMessageBox({
            type: 'warning',
            title: '',
            text: '您暂时不可以创建临时空间',
            buttons: ['确定']
          })
        }

        if (isAlreadyTrial && trialSpace.expireTs < (Date.now() / 1000)) {
          return hx.window.showMessageBox({
            type: 'warning',
            title: '',
            text: `您创建的临时空间已过期，不可以继续创建！`,
            buttons: ['确定']
          })
        }
      }

      const res = await hx.http.request({
        url: 'https://ide.liuyingyong.cn/serverless/space/create-trial',
        method: 'post',
        connectionTimeout: 10000,
        readTimeout: 30000,
        serviceOptions: {
          serviceRequest: true
        }
      })

      if (res.service && res.service.code !== 1001) {
        return hx.window.showMessageBox({
          type: 'warning',
          title: '',
          text: res.service.description || '创建临时服务空间失败',
          buttons: ['确定']
        })
      }

      hx.window.showMessageBox({
        type: 'warning',
        title: '',
        text: '临时服务空间正在创建中, 预计3-5分钟后创建完成，您可以在uniCloud控制台查看创建进度。',
        buttons: ['确定']
      })

      return {
        success: true
      }
    },
    async getSpaceBindDomain() {
      const space = this.spaces.find(item => item.selected)

      if (!space) return

      this.$formDialog.showLoading({
        maskAt: 'generateUniversalLink'
      })

      let res
      try {
        res = await hx.http.request({
          url: 'https://ide.liuyingyong.cn/serverless/host/domains',
          method: 'post',
          connectionTimeout: 10000,
          readTimeout: 30000,
          serviceOptions: {
            serviceRequest: true,
            body: {
              provider: this.provider,
              spaceId: space.spaceId,
              appid: this.workspaceFolder.appid
            }
          }
        })
      } finally {
        this.$formDialog.hideLoading()
      }

      if (res.service && res.service.code !== 1001) {
        return hx.window.showMessageBox({
          type: 'warning',
          title: '',
          text: res.service.description || '获取服务空间域名失败',
          buttons: ['确定']
        })
      }

      const {customDomains, defaultDomains} = res.service.body

      this.domains = {
        default: (defaultDomains[0] && defaultDomains[0].domain) || '',
        custom: (customDomains[0] && customDomains[0].domain) || ''
      }
      this.domain = this.domains.default || ''

      await this.updateUi()
    },
    async stepCtrl(step) {
      const newStep = this.currentStep + step
      if (newStep >= 0 && newStep < this.steps.length) {
        this.currentStep = newStep
        await this.updateUi()
      }
    },
    buildTitle(title) {
      const space = this.spaces.find(space => space.selected)
      const params = {
        projectName: this.workspaceFolder.name,
        spaceName: space && space.spaceName
      }

      return title.replace(/\{(\w+)\}/g, (match, key) => {
        return params[key] || match
      })
    }
  }
}
</script>

<style scoped lang="qss">
* {
  font-size: 12px;
}

#btn {
  border: none;
  color: #4EAB57;
}

#text-primary-color {
  color: #405E42;
}

#text-selected-color {
  color: #4EAB57;
}

#text-second-color {
  color: #ccc;
}

#steps {
  min-width: 125px;
  max-width: 125px;
}

#steps__item {
  padding-left: 10px;
}

#steps__item-no {
  min-width: 16px;
  max-width: 16px;
}

#steps__item-no-line--normal {
  min-width: 2px;
  max-width: 2px;
  background-color: #bde7bd;
}

#steps__item-no-line--selected {
  min-width: 2px;
  max-width: 2px;
  background-color: #4EAB57;
}

#steps__item-no-number--normal {
  max-width: 16px;
  min-width: 16px;
  min-height: 16px;
  max-height: 16px;
  border-radius: 8px;
  background-color: #bde7bd;
  color: #fff;
}

#steps__item-no-number--selected {
  max-width: 16px;
  min-width: 16px;
  min-height: 16px;
  max-height: 16px;
  border-radius: 8px;
  background-color: #4EAB57;
  color: #fff;
}

#steps__item-title {
  margin-left: 5px;
  color: #4EAB57;
}

#steps-body {
  /* background-color: red; */
}

#steps-body__footer {
  margin-top: 10px;
}


#list {
  background: #FFFEFA;
  border: 1px solid darkgray;
}

#list::item {
  padding: 5px 20px;
}

#list::item:selected,
#list::item:hover {
  background-color: transparent;
}

#list::item #list__label {
  font-size: 14px;
}

#checkBox::indicator::unchecked {
  image: url("");
}

#checkBox::indicator::checked {
  image: url("@icon.folder@ProjectWizard/template_select.png");
}

#domain-text {
  font-size: 12px;
  border-radius: 4px;
  border: 1px solid #009944;
  padding: 5px;
}
#HXButton {
  border: 1px solid #009944;
  background: #FAFFFA;
  color: #54AE6C;
  padding: 6px 28px;
  font-size: 12px;
}

#HXButton:hover {
  background: #EDFDED;
  border-color: #009944;
}

#HXButton:pressed {
  background: #E1F0E1;
  border-color: #0D9E4D;
}

#HXButton[visualType="accept"] {
  border: 1px solid #009944;
  background: #3AAD4F;
  color: #FFFEFA;
}

#HXButton[visualType="accept"]:hover {
  background: #85CE93;
}

#HXButton[visualType="accept"]:pressed {
  background: #229337;
}

#HXButton[visualType="error"] {
  border: 1px solid #DE3F3F;
  background: #FFF9F9;
  color: #D14544;
}

#HXButton[visualType="error"]:hover {
  background: #FEEEEE;
}

#HXButton[visualType="error"]:pressed {
  background: #EECFCF;
}

#HXButton:disabled {
  border: 1px solid #DCDCDC;
  background: #F3F3F3;
  color: #B1B1B1;
}

#HXButton HXLoadingWidget:disabled {
  color: #B1B1B1;
}

#HXRadioButton {
  max-width: 100px;
}

#HXRadioButton::indicator::unchecked {
  image: url(:/hxui/resource/rdbt.png);
}

#HXRadioButton::indicator::unchecked:hover {
  image: url(:/hxui/resource/rdbt-hover.png);
}

#HXRadioButton::indicator::checked {
  image: url(:/hxui/resource/rdbt-checked.png);
}
</style>
