<template>
  <q-view layout="vbox">
    <q-view layout="hbox">
      <q-label :text="title" id="label"></q-label>
      <q-view horizontal-size-policy='Expanding'></q-view>
      <q-view layout="hbox">
        <q-view horizontal-size-policy='Expanding'></q-view>
        <q-button id="btn" text="新增" icon='@icon.folder@unicloud_add.png' @clicked="create"></q-button>
        <q-button id="btn" text="刷新" icon='@icon.folder@unicloud_refresh.png' @clicked="refresh"></q-button>
      </q-view>
    </q-view>
    <q-list-view id="list" @currentRowChanged="currentRowChanged">
      <q-list-item layout="hbox" v-for="space in spaces">
        <q-view layout="hbox">
          <q-radio id='checkBox' :enabled='false' :checked='space.selected'></q-radio>
        </q-view>
        <q-label :text="space.spaceName" id="list__label" :style="{color: space.selected ? '#4EAB57': '#405E42'}"></q-label>
        <q-view horizontal-size-policy='Expanding'></q-view>
        <q-label :text="space.openedHosting ? '已开通前端网页托管': '未开通前端网页托管'" id="list__label" :style="{color: space.selected ? '#4EAB57': '#405E42'}"></q-label>
        <q-view layout="hbox" style="min-width: 50px">
          <q-label v-if="!space.openedHosting" :openExternalLinks="true" style="text-align: right;" :text="`<a style='color:#54AE6C; font-size: 12px;' href='https://unicloud.dcloud.net.cn/pages/web-host/web-host?pageid=${space.spaceId}'>去开通</a>`" id="label--secondary"></q-label>
        </q-view>
        <q-view layout="hbox" style="min-width: 100px">
          <q-label :text="space.spaceProvider" id="list__label" :style="{color: space.selected ? '#4EAB57': '#405E42'}"></q-label>
        </q-view>
      </q-list-item>
    </q-list-view>
  </q-view>
</template>

<script>
const hx = require('hbuilderx')
const providerMap = {
  tcb: '腾讯云',
  aliyun: '阿里云',
  alipay: '支付宝云'
}

export default {
  emits: ['onSelect', 'onLoadingChange'],
  props: {
    title: {
      type: String,
      default () {
        return "云服务空间列表"
      }
    }
  },
  data () {
    return {
      isLoading: false,
      spaces: [],
      projectId: '',
      selectedSpaceId: '',
    }
  },
  watch: {
    spaces: {
      handler (val) {
        this.$emit('onSelect', val.filter(item => item.selected))
      },
      deep: true
    },
    isLoading: {
      handler (val) {
        this.$emit('onLoadingChange', val)
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getSpaceServices()
    })
  },
  methods: {
    async create () {
      await hx.env.openExternal('https://unicloud.dcloud.net.cn/')
    },
    async refresh () {
      if (this.isLoading) return

      this.spaces = []
      await this.updateUi()

      this.$nextTick(() => {
        this.getSpaceServices()
      })
    },
    async getSpaceServices () {
      this.isLoading = true
      await this.updateUi()

      const res = await hx.http.request({
        url: 'https://ide.liuyingyong.cn/serverless/space/list-all',
        method: 'post',
        connectionTimeout: 10000,
        readTimeout: 30000,
        serviceOptions: {
          serviceRequest: true,
          body: {
            provider: '',
            appid: this.appid
          }
        }
      })

      if (res.service && res.service.code === 1001 && res.service.body.spaces) {
        this.spaces = res.service.body.spaces.filter(item => item.status.toLowerCase() === 'normal').map(item => {
          return {
            spaceId: item.id,
            spaceName: item.name,
            spaceProvider: providerMap[item.provider] + (item.isActor ? '(协作)': ''),
            openedHosting: item.haveHostingService,
            selected: item.id == this.selectedSpaceId,
            provider: item.provider
          }
        })
      }

      this.isLoading = false
      this.updateUi()
    },
    currentRowChanged (e) {
      const {currentRow} = e.target

      // 单选
      this.spaces.forEach((item, index) => {
        if (index !== currentRow) {
          item.selected = false
        }
      })

      this.spaces[currentRow].selected = !this.spaces[currentRow].selected
      this.updateUi()
    },
  }
}
</script>

<style lang="qss">
*{
	font-size: 12px;
}
#btn {
  border: none;
  color: #4EAB57;
}
#label {
  color: #405E42;
}
#label--secondary {
  color: #cccccc;
}
#list {
  background: #FFFEFA;
  border: 1px solid darkgray;
}
#list::item {
  padding: 5px 20px;
}
#list::item:selected, #list::item:hover {
  background-color: transparent;
}


#checkBox::indicator::unchecked {
  image: url("");
}

#checkBox::indicator::checked {
  image: url("@icon.folder@ProjectWizard/template_select.png");
}
</style>