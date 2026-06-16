<template>
    <q-view layout="vbox" style="margin: 5px; margin-bottom: 0;">
        <q-source-editor id="license-editor" languageId="markdown" :text="licenseText" :read-only="true"
            maximum-height="320" :follow-theme="true" :word-wrap="true" :margin-fold-visible="false"
            :line-number-visible="false" end-at-last-line="true"></q-source-editor>
        <q-view layout="hbox" style="margin-top: 5px;">
            <q-label :text="`${priceInfo ? '' : i18n.licenseDialogFooterLoading}`"></q-label>
        </q-view>
        <q-view layout="hbox" style="margin-top: 5px;">
            <q-label horizontal-size-policy="Expanding" :wordWrap="true"
                :text="i18n.licenseDialogFooterDescription + `${priceInfo || ' '}`"
                style="max-width: 450px; max-height: 40px;"></q-label>
            <q-view horizontal-size-policy="Preferred"></q-view>
            <q-view layout="hbox" style="max-width: 285px; padding-right: 10px;">
                <q-button id="HXButton" :text="i18n.buttonCancel" @clicked="onCancel"></q-button>
                <q-view horizontal-size-policy="Expanding"></q-view>
                <q-button id="HXButton" :text="i18n.licenseDialogButtonAgree" @clicked="onAgree"></q-button>
            </q-view>
        </q-view>
    </q-view>
</template>
<script>
    export default {
        data() {},
        mounted() {
            this.$mitt.emit('getPriceInfo', (text) => {
                this.priceInfo = text || i18n.licenseDialogFooterNoPrice;
                this.updateUi();
            })
        },
        methods: {
            onCancel() {
                this.$mitt.emit('onCancel')
            },
            onAgree() {
                this.$mitt.emit('onAgree')
            }
        }
    }
</script>
<style lang="qss">
    QLabel {
        color: #54AE6C;
    }

    #HXButton {
        max-width: 126px;
        min-width: 126px;
        height: 40px;
        font-size: 15px;
        padding: 0;
        border: 1px solid #54AE6C;
        background: #fafffa;
        color: #54ae6c;
    }
</style>