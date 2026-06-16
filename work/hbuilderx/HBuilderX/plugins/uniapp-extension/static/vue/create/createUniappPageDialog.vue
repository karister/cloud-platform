<template>
    <q-view id="ViewRoot" layout="vbox" horizontal-size-policy="Ignored" vertical-size-policy="Ignored">
        <!-- 输入名称 -->
        <q-view id="ViewBottomLine" layout="hbox" layout-spacing="0">
            <!-- 页面名称输入框 -->
            <q-input id="HXInput" :ref="pageNameRef" :focus="true" horizontal-size-policy="Expanding"
                :enabled="checkedTemplate.type != 'uni_modules'" :placeholderText="i18n.inputPageName" :text="pageName"
                @textChanged="setPageName"></q-input>
            <q-view layout="hbox" layout-spacing="10" horizontal-size-policy="Minimum">
                <!-- 创建vue文件下拉框 -->
                <q-combox id="HXCombox" v-if="!isUniappX" :enabled="checkedTemplate.type == 'default'"
                    minimumWidth="140" maximumWidth="200" :items="createFileTypeEnums" :editable="false"
                    :currentText="i18n.createVueFile" @currentTextChanged="setCreateFileType"></q-combox>
                <!-- 创建同名目录选择框 -->
                <q-checkbox id="HXCheckBox" :enabled="checkedTemplate.type == 'default'" checked="true"
                    minimumWidth="100" maximumWidth="200" @stateChanged="setCreateSameDirectory"
                    :text="i18n.createDir"></q-checkbox>
                <!-- 页面级滚动选择框 -->
                <q-checkbox id="HXCheckBox" v-if="isUniappX" :enabled="checkedTemplate.allowPageScroll"
                    :checked="pageLevelScroll" @stateChanged="setPageLevelScroll"
                    :text="i18n.pageLevelScroll"></q-checkbox>
                <!-- 查看详情超链接 -->
                <q-label id="HXLink" v-if="isUniappX" @linkActivated="openUniappXPageDetails"
                    :text="`&lt;a href='void(0)' style='color: #54AE6C; font-size:11px;' &gt;[${i18n.pageDetail}]&lt;/a&gt;`"></q-label>
            </q-view>
        </q-view>
        <!-- 选择目录 -->
        <q-view layout="hbox" :id="locationBoxId" :layout-spacing="0">
            <q-combox id="HXCombox" :ref="targetLocationRef" :enabled="enabledDefaultComponent"
                horizontal-size-policy="Expanding" :currentText="targetLocation" @currentTextChanged="setTargetLocation"
                :placeholderText="i18n.location" :items="locationHistory" maxVisibleItems="10"></q-combox>
            <q-button id="HXButtonBrowse" :enabled="checkedTemplate.type == 'default'" @clicked="openFileDialog"
                :text="`${i18n.selectLocation}`"></q-button>
        </q-view>
        <!-- 选择模板 -->
        <q-view layout="hbox" vertical-size-policy="Expanding" horizontal-size-policy="Expanding"
            style="min-height: 340px;">
            <q-group-box id="TemplateGroupBox" layout="hbox" layout-spacing="0" vertical-size-policy="Expanding"
                horizontal-size-policy="Expanding" :title="i18n.selectTemplate">
                <!-- 左侧复选框列表 -->
                <q-scroll-view id="TemplateScrollView" layout="vbox" horizontal-size-policy="Expanding"
                    vertical-size-policy="Expanding">
                    <q-radio-group layout="vbox" layout-spacing="4">
                        <q-view id="TemplateRadio" layout="hbox" :layout-spacing="0" v-for="temp in templates">
                            <q-radio id="ListItemRadio" :checked="temp.file == checkedTemplate.file"
                                @clicked="changePageTemplate" :text="temp.name" :data-value="temp.file"></q-radio>
                            <q-button id="ListItemButton" horizontal-size-policy="Minimum"
                                v-if="temp.type == 'uni_modules'" :text="`[${temp.type}]`" :data-value="temp.file"
                                @clicked="changePageTemplate"></q-button>
                            <q-label id="ListItemLink" horizontal-size-policy="Expanding"
                                @linkActivated="()=>openTemplateUrl(temp.url)" v-if="temp.type == 'uni_modules'"
                                :text="`&nbsp;&nbsp;&lt;a href='void(0)' style='font-size:11px;color: #54AE6C;' &gt;${i18n.pageDetail}&lt;/a&gt;`"></q-label>
                        </q-view>
                        <q-view vertical-size-policy="Expanding"></q-view>
                    </q-radio-group>
                </q-scroll-view>
                <!-- 分割线 -->
                <q-view id="GroupVLine" layout="vbox"></q-view>
                <!-- 右侧预览区域 -->
                <q-view id="PreviewView" layout="vbox" layout-spacing="0" horizontal-size-policy="Minimum"
                    vertical-size-policy="Minimum">
                    <q-view layout="vbox" layout-spacing="0" horizontal-size-policy="Minimum"
                        vertical-size-policy="Minimum" style="padding: 0 auto;">
                        <!-- 模板预览-代码编辑器 -->
                        <q-source-editor id="TemplateEditor" v-if="!isImageLoading &&!checkedTemplate.previewImage"
                            horizontal-size-policy="Ignored" vertical-size-policy="Expanding" :enabled="false"
                            languageId="vue" :follow-theme="false" :read-only="true" :word-wrap="false"
                            :font-size="isWin ? 8 : 11" :margin-fold-visible="false" :line-number-visible="false"
                            focusPolicy="NoFocus" verticalScrollBarPolicy="ScrollBarAlwaysOff"
                            horizontalScrollBarPolicy="ScrollBarAlwaysOff"
                            :text="(pageLevelScroll && checkedTemplate.allowPageScroll) ? checkedTemplate.templateContentWithScroll : checkedTemplate.templateContent"></q-source-editor>
                        <!-- 图片预览 -->
                        <q-view id="TemplateImage" layout="hbox" v-if="!isImageLoading && checkedTemplate.previewImage"
                            horizontal-size-policy="Ignored" vertical-size-policy="Expanding">
                            <q-label id="HXImg" horizontal-size-policy="Ignored" vertical-size-policy="Ignored"
                                :text="`&lt;img width='186' height='298' style='margin:0; padding:0;' src='${checkedTemplate.previewImage}' /&gt;`"></q-label>
                        </q-view>
                        
                        <q-view id="TemplateLoading" layout="vbox" v-if="isImageLoading" layout-spacing="0" horizontal-size-policy="Expanding">
                            <q-label alignment="AlignVCenter|AlignCenter" style="color: #405e43; margin-top: 60px;" text="Loading..."></q-label>
                        </q-view>
                    </q-view>
                    <!-- 模板信息 -->
                    <q-view id="TemplateInfo" layout="vbox" layout-spacing="0" horizontal-size-policy="Expanding">
                        <q-label id="TemplateInfoName" v-if="checkedTemplate.isCustom"
                            alignment="AlignVCenter|AlignCenter" :text="checkedTemplate.name"></q-label>
                        <q-label id="TemplateInfoAuthor" v-if="checkedTemplate.author" style="color: #405e43;"
                            :text="`${i18n.templateAuthor}：${checkedTemplate.author}`"></q-label>
                        <q-view layout="hbox" layout-spacing="0" horizontal-size-policy="Maximum"
                            v-if="checkedTemplate.description">
                            <q-label id="TemplateInfoDescription" horizontal-size-policy="Preferred" maximumWidth="190"
                                :text="checkedTemplate.description"></q-label>
                            <q-label id="TemplateInfoDetails" v-if="checkedTemplate.url"
                                @linkActivated="()=>openTemplateUrl(checkedTemplate.url)"
                                :text="`&nbsp;&nbsp;&lt;a href='void(0)' style='font-size:11px;color: #54AE6C;text-decoration: none;' &gt;${i18n.pageDetail}>&lt;/a&gt;`"></q-label>
                        </q-view>
                    </q-view>
                </q-view>
            </q-group-box>
        </q-view>
        <!-- 在pages.json中注册 -->
        <q-view layout="vbox" layout-spacing="0" maximumHeight="110">
            <q-view layout="hbox">
                <!-- 在pages.json中注册复选框 -->
                <q-checkbox id="HXCheckBoxRegPages" :enabled="enabledRegisterToPagesJson"
                    :checked="enabledRegisterToPagesJson && isRegisterToPagesJson" @stateChanged="setRegisterPageJson"
                    :text="i18n.registerToPagesJson"></q-checkbox>
                <!-- 包名选择组件 -->
                <q-view id="SubPackageView" layout="hbox" v-if="subPackageItems.length > 0">
                    <q-label id="SubPackageViewLabel" :text="i18n.chooseAppsSubpackage"></q-label>
                    <q-combox id="HXCombox" :items="subPackageSelectorItems" editable="false" maxVisibleItems="6"
                        maximumWidth="280" :enabled="isRegisterToPagesJson" :currentText="checkedAppSubPackage.label"
                        @currentTextChanged="setAppSubPackage"></q-combox>
                </q-view>
            </q-view>
            <!-- 禁用状态是，无法显示未灰色 -->
            <q-source-editor id="PagesEditor" :enabled="isRegisterToPagesJson && checkedTemplate.type != 'uni_modules'"
                languageId="json" :follow-theme="false" :word-wrap="false" maximumHeight="70" minimumHeight="70"
                @modified="checkPagesJsonText" :font-size="isWin ? 8 : 11" :margin-fold-visible="false"
                :line-number-visible="false" :text="checkedTemplate.pagesStyle"></q-source-editor>
        </q-view>
    </q-view>
</template>

<script>
    let checkPagesJsonTextDebounceTimer = null;
    const formKeys = ['pageName', 'createPageType', 'createSameDirectory', 'pageLevelScroll', 'targetLocation',
        'isRegisterToPagesJson', 'checkedTemplate', 'appSubPackage'
    ];
    const templateCache = {},
        appSubPackageCache = {};
    const defaultData = {
        pageNameRef: `pageNameRef-${new Date()}`,
        targetLocationRef: `targetLocation-${new Date()}`,
        isImageLoading: false, // 加载状态
        isStyleLoading: false,
        isUniappX: false, // 是否uniapp-x
        enabledDefaultComponent: true,
        locationBoxId: 'ViewBottomLine',
        pageName: '', // 页面名称
        createPageType: 'vue', // 创建页面类型
        createSameDirectory: true, // 是否创建同名目录
        createSameDirectoryEnabled: true, // 是否启用创建同名目录
        pageLevelScroll: true, // 是否页面级滚动
        targetLocation: '', // 页面位置
        locationHistory: [], // 页面位置选择的历史记录
        templates: [], // 页面模板数据
        isRegisterToPagesJson: true, // 是否在pages.json中注册
        enabledRegisterToPagesJson: true, // 是否启用在pages.json中注册
        checkedTemplate: {},
        createFileTypeEnum: [], // 创建文件类型枚举
        createFileTypeEnabled: true, // 是否启用创建文件类型
        subPackageItems: [], // 分包下拉框数据 
        appSubPackage: 'main', // 选择的分包
        checkedAppSubPackage: {}, // 默认的的分包
        pageDefaultTemplate: ''
    };
    let formMitt, templateRequestId = 0;
    export default {
        data() {
            return defaultData;
        },
        created() {
            formMitt = this.$mitt;
            for (const item of this.templates) {
                templateCache[item.file] = item;
            }
            for (const item of this.subPackageSelectorItems) {
                appSubPackageCache[item.data] = item;
            }
            this.checkedAppSubPackage = appSubPackageCache[this.appSubPackage];

            // 如果不是uniapp-x，则页面级滚动不可见，所以应该设置为false
            if (!this.isUniappX) {
                this.pageLevelScroll = false;
            }
        },
        async updated() {
            // await this.updateUi();
        },
        computed: {
            subPackageSelectorItems() {
                const items = this.subPackageItems.map(item => {
                    return {
                        label: item.root,
                        data: item.root
                    };
                });
                return [{
                    label: this.i18n.mainPackage,
                    data: 'main'
                }, ...items];
            }
        },
        async mounted() {

        },
        watch: {
            isImageLoading: {
                async handler(val) {
                    // 处理图片加载时，仅通过占位符显示状态
                    this.updateUi();
                }
            },
            isStyleLoading: {
                handler(val) {
                    // 处理加载状态
                    if (val) {
                        this.$formDialog.showLoading({
                            maskAt: "createFrom#PagesEditor"
                        });
                    } else {
                        this.$formDialog.hideLoading({
                            maskAt: "createFrom#PagesEditor"
                        });
                    }
                }
            },
            targetLocation: {
                async handler(value) {
                    const packageName = await callEmit('getPackageNameByFilePath', value);
                    if (packageName !== this.appSubPackage) {
                        this.checkedAppSubPackage = appSubPackageCache[packageName];
                        this.appSubPackage = packageName;
                        this.updateUi();
                    }
                }
            }
        },
        methods: {
            // 设置页面名称
            setPageName(e) {
                this.pageName = e.target.text;
                this.$formDialog.showError(this.pageName.trim() ? '' : this.i18n.pageNameNotEmpty);
                this.updateUi();
            },
            // 重置页面名称获得焦点
            resetPageNameFocus() {
                setTimeout(() => {
                    this.$refs[this.pageNameRef].$el.setFocus()
                }, 50)
            },
            // 设置创建文件类型
            setCreateFileType(e) {
                this.createPageType = e.target.currentData;
                this.updateUi();
            },
            // 设置是否创建同名目录
            setCreateSameDirectory() {
                this.createSameDirectory = !this.createSameDirectory;
                this.updateUi();
            },
            // 页面级滚动
            async setPageLevelScroll() {
                this.pageLevelScroll = !this.pageLevelScroll;
                this.updateUi();
            },
            // 设置目标位置
            async setTargetLocation(e) {
                this.targetLocation = e.target.currentText;
                this.updateUi();
            },
            // 重置页面位置获得焦点
            resetLocationFocus() {
                setTimeout(() => {
                    this.$refs[this.targetLocationRef].$el.setFocus()
                }, 50)
            },
            // 打开文件选择框
            async openFileDialog() {
                const [choosePath] = await callEmit('openFileDialog', this.targetLocation)
                if (choosePath) {
                    this.targetLocation = choosePath;
                    await this.updateUi();
                }
            },
            // 选择页面模板
            async changePageTemplate(e) {
                this.$formDialog.showError('') // 清空错误消息
                const checkedFile = e.target['data-value'];
                this.checkedTemplate = templateCache[checkedFile];

                // 如果模板为空，填充默认模板，避免出现空的内容
                if(!this.checkedTemplate['templateContent']){
                    this.checkedTemplate['templateContent'] = this.pageDefaultTemplate;
                    this.updateUi();
                }

                this.enabledRegisterToPagesJson = this.checkedTemplate.type !== 'uni_modules';
                this.isRegisterToPagesJson = this.enabledRegisterToPagesJson;
                this.enabledDefaultComponent = this.checkedTemplate.type == 'default';
                this.locationBoxId = this.enabledDefaultComponent ? 'ViewBottomLine' : 'ViewBottomLineDisabled'

                // 处理预览图片的逻辑
                if (this.checkedTemplate.preview) {
                    this.isImageLoading = true;
                    callEmit('requestImage', this.checkedTemplate.preview).then(async (previewImage) => {
                        this.isImageLoading = false;
                        // 如果字符串以<template>开始，说明图片加载失败，返回了默认的模板
                        if (previewImage.startsWith('<template>')) {
                            this.checkedTemplate.templateContent = previewImage;
                        } else {
                            this.checkedTemplate.previewImage = previewImage.replace(/\\/g, '/');
                        }
                        await this.updateUi();
                    });

                }

                // 处理模板文件为url的逻辑
                if (this.checkedTemplate.type === 'uni_cloud') {
                    this.checkedTemplate['downloadSign'] = true;
                    this.isStyleLoading = true;
                    const currentRequestId = ++templateRequestId;
                    callEmit('getHttpTemplate', this.checkedTemplate).then(async (checkedTemplate) => {
                        // 仅处理最后一次请求的响应以避免界面抖动
                        if (currentRequestId !== templateRequestId) {
                            return;
                        }
                        this.isStyleLoading = false;
                        if(checkedTemplate.error){
                            this.$formDialog.showError(this.i18n.requestTemplateZipPackageFail)
                        }else{
                            this.checkedTemplate = checkedTemplate;
                        }
                        await this.updateUi();
                    });
                }
                await this.updateUi();
            },
            // 设置是否在pages.json中注册
            setRegisterPageJson() {
                this.isRegisterToPagesJson = !this.isRegisterToPagesJson;
                this.updateUi();
            },
            // 设置App和小程序的分包
            async setAppSubPackage(e) {
                this.checkedAppSubPackage = appSubPackageCache[e.target.currentData] || {};
                if (this.appSubPackage !== e.target.currentData) {
                    const data = {
                        packageName: e.target.currentData,
                        targetLocation: this.targetLocation
                    };
                    const newLocation = await callEmit('showSubPackageChangeDialog', data);
                    if (newLocation) {
                        this.targetLocation = newLocation;
                    }
                }
                this.appSubPackage = e.target.currentData;
                this.updateUi();
            },
            // pages.json 编辑器内容被修改后
            async checkPagesJsonText(e) {
                if (checkPagesJsonTextDebounceTimer) {
                    clearTimeout(checkPagesJsonTextDebounceTimer);
                }
                checkPagesJsonTextDebounceTimer = setTimeout(async () => {
                    this.checkedTemplate.pagesStyle = e.target.text;
                    const isError = await callEmit('checkPagesJsonSyntax', e.target.text)
                    if (isError) {
                        this.$formDialog.showError(this.i18n.pagesJsonSyntaxError);
                        return;
                    } else {
                        this.$formDialog.showError('');
                    }
                }, 1000);
            },
            // 打开uniapp-x页面详情url链接
            openUniappXPageDetails() {
                callEmitNoWait('openExternalLink', 'https://uniapp.dcloud.net.cn/tutorial/page.html#uvue');
            },
            // 打开模板详情url链接
            openTemplateUrl(url) {
                callEmitNoWait('openExternalLink', url);
            }
        }

    };

    /**
     * 使用普通的方式调用TS端的方法，此方法无需等待TS端的响应情况
     @param {Object} method
     * @param {Object} args
     */
    function callEmitNoWait(method, args) {
        formMitt.emit(method, {
            args
        });
    }
    /**
     * 使用异步Promise的方式调用TS端的方法
     * @param {Object} method 方法名
     * @param {Object} args 参数对象
     */
    function callEmit(method, args) {
        return new Promise((resolve, reject) => {
            try {
                formMitt.emit(method, {
                    args,
                    callback: resolve
                });
            } catch (e) {
                reject && reject(e);
            }
        });
    }
</script>


<style lang="qss">
    * {
        background-color: transparent;
        font-family: "Microsoft YaHei";
        font-size: 11px;
    }

    #ViewRoot {
        margin-top: 0px;
        padding-top: 0px;
        min-width: 568px;
        min-height: 570px;
    }

    #TemplateGroupBox {
        background-color: transparent;
    }

    #TemplateGroupBox::title {
        color: #919191;
    }

    #GroupVLine {
        margin: 10px 0;
        margin-top: 0px;
        border: 1px solid #e5e5e5;
        border-right-width: 0;
        max-width: 0px;
    }

    #PreviewView {
        margin: 10px;
        margin-bottom: 0;
        margin-top: 0;
    }

    #ViewBottomLineDisabled,
    #ViewBottomLine {
        border: 1px solid #e5e5e5;
        border-top: 0;
        border-left: 0;
        border-right: 0;
        padding-right: 10px;
    }

    #ViewBottomLine:hover {
        border-color: #54AE6C;
    }

    #TemplateScrollView,
    #TemplateScrollView QFrame {
        background: transparent;
    }

    #TemplateScrollView {
        border: none;
        margin: 10px;
        margin-top: 0;
        padding-top: 5px;
    }

    #TemplateRadio {
        min-height: 20px;
        max-height: 20px;
    }

    #TemplateRadio QRadioButton::unchecked {
        color: #405e43;
    }

    #TemplateRadio QRadioButton::indicator::unchecked {
        image: unset;
        width: 16px;
    }

    #TemplateRadio QRadioButton::checked {
        color: #54AE6C;
    }

    #TemplateRadio QRadioButton::indicator::checked {
        image: url("@icon.folder@ProjectWizard/template_select.png");
    }

    #ListItemRadio {
        margin-right: 0;
        padding-right: 0;
    }

    #ListItemButton {
        background: transparent;
        padding-left: 5px;
        border: 0;
        color: gray;
    }

    #PagesEditor {
        border: 1px solid #54AE6C;
    }

    #PagesEditor::GraphicsEffect:disabled {
        opacity: 1;
    }

    #HXLink,
    #ListItemLink {
        color: green;
        font-weight: bold;
    }

    #ListItemLink {
        font-weight: normal;
    }

    #errorColor {
        color: #D41515;
        min-height: 16px;
        max-height 16px;
    }

    #HXButtonBar {
        background-color: #54AE6C;
        color: #fff;
        padding: 2px 5px;
        margin-left: 10px;
    }

    QPushButton,
    #HXButton,
    #HXButtonCreate {
        border: 1px solid #54AE6C;
        background: #fafffa;
        color: #54ae6c;
    }

    #HXButtonCreate {
        background: transparent;
        width: 80px;
        height: 35px;
        font-size: 14px;
        padding: 0;
    }

    QPushButton:disabled,
    #HXButtonCreate:disabled,
    #HXButton:disabled {
        color: #c0c4cc;
        border: 1px solid #c0c4cc;
    }

    #HXButtonBrowse {
        background: transparent;
        margin: 0;
        padding: 0;
        border: 0;
    }

    #HXInput {
        padding: 0px;
        color: #282828;
        height: 26px;
        border: 0;
        background: transparent;
    }

    #HXInput:disabled {
        color: #c0c4cc;
    }

    #HXInput:hover,
    #HXInput:focus {
        background: transparent;
        /* border-color: #43c45b; */
    }

    QComboBox,
    #HXCombox {
        height: 26px;
        border: 0;
        margin: 0;
        color: #00AF21;
        padding-left: 10px;
    }

    QComboBox:disabled,
    #HXCombox:disabled {
        color: #c0c4cc;
    }

    QComboBox::drop-down,
    #HXCombox::drop-down {
        subcontrol-origin: padding;
        subcontrol-position: top right;
        width: 16px;
        border: none;
        padding-right: 11px;
    }

    QComboBox::down-arrow,
    #HXCombox::down-arrow {
        margin-left: 20px;
        image: url(:/login/icons/down-arrow-fill.png);
    }

    QComboBox::down-arrow:disabled,
    #HXCombox::down-arrow:disabled {
        image: url(:/login/icons/down-arrow-fill-disable.png);
    }

    QComboBox QAbstractItemView,
    #HXCombox QAbstractItemView {
        border: 1px solid #43C45B;
        background: #FFFEFA;
        color: #405E42;
        selection-color: #4EAB57;
        selection-background-color: #FFFEFA;
    }

    QComboBox QAbstractItemView::item,
    #HXCombox QAbstractItemView::item {
        border: 0;
    }

    QComboBox QAbstractItemView::item:hover,
    #HXCombox QAbstractItemView::item:hover {
        background-color: #fffae8;
        color: #54AE6C;
    }

    QCheckBox,
    #HXCheckBox {
        color: #405e43;
        margin: 0;
    }

    QCheckBox:disabled,
    #HXCheckBox:disabled {
        color: #c0c4cc;
    }

    QCheckBox::indicator::unchecked,
    #HXCheckBox::indicator::unchecked {
        image: url(:/hxui/resource/chbx.png);
    }

    QCheckBox::indicator::unchecked:hover,
    #HXCheckBox::indicator::unchecked:hover {
        image: url(:/hxui/resource/chbx-hover.png);
    }

    QCheckBox::indicator::checked,
    #HXCheckBox::indicator::checked {
        image: url(:/hxui/resource/chbx-checked.png);
    }

    QCheckBox::indicator::checked:disabled,
    #HXCheckBox::indicator::checked:disabled {
        image: url(:/hxui/resource/chbx-checked-disable.png);
    }

    QCheckBox::indicator::unchecked:pressed,
    QCheckBox::indicator::checked:pressed,
    #HXCheckBox::indicator::unchecked:pressed,
    #HXCheckBox::indicator::checked:pressed {
        image: url(:/hxui/resource/chbx-pressed.png);
    }

    QCheckBox::indicator:disabled,
    #HXCheckBox::indicator:disabled {
        image: url(:/hxui/resource/chbx.png);
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

    #marginTop {
        margin-top: 5px
    }

    #line {
        margin-top: 5px;
    }

    #TemplateImage,
    #TemplateEditor {
        border: 1px solid #c1ae7e;
        min-width: 186px;
        min-height: 298px;
        margin: 0;
        padding: 0;
    }

    #HXImg {
        margin: 0;
        padding: 0;
        min-width: 186px;
        min-height: 298px;
        background-size: contain;
    }

    #TemplateInfo {
        max-height: 80px;
        min-height: 20px;
        padding: 5px;
    }

    #TemplateInfoName {
        color: #405e43;
        margin: 0 auto;
        padding: 0;
    }

    #TemplateInfoAuthor,
    #TemplateInfoDescription {
        color: #405e43;
        margin-right: 0;
    }

    #TemplateInfoDetails {
        color: gray;
        font-weight: normal;
    }

    #HXCheckBoxRegPages {
        font-weight: bold;
        margin-left: 0;
    }

    #SubPackageView {
        min-width: 280px;
    }

    #SubPackageViewLabel {
        color: #405e43;
        font-weight: bold;
    }

    QScrollBar::handle:vertical {
        background-color: #e5e5e5;
        min-height: 30px;
    }

    QTableView QScrollBar {
        background: transparent;
        width: 6px;
    }

    QScrollBar::handle:vertical {
        width: 6px;
        background-color: #e5e5e5;
        min-height: 30px;
    }

    QTableView QScrollBar::sub-line,
    QTableView QScrollBar::add-line {
        background: transparent;
    }
</style>

<style when="screen.devicePixelRatio >= 150 && isWindows">
    #activateBtn {
        text-align: center left;
        border: none;
        min-height: 25px;
    }
</style>
<style when="isMac">
    #TemplateGroupBox {
        background-color: transparent;
        border: 1px solid #e5e5e5;
        padding-top: 10px;
        margin-top: 10px;
    }

    #TemplateGroupBox::title {
        color: #919191;
        position: absolute;
        top: -6px;
        left: 10px;
    }

    #TemplateImage,
    #TemplateEditor {
        min-height: 278px;
    }

    #HXImg {
        min-height: 278px;
    }

    #TemplateInfo {
        max-height: 80px;
        min-height: 16px;
        padding: 5px;
    }
</style>
<style when="isWindows">


</style>