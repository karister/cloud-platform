# HBuilder X - Release Notes
======================================
## 4.03.2024031518-dev
### HBuilder
* Fixed the issue where when uni-app is released to the web and tree-shaking optimization is turned on, it prompts that the compilation is successful but there is no file. [Details](https://ask.dcloud.net.cn/question/187418)
* Plug-in: New im-notifier plug-in Receive new message notifications from uni-im and prompt users [Details](https://ext.dcloud.net.cn/plugin?name=im-notifier)
### uni-app plugin
* Web platform Fixed The previous page is blank during iOS safari gesture back [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=941)
### uni-app x plugin
* Web platform Optimized Reduce compilation time
* Web platform Fixed Api uni.rpx2px report an error after the project is released [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=930)
* Web platform Fixed An error is reported by using instanceof UniXXXElement [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=940)
* Web platform Fixed The previous page is blank during iOS safari gesture back [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=941)

## 4.03.2024031101-alpha
### HBuilder
* Language Server: UTS plugin, Auto-importing packages without a newline after the first line when no other import nodes exist in the current file.
* Language Server: uts syntax check, When the function parameter type is `UTSJSONObject`, when calling the function and using a literal object to pass parameters, a false positive type mismatch bug occurs
* Language Server: uts syntax check `instanceof` does not allow the type defined by type to be used as a value.
* Mobile App Playground: Fixed uni-app, after the iOS standard base is signed, it will not be automatically deleted during the next upgrade, causing the re-signed base that runs after the upgrade to be a bug in the previous version
* Mobile App Playground: Fixed the bug of uni-app x custom debugging base. After upgrading HBuilderX, the base version mismatch was not prompted.
### uni-app plugin
* Web platform Fix the bug of conditional compilation failure for .scss files in Vue3 project.
### uni-app x plugin
* Fixed the bug where conditional compilation was not effective during pre-check in pages.json. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=909)
* Web platform Adjust When running to the browser, compile the code in the script tag into compatible code that can be run in earlier browsers
* Fixed the bug on the App-Android platform where conditional compilation in APP-PLUS was effective.  [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=910)
### uniCloud Plugin
* Fixed the bug caused by version 3.98 that caused the cli project to be unable to download to the specified location when downloading cloud functions or public modules
* Fixed the bug caused by version 4.02 that dependencies are not automatically installed when uploading public modules
* Fixed the bug caused by version 4.02 that the uni_modules.platforms.cloud field in the package.json file of the uni_modules plug-in is not configured with a cloud vendor, resulting in the uniCloud directory of the plug-in not being displayed in the uniCloud virtual directory [Details](https://ask .dcloud.net.cn/question/187371)

## 4.02.2024030621-alpha
### HBuilder
* Language Server: Fixed the bug of importing vue type error when using vue3+ts in uni-app project [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=720)
* Language Server: Fixed the bug where the pinia module search error caused false alarms when using ts in the uni-app project [Details](https://ask.dcloud.net.cn/question/185148)
* Language Server: Fixed uts Android, automatically fix the bug that when there are multiple import package options, the import result of selecting an option other than the first one is incorrect.
* Fixed a bug that caused memory leaks when part of the memory was not recycled properly when the editor was opened or closed.
* Fixed a bug where a certain position may be lost when returning to the previous cursor position when quickly going to the definition continuously.
* Fixed the bug that may cause the interface to become unresponsive in a weak network environment when creating a new project
* Fixed the bug that the preview interface cannot disappear when the folded line in the code folding preview is at the last line of the screen
* Fixed the bug that the Prettier plug-in does not recognize the embedded uts code when formatting uvue [Details](https://ext.dcloud.net.cn/plugin?id=2025)
* Fixed a bug in the MacOSX project manager & built-in resource management that uses shortcut keys to rename file names. When entering the editing state, triggering the shortcut keys again will not automatically commit the changes. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=795)
* Fixed the bug that the Html preview sub-menu item `Save and automatically refresh the browser` is not displayed in the run menu [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=721)
* Fixed the bug of 404 reported when previewing html files when the project directory name contains the character '.'
* Added uts plug-in uts Android plug-in development, supporting Gradle 8.x [Details](https://uniapp.dcloud.net.cn/tutorial/run/uts-development-android.html#%E9%85%8D%E7%BD%AE-gradle-jdk)
* Adjust uni-app (x) to run on the web, adjust the console log output format
* Adjust uni-app x to run on Android, adjust console log output format
* Fixed uni-app x, project contains uts plugin, run to custom base, Bug in running error when `Clean build cache` is checked [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=781)
### uni-app plugin
* App platform Fixed the bug of compile error in nvue page of Vue2 Cli project [Details](https://ask.dcloud.net.cn/question/186784)
* App-Android platform Added API uni.getChannelManager to get the notification channel manager [Details](https://uniapp.dcloud.net.cn/api/plugins/push.html#getChannelManager)
* App-Android platform, fix the first installation call uni.scanCode may have a black screen bug [details](https://ask.dcloud.net.cn/question/185913)
* Web Fixed the bug of Vue3 project automation testing element.input method error [Details](https://ask.dcloud.net.cn/question/184815)
* TikTok Mini Program Added The component supports virtualHost configuration [Details](https://uniapp.dcloud.net.cn/tutorial/vue3-api.html#其他配置)
* TikTok Mini Program Fixed the bug of attribute loss when Vue3 project uses plug-in [Details](https://ask.dcloud.net.cn/question/185513)
* TikTok Mini Program Fixed the bug in Vue2 project using internationalization error [Details](https://ask.dcloud.net.cn/question/161008)
### uni-app x plugin
* Web, App-Android platform, Fixed UniElement The tagName and nodeName is not consistent with the component name [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=766)
* Web, App-Android platform, Fixed The bug that $parent does not skip the built-in components [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=773)
* Web, App-Android platform, Added API uni.rpx2px [Details](https://doc.dcloud.net.cn/uni-app-x/api/rpx2px.html)
* Web platform, Added The list-view and list-item components are supported [Details](https://doc.dcloud.net.cn/uni-app-x/component/list-view.html)
* Web platform, Added The sticky-section and sticky-header components are supported [Details](https://doc.dcloud.net.cn/uni-app-x/component/list-view.html)
* Web platform, Fixed In some scenarios, the type inference does not use the object literal as UTSJSONObject [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=819)
* Web platform, Fixed The bug that prevents instances from being created correctly when any[] is included in the type literal [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=767)
* Web platform, Fixed The bug that does not automatically create an instance when a variable is declared as non-globally declared type [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=782)
* Web platform, Fixed The bug that $forceUpdate failed to update the contents of the built-in component slot [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=776)
* Web platform, Fixed The bug that the exported type cannot be found when the newly exported type in the hot-update UTS file is used [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=823)
* Web platform, Fixed The request, uploadFile, and downloadFile APIs timeout immediately when timeout parameter is null [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=805)
* App-Android platform, add API uni.requestPayment, support Alipay payment [details](https://doc.dcloud.net.cn/uni-app-x/api/request-payment.html)
* App-Android platform, adjustment, component button is a native implementation, which solves the problem that the actual rendering width and height are inconsistent with the web side [details](https://doc.dcloud.net.cn/uni-app-x/component/button.html)
* App-Android Fixed An error is reported when you associate a unicloud space with another project and use a cloud object in it [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=817)
* App-Android platform, fix the bug that the component width is incorrect when the component text has no text content [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=777)
* App-Android platform, fix, component text subcomponent setting background-color style invalid bug [details](https://issues.dcloud.net.cn/pages/issues/detail?id=276)
* App-Android platform, fix the bug that the component text subcomponent cannot modify the text content [details](https://issues.dcloud.net.cn/pages/issues/detail?id=562)
* App-Android platform, fix the bug that the component image request network picture cannot share cookies [details](https://issues.dcloud.net.cn/pages/issues/detail?id=820)
* App-Android platform, fix the bug that the dynamic adjustment of the width and height of the component list-item does not take effect [Details](https://ask.dcloud.net.cn/question/185517)
* App-Android platform, fix, component list-view part of the scene modification refresher-triggered attribute value may not take effect Bug [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=796)
* App-Android platform, fix The component list-view reports an error when deleting slot sub-elements in some cases [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=769)
* App-Android platform, fix the bug that API uni. setNavigationBarColor cannot set the background color of the system status bar when customizing the navigation bar [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=821)
* App-Android platform, fix the bug that the z-index property is invalid after the position property is set to fixed in the CSS 4.0 version [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=726)
* App-Android platform, updated, cloud packaging environment compileSdkVersion is 34
* App-Android platform, fix the bug that clicking tab switch crashes when tabBar configures pagePath incorrectly [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=779)
* App-Android platform, fix the bug that may compile an error when using UTSAndroid.getJavaClass to get imported classes [details](https://issues.dcloud.net.cn/pages/issues/detail?id=809)
* App-Android platform, fix unicloud-db component, use setup syntax, the bug that data cannot be used in the scope slot [details](https://issues.dcloud.net.cn/pages/issues/detail?id=761)
* App-Android platform  fix A bug occurs when a numeric error code is returned by a cloud object [details](https://issues.dcloud.net.cn/pages/issues/detail?id=840)
* App-Android platform, optimize the construction of type-type responsive objects, avoid the use of reflection, and optimize performance
### uts插件
* Android platform, add'typeof 'operator to support platform-specific character type'Char' [Details] (https://doc.dcloud.net.cn/uni-app-x/uts/operator.html#typeof)
* App-Android platform, fix the bug that the constructor uses super to report an error when locally defining a class [Details] (https://issues.dcloud.net.cn/pages/issues/detail?id=802)
* App-Android platform, add interface.uts file to support export declare syntax [Details] (https://issues.dcloud.net.cn/pages/issues/detail?id=744)
* App-Android platform, fix import * as Types from'xxx 'import type compilation error bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=696)
* App-iOS platform, add @UTSiOS.keyword ('fileprivate') annotation to solve the access control of custom swift classes and properties
### uniCloud Plugin
* Added `uniCloud.httpProxyForEip.get` API to support headers field
* Fixed the bug that the cloud function will still be uploaded after failure to install dependencies when uploading cloud functions
* Fixed the bug that the node_modules directory would not be removed when uploading public modules
* Fixed the bug that the geographical location query/index API cannot be used when running locally
* Fixed the bug that the associated service space is not displayed when opening the cloud space again after the project is closed [Details](https://ask.dcloud.net.cn/question/186741)
* Fixed the bug that the unicloud directory is incorrectly recognized when running associated with other projects
* Fixed the bug of no response when clicking the associated service space when not logged in
* Fixed the bug that the virtual directory cannot be displayed correctly when Alipay Mini Program Cloud, Alibaba Cloud, and Tencent Cloud spaces exist at the same time
* Adjust Aliyun The size limit of URL request body is adjusted from 1 MB to 2 MB, and the size limit of response body is adjusted from 1 MB to 2 MB

## 4.01.2024020211-alpha
### HBuilder
* Adjust the Git plug-in and separate the Git Blame function into a separate plug-in, which can be downloaded from the plug-in market.[Details](https://ext.dcloud.net.cn/plugin?id=16568)
* Language Server: Fixed the bug that causes performance degradation when uni-app x uts code imports too many Android platform libraries
* Language Server: Fixed the bug that the globalProperties attribute defined in uni-app x main.uts cannot be prompted in other uvue pages
* Language Server: Fixed the bug that when uni-app x import imports uvue files, the path cannot go to the defined bug
* Language Server: Fixed the bug that when opening multiple html files, switching to the previous html, variables floating, going to definition, etc. may not be correct if it is not modified.
* Language Server: Fixed the bug that uni api is not prompted under uni_modules utssdk
* Language Server: Fixed the bug that caused the code prompts to become slower and slower when developing uniCloud cloud functions and cloud objects.
* Fixed the bug of hbuilderx object reporting undefined in plug-in API custom webview view introduced in version 4.0 [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=670)
* Fixed the bug caused by version 4.0, when the uni_modules plug-in is uploaded to the plug-in market and the interface keeps loading when opening it
* Fixed the bug introduced in version 4.0 that the schema2code plug-in right-clicked to trigger the Schema2Code menu and the interface kept loading when opening it.
* Fixed the bug that uni-app (x) HBuilderX may falsely report that the `uniapp-extension` plug-in has been tampered with when it is started and click Run immediately.
* Fixed a bug in uni-app (x) that caused HBuilderX to crash when clicking preview after opening an image file in the editor.
### uni-app plugin
* Web Fixed the bug of Vue3 project ssr running error [Details](https://ask.dcloud.net.cn/question/185205)
* Web Fixed the bug of Vue3 project ssr packaging error [Details](https://ask.dcloud.net.cn/question/184125)
* Web Adjust The A label in the node rendered by the navigator component is moved from the outside of the uni-navigator label to the inside of the uni-navigator label.
* App Fixed the bug that the nvue page of the Vue2 project cannot reference static resources in non-static directories.
### uni-app x plugin
* Web Adjust The A label in the node rendered by the navigator component is moved from the outside of the uni-navigator label to the inside of the uni-navigator label.
* Web Adjust When the getStorage and getStorageSync operations return data of the object type, it is converted to the UTSJSONObject type
* Web Adjust The data returned by the request operation is converted to the UTSJSONObject type
* Web Fixed Unused easycom components contain errors or unsupported usage on the web side that cause compilation errors
* Web Fixed In some scenarios, an error occurs when using the literal value of an object as a specified type.
* Web Fixed When referencing a .uvue file, the module cannot be found without a suffix.
* Web Fixed In some scenarios, the conditional compilation in the uts file is invalid.
* Web Adjust Type validation failures are adjusted from an error to a warning without interrupting compilation.
* Web Added Map types are supported when binding classes and styles.
* App-Android platform, fix the bug that occurs when deleting child elements inside slots of special elements (list-view, etc.) [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=388)
### uniCloud Plugin
* Fixed The security network client verification function cannot be used caused by version 3.97.

## 4.0.2024012711-alpha
### HBuilder
* Language Server: Added uni-app x to support multi-platform code prompts and grammar verification, and can switch language services by platform [Details](https://hx.dcloud.net.cn/Tutorial/Language/language_service_target_support)
* Language Server: Added uni ext api, supporting interface.uts specification [Details](https://uniapp.dcloud.net.cn/api/extapi.html#%E5%A6%82%E4%BD%95%E5%BC%80%E5%8F%91uni-ext-api)
* Language Server: Upgrade the built-in typescript library from `4.5.5` to `5.2.2`
* Language Server: Fixed the bug of $ appearing in tag code completion when opening a file in a shared directory [Details](https://ask.dcloud.net.cn/question/182857)
* Language Server: Fix: In some cases, css cannot be transferred to the defined bug [Details](https://ask.dcloud.net.cn/question/184780)
* Language Server: Fix the bug that pages.json, path prompts incorrect page path [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=466)
* Language Server: Fix the bug that caused the file to be occupied and unable to be renamed after displaying the reference results after searching for references.
* Plug-in: New Git plug-in supports blame and displays git log at the end of the code line [Details](https://hx.dcloud.net.cn/Tutorial/SourceControl/Git/git_blame)
* Plug-in: Adjust the bug reporting plug-in. The HBuilder running logs, uni-app console logs, etc. that are checked when reporting bugs are uploaded to be visible only to administrators.
* Plug-in: Optimize the bug reporting plug-in. After submitting a bug, click the details to jump to the issues system to support automatic login.
* Plug-in: Repair bug reporting plug-in macOSX cannot paste pictures when reporting bugs [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=372)
* Fixed AI virtual row style exception when switching themes. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=360)
* Optimize network error prompts in HBuilderX login interface
* Added support for system associated icons for windows uts and uvue files
* Fixed the bug that prompts HBuilderX to prevent shutdown when Windows computer is shut down
* Fixed the bug that when a menu pops up in a certain window in MacOSX multi-window situation, and then the mouse clicks on another window, the focus state and activated window are incorrect.
* Fixed the bug that when the console file link is clicked to jump to the editor, if the target line is collapsed, it will not automatically expand.
* Fixed the bug of incorrect coloring of jsdoc @ tag under vue file script.
* MarkDown: Fixed a bug that caused the preview to fail when the markdown preview file name contained a + sign or other special symbols. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=463)
* MarkDown: Fixed a bug in markdown preview that caused the preview to fail if the file name was modified after previewing. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=369)
* MarkDown: Fixed the bug that markdown preview cannot be parsed and rendered normally when embedded html code [Details](https://ask.dcloud.net.cn/question/184421)
* Html preview: Fixed the bug in html preview where external html files cannot be run into the browser [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=411)
* Html preview: Fixed the bug that the reference to relative path resources in html preview does not take effect
* Html preview: Fixed the bug that the built-in browser log cannot be output to the console when the html file path of the html preview contains Chinese characters.
* Fixed a bug that may cause the interface to freeze when the plug-in process crashes abnormally
* Fixed a bug in the plug-in API that uses font icon extension plug-ins. After installation and use, the plug-in cannot be uninstalled due to font occupation.
* Fixed the bug that the plug-in API window.getActiveTextEditor does not return when there is no open tab card.
* Fixed the bug of running multiple html to chrome and modifying one of them, causing the rest of html pages to refresh. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=313)
* Fixed the bug that caused 5+ projects to disappear when running the menu bar until the browser entrance disappears [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=447)
* uni-app: Adjust the uni-app running unpackage compilation directory and change the `h5` directory name to `web`
* uni-app: Fixed the bug that uni-app runs and runs to Alipay applet and custom run does not take effect [Details](https://ask.dcloud.net.cn/question/183790)
* uni-app: Fixed the bug that causes HBuilderX memory usage to increase in some cases when running uni-app [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=438)
* uni-app: Fixed the bug that the uni-app(-x) pages.json file, uts file, menu `Edit`-`Comment`-`Conditional Compilation` function does not take effect
* uni-app: Added uts plug-in for uni-app x project to support debugging [Details](https://uniapp.dcloud.net.cn/tutorial/debug/uni-uts-debug.html)
* uni-app: Fixed the bug that the format of manifest.json is incorrect when copying permissions to the Android permission configuration interface [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=370)
* uni-app: Fixed the bug that when the plug-in market imports a project and the project only supports vue2, the vue3 button on the import interface can still be clicked.
### uni-app Plugin
* App-Android platform, fix the bug that the location list cannot be obtained after the first call of uni.chooseLocation after installation [details](https://ask.dcloud.net.cn/question/183239)
* App-Android platform, fix the bug that the outer swiper cannot slide when the nvue swiper component is embedded in the swiper setting disable-touch
* Web platform, new vue3 scroll-view component supports show-scrollbar attribute
* Web App-Vue Added input component supports cursor-color attribute. [Details](https://uniapp.dcloud.net.cn/component/input.html#input)
* Web App-Vue Added textarea component supports cursor-color attribute. [Details](https://uniapp.dcloud.net.cn/component/textarea.html#textarea)
* Web Fixed the bug of duplicate static resources after packaging the Vue2 project. [Details](https://ask.dcloud.net.cn/question/184480)
* Web Optimize the vue3 project getCurrentPages() returns the options property. [Details](https://ask.dcloud.net.cn/question/183580)
* Mini Program Fixed the bug of slow compilation when there are large base64 characters on the page. [Details](https://ask.dcloud.net.cn/question/4661)
* Weixin Mini Program Fixed the bug in the vue2 project where workers are configured as objects. [Details](https://github.com/dcloudio/uni-app/issues/4589)
* Weixin Mini Program Fixed a bug in Vue2 project where class line breaks cause errors in mini program compilation. [Details](https://ask.dcloud.net.cn/question/184192)
* TikTok Mini Program Fixed the bug with invalid rtc room component properties. [Details](https://github.com/dcloudio/uni-app/issues/4627)
* Alipay Mini Program platform, fix the bug that globalObjectMode is configured to enable compilation error [details](https://ask.dcloud.net.cn/question/183499)
* Alipay Mini Program platform, fix, native Mini Program component delivery props invalid bug [details](https://github.com/dcloudio/uni-app/issues/4376)
### uni-app x plugin
* [Important] Added, compiled to web platform [Details](https://doc.dcloud.net.cn/uni-app-x/web/)
* 【[Important] Adjust, add the Uni prefix to the component event type name to avoid conflicts with the browser global event [Details](https://doc.dcloud.net.cn/uni-app-x/component/common.html#rename-event-type)
* Added vue composite API [details](https://doc.dcloud.net.cn/uni-app-x/vue/#composition-api)
* Added vue built-in component KeepAlive [details](https://doc.dcloud.net.cn/uni-app-x/vue/#component)
* Added vue built-in component Teleport [details](https://doc.dcloud.net.cn/uni-app-x/vue/#component)
* Added vue watch to support deep and immediate configuration [details](https://doc.dcloud.net.cn/uni-app-x/vue/#options-api-compatibility) 
* Added vue component props to support string array declaration, at this time all prop types are any | null [details](https://doc.dcloud.net.cn/uni-app-x/component/#props)
* Added css variable [details](https://doc.dcloud.net.cn/uni-app-x/css/#variable)
* Fix the bug that some components are nested, which makes it impossible to recycle when the page is closed [details](https://issues.dcloud.net.cn/pages/issues/detail?id=535)
* Compiler, fix the bug that APP-ANDROID and APP-IOS do not take effect in pages.json [details](https://issues.dcloud.net.cn/pages/issues/detail?id=523)
* App-Android platform, Fixed the bug where the template unexpectedly compiles an object into a map. [details](https://issues.dcloud.net.cn/pages/issues/detail?id=244)
### uts plugin
* Fixed An error was reported when compiling the array type of the special value field string.
### uniCloud Plugin
* Added Alipay Mini Program Cloud Database to support geographical location query
* Added: When running a cloud function, the console can click on the cloud function name to jump to the corresponding cloud function.
* Added: When the local node version of the cloud function is inconsistent with the cloud node version, uploading the cloud function will prompt the local node version and the cloud node version.
* Fixed the bug that the selected statement will not be executed in the JQL manager [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=534)
* Fix the bug that Alipay applet cloud Redis local debugging cannot run
* Fixed the bug that the front-end web hosting upload did not automatically select the service space bound to the current project
* Fixed a bug where associated projects can still be switched when switching cloud vendors in the associated service space
* Fixed the bug that the "upload schema extension js configuration" timeout was too short, causing the upload to fail.
* Fix the bug that projects created by cli cannot upload schema [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=592)
* Fix the bug of invalid query using native MongoDB $ in Alipay Mini Program Cloud Database [Details](https://ask.dcloud.net.cn/question/183811)
* Fix the bug of JQL connection table query in Alipay Mini Program Cloud Database [Details](https://ask.dcloud.net.cn/question/185177)
* Fixed the bug that cloud functions can only be associated with public functions under uni_modules [Details](https://ask.dcloud.net.cn/question/184434)

## 3.99.2023121601-alpha
### HBuilder
* Added bug feedback function, currently supports reporting bugs for HBuilder and uni-app x. (The entrance is in the menu Help-Report a bug, and the blue button in the upper right corner of the App running console.)
* Fixed the bug that the built-in browser, previewing html files and markdown files, failed to preview in some cases [Details](https://ask.dcloud.net.cn/question/182604)
* Fixed a Bug in windows when closing HBuilderX that the UI was stuck when creating a desktop shortcut [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=310)
* Fixed a bug in Windows where, in some cases, the address bar could not use shortcut keys to copy addresses. [Details](https://ask.dcloud.net.cn/question/180472)
* Fixed the bug that in some cases on MacOSX, text in the built-in browser devtools cannot be copied using shortcut keys [Details](https://ask.dcloud.net.cn/question/181819)
* Fixed multi-file search, double-click the search result item, the input focus is not automatically set to the bug in the open editor [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=309)
* Fixed the bug that the .editorconfig configuration `insert_final_newline` and `trim_trailing_whitespace` did not take effect when saving the file [Details](https://ask.dcloud.net.cn/question/165790) 
* Language Server: Added uni-app x, uts automatic repair, support conversion between number type and kotlin number type
* Language Server: Added uni-app x, uts type checking, support function type checking [Details](https://uniapp.dcloud.net.cn/uni-app-x/uts/function.html#%E5%87%BD%E6%95%B0%E7%B1%BB%E5%9E%8B)
* Language Server: Added uni-app x, uts type checking, and adjusted the checking algorithm from structure verification to name verification [Details](https://uniapp.dcloud.net.cn/uni-app-x/uts/type-compatibility.html)
* Language Server: Adjust uni-app x, uvue file code prompts to only prompt built-in components that support uni-app x.
* Language Server: Fixed the bug that the global event does not take effect when verifying the event type of uni-app x and uvue components.
* Language Server: Fixed a bug that caused the language service to crash when starting in some cases. [Details](https://ask.dcloud.net.cn/question/182739)
* Language Server: Fixed the bug that the replacement position of @rule was incorrect in some cases when prompting the code of less and scss files. [Details](https://ask.dcloud.net.cn/question/182353)
* Language Server: Fixed the bug that field nesting syntax is not supported when unicloud-db component code prompts
* uni-app: Fixed a bug that caused the Alipay applet to fail when pages.json had duplicate keys due to conditional compilation. [Details](https://ask.dcloud.net.cn/question/182610)
* uni-app: Fixed the bug that the uni-app cli project cannot run to the Alipay applet.
* uni-app: Fixed the bug that MacOSX uni-app, when running to the Alipay applet, is not compatible with the tool path of the old Alipay applet.
* Mobile App Playground: Fixed a bug that caused the dock to be installed repeatedly on some Android models due to incorrect installation time of the dock. [Details](https://ask.dcloud.net.cn/question/182690)
* Mobile App Playground: Fixed the bug that after running Android to a custom debugging base and then running the standard base to the iOS simulator, a failure to install the debugging base was reported.[Details](https://ask.dcloud.net.cn/question/181703)
* 5+ App: Fixed the bug that the toolbar run menu has more menu items such as run to Chrome
* uni-app: Optimize the permission visual interface of manifest.json
### uni-app plugin
* Mini Program Fixed onError invalid in the Vue3 project script setup. [Details](https://github.com/dcloudio/uni-app/issues/4276)
* Mini Program Fixed the bug that v-if is invalid when the slot content of the Vue3 project is a single root node. [Details](https://github.com/dcloudio/uni-app/issues/4486)
* Lark Mini Program Fixed the bug that Vue3 project scope slot does not display content. [Details](https://ask.dcloud.net.cn/question/181927)
* Alipay Mini Program Added component styleIsolation configuration, default value apply-shared. [Details](https://uniapp.dcloud.net.cn/collocation/manifest.html#mp-alipay)
* WEB Fixed the bug that the properties of multi-root node components are lost after the Vue3 CLi project is packaged. [Details](https://ask.dcloud.net.cn/question/182569)
* WEB Fixed the bug that the map component uses the fillColor and color properties of circles on the Gaode to set transparency invalidly. [Details](https://ask.dcloud.net.cn/question/159809)
* App Fixed the bug of nvue page error when vite.config.js configures target as esnext. [Details](https://ask.dcloud.net.cn/question/183180)
* WEB Added Vue3 project to support Baidu Maps. [Details](https://uniapp.dcloud.net.cn/collocation/manifest#h5sdkconfig)
* WEB, App-Vue Added radio component to support backgroundColor, borderColor, activeBackgroundColor, activeBorderColor, iconColor attributes. [Details](https://uniapp.dcloud.net.cn/component/radio.html#radio)
* WEB, App-Vue Added checkbox component to support backgroundColor, borderColor, activeBackgroundColor, activeBorderColor, iconColor attributes. [Details](https://uniapp.dcloud.net.cn/component/checkbox.html#checkbox)
### uni-app x plugin
* Added Vue support app.use register vue plugins [Details](https://uniapp.dcloud.net.cn/uni-app-x/vue/index.html#app-instance)
* Added Vue app.config.globalProperties register global properties [Details](https://uniapp.dcloud.net.cn/uni-app-x/vue/index.html#app-instance)
* Added Vue dynamic component [Details](https://uniapp.dcloud.net.cn/uni-app-x/vue/index.html#special-elements)
* Added Vue provide/inject for component communication [Details](https://uniapp.dcloud.net.cn/uni-app-x/vue/index.html#composition-options)
* Added Vue mixin [Details](https://uniapp.dcloud.net.cn/uni-app-x/vue/index.html#composition-options)
* Added Vue v-html [Details](https://uniapp.dcloud.net.cn/uni-app-x/component/index.html#directives)
* Added Vue v-once、v-memo、v-pre [Details](https://uniapp.dcloud.net.cn/uni-app-x/vue/index.html#directives)
* Added Vue $forceUpdate [Details](https://uniapp.dcloud.net.cn/uni-app-x/vue/index.html#component-instance)
* Added Vue support render function [Details](https://uniapp.dcloud.net.cn/uni-app-x/vue/index.html#rendering-options)
* Added global variable globalData [Details](https://uniapp.dcloud.net.cn/uni-app-x/collocation/app.html#globaldata)
* Added uni-cms client plugin uni-cms-article [Details](https://ext.dcloud.net.cn/plugin?id=11701)
* Fixed the bug where calling the route API in the onLaunch lifecycle of the application was abnormal
### uts plugin
* Fixed a bug where multiple destructuring statements could lead to compilation errors. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=217)
* Fixed a bug on the App-iOS platform where property override errors occurred when inheriting classes. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=207)
* Fixed a bug on the App-Android platform where UTSJSONObject object-defined methods couldn't be accessed via indexing. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=234)
* Fixed a bug on the App-Android platform where top-level variables, type attributes, class instance properties, and class static properties caused compilation errors when differentiated solely by the capitalization of the first letter. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=286)
### uniCloud plugin
* Added Qiniu cloud extend storage, better pricing and more flexible. [Details](https://uniapp.dcloud.net.cn/uniCloud/ext-storage/intro.html)
* Added The uni-app-x project supports uniIdRouter. [Details](https://uniapp.dcloud.net.cn/uniCloud/uni-id/summary.html#uni-id-router)
* Added Alipay Mini Program Cloud to support cloud function URL
* Added Alipay Mini Program Cloud supports running JQL files.
* Fixed the bug that Alipay Mini Program Cloud doc get is not compatible and the return value is null [Details](https://ask.dcloud.net.cn/question/182457)
* Fix the bug of incorrect results when querying objects in the Alipay Mini Program Cloud database where and match
* Fixed the bug where the failure reason is not displayed on the front end when uploading to Alipay Mini Program Cloud cloud storage fails.
* Fixed the bug that when the project has multiple cloud vendors, the uploaded cloud function identifies the wrong cloud vendor.
* Fixed the bug of "Upload Schema extension Js configuration" prompt "Please bind service space" in the right-click menu of database directory [Details](https://ask.dcloud.net.cn/question/182971)
* Fix the bug that when creating Schema, the existence of init_data.json with a large amount of data will cause it to not be downloaded correctly
* Fix the bug that uploading the uni-clientDB-actions file separately will overwrite the previously uploaded action [Details](https://ask.dcloud.net.cn/question/182598)
* Fixed the bug that when uploading cloud functions, creating schema, uploading/downloading verification functions, if you select skip in the pop-up window if they exist, all bugs will be skipped
* Fixed the bug in the initialization wizard deleting the db_init.json copy
* Fix the bug that Alipay Mini Program Cloud uni.getTempFileURL API returns only the file name
* Optimize the ability to switch service spaces of different cloud vendors when associating service spaces
  
## 3.98.2023112011-alpha
### HBuilder
* Fixed an issue where files opened in HBuilderX would occasionally not automatically refresh their content after being modified by an external program. [Details](https://ask.dcloud.net.cn/question/181222)
* Fixed a bug that caused MarkDown file rendering to be extremely slow on some MacOSX computers with built-in browsers
* Fixed the bug that conditional compilation codes such as `#ifdef` in ts language are not highlighted
* Language Server: Fixed the bug that the id cannot be transferred to the definition
* Language Server: Fixed the bug that id and class prompts were not sorted according to file reference relationships
* Language Server: Fixed a bug in windows file monitoring that prevented renaming and deleting files
* Language Server: Fixed the bug that the data type of v-slot:default is deduced incorrectly when the DB Schema table specified by the unicloud-db component has no attributes.
* Language Server: Fixed the bug that some Android system APIs in the uts plug-in are not compatible with kotlin
* Language Server: Added uts type verification error prompt to support internationalization
* Language Server: Fixed the bug in uni-app x where some vue types were incorrect causing syntax errors.
* Fixed the bug of non-uniCloud projects introduced in 3.97. After running, a uniCloud console is still opened.
* Fixed a Bug in 3.97 where a non-unicloud project would still open a uniCloud console after running.
* Mobile App Playground: Optimize the Android custom runtime, the version number is the same but the installation time is different, will not cover the installation Bug
* Mobile App Playground: Fixed a Bug where Android devices connected through the LAN did not support reverse proxy when running Times [Details](https://ask.dcloud.net.cn/question/181431)
### uni-app plugin
* Enhanced compile-time warnings for directories under `static` that are ignored for the current platform. [Details](https://uniapp.dcloud.net.cn/tutorial/platform.html#static)
* Fixed this bug of when a project use the uni ext API and cloud packaging is selected for both Android and iOS, the installation package does not correctly include the uni ext API plugin. [Details](https://ask.dcloud.net.cn/question/181295)
### uni-app x plugin
* Added sticky-section component, support sectional sticky[Details](https://uniapp.dcloud.net.cn/uni-app-x/component/sticky.html#sticky-section)
* Added uni-push API[Details](https://uniapp.dcloud.net.cn/uni-app-x/api/push.html)
* Added When the CSS position attribute is absolute, the margin attribute supports auto value
* Adjust uni.downloadFile API, the download directory adjust to uniDownloads directory at app's cache directory
* Fixed the bug on App-Android platform, some events callback of video component have no attribute values[Details](https://ask.dcloud.net.cn/question/180748)
* Fixed the bug on App-Android platform, the current attribute of swiper component may have no effect[Details](https://ask.dcloud.net.cn/question/181396)
* Fixed a bug where text component nesting may flash back when reusing component list-item
* Fixed a bug in the onLoad lifecycle call to uni.showLoading on the homepage caused by 3.97 that may crash
* Fixed the bug where using easycom component types in non-uvue pages error. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=177)
* Fix the bug that prevents the successful referencing of static resources from a non-static directory in the CSS code. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=231)
* Optimized Improved the compilation speed for projects with a substantial amount of CSS code.
### uts plugin
* Optimized Asynchronous functions run in the same thread as the framework by default when used in uni-app x
* Fixed the bug where the priority of bitwise operations was incorrect when used in combination.
* Fixed the bug on App-Android Array join return value is inconsistent with web
* Fixed the bug on the hooksClass related callbacks are repeatedly called when the custom dock is running on the real machine.
* Fixed a Bug that may affect App listing review due to the underlying reliance on uni-getDeviceInfo to read IDFA code after using uts plug-in for App-iOS platform
* Fixed the bug result of an operation involving Number may overflow as an integer
* Fixed the bug divisor of the division operation in which Number participates cannot be 0
### uniCloud plugin
* Added Alipay Mini Program Cloud Initialization Wizard
* Added uni-app-x now support alipay cloud as unicloud service provider
* Optimization: When creating a new schema/new schemajs based on a template, if the template is composed of multiple files, the user will be prompted which files to create.
* Optimization: When "Initializing Cloud Database", if a collection already exists in the cloud, a pop-up window will appear. The first collection in the pop-up window is not selected by default.
* Fixed the problem that after opening the db_init.json file, right-clicking "Initialize Database" in the editing area cannot be initialized.
* Fixed the issue where the uniCloud folder alias would not be updated after renaming the uniCloud folder
* Fixed the issue where the uni_modules directory does not exist in the project directory when uploading public modules, resulting in failure to upload
* Fixed The weixin mini program upload file to alipay cloud report an error
* Fixed the issue that the return value of the Alipay Mini Program cloud database update operation did not return the updated parameter

## 3.97.2023110504-alpha
### HBuilder
* Fixed the bug that the HBuilderX login window is not visible in some cases on the computer extension screen in Windows
* Fixed a bug introduced in 3.94 that caused wap2app project packaging failure due to plug-in path adjustment.
* Language Server: Fixed the bug that the imported path is incorrect when the uts system library code prompt triggers automatic package import.
* Language Server: Fixed the bug that the imported path is incorrect when the uts system library automatically repairs and imports packages.
* Language Server: Fixed the bug that after the file is deleted, the class and id code defined under the file will still be prompted.
* Language Server: Fix css code prompts. When the project is too large, some classes will not prompt.
* Language Server: Adjustment: Support string or number type assignment to the corresponding string or number literal union type during type verification.
* Language Server: Fix the bug of `uni.request({ "url" })` when typing the url code prompt and pressing Enter to complete the error bug.
* Markdown: Added Markdown preview to support simultaneous bidirectional scrolling of the editor and preview view
* Markdown: Newly added: When copying code and pasting it into the Markdown editor in the editor opened in HBuilderX, the code block in the corresponding language will be automatically wrapped.
* Fixed a bug that may cause a crash when quickly closing the editor when the editor variable is suspended
* Added support for automatically opening the project and entering preview mode when uni-app is run into the Alipay applet.
* Fixed the bug that the uniCloud initialization wizard cannot be used
* Fixed the bug that after uniCloud uploaded the first cloud function, there was no response when uploading it again.
* Fixed the bug that when uniCloud first runs the cloud function locally and then uploads the cloud function, the upload log will not be output to the console.
### uni-app plugin
* Fixed the bug where the target configuration in vite.config.js for Vue 3 projects was not affecting the renderjs. [Details](https://ask.dcloud.net.cn/question/180135)
* Fixed a bug when using uts for development, upgrading and updating the wgt may result in errors. [Details](https://ask.dcloud.net.cn/question/180309)
### uni-app x plugin
* Added Some API support interceptors [Details](https://uniapp.dcloud.net.cn/uni-app-x/api/interceptor.html)
* Added uni.setNavigationBarTitle [Details](https://uniapp.dcloud.net.cn/uni-app-x/api/set-navigation-bar-title.html)
* Added support for image and video components to use static resources from non-static directories as src.
* Added support for importing files with a .ts extension in uvue files, equivalent to .uts extension.
* Fixed the dynamically created root node loses its class styles
* Fixed wrapping the expression bound to v-model with parentheses results in a failure
* Fixed using the class to customize the root node style of another custom component within a custom component does not take effect
* Fixed a bug where changes made to UTSJSONObject defined in the data of uvue files did not trigger rendering.
* Fixed a bug where rendering was incorrect when the uvue page file name matched an easycom component.
### uts plugin
* App-Android native component definitions in uni-app x projects support returning values for external methods.
* Fixed a bug where on the App-Android and App-iOS platforms, if the same interface or class defined different properties, method calls would fail.
* Fixed a bug where developing uts plugins in a uni-app project under Vue 2 might not point to the source code.
* Fixed a bug related to bitwise assignment operators where the result was incorrect when the right-hand side was a complex expression.
### uniCloud plugin
* Added uniCloud now support alipay cloud as service provider
* Split `db_init.json` into collections. Each collection is described by schema.json, index.json, and init_data.json files [Details](https://uniapp.dcloud.net.cn/uniCloud/hellodb.html#init-db)

## 3.94.2023102311-alpha
* Fixed the bug caused by 3.91-alpha. When switching themes, click on a file to open. If the file has been opened before, the theme will not switch normally.
* Language Server: Fixed uni.getElementById(""), the parameter cannot be prompted and transferred to the definition bug
* Language Server: Fixed the bug of unused variables being falsely reported during syntax verification in uvue files and optional API internal scopes.
* Language Server: Fixed the easycom component label. If the component suffix is uvue, it cannot go to the defined bug.
* Language Server: Fixed the undefined bug when using Element and ComponentPublicInterface types in uni-app x project.
* Language Server: Fixed the language service and missing bugs in some iOS system library APIs
* Language Server: Fixed the bug caused by 3.93-alpha in the uni-app project. When pages.json has a syntax error, the vue file will falsely report an error.
* Fixed the bug of `undefined base location not found` reported when running uni-app x project on real machine in some cases
### uni-app plugin
* Fixed when there are multiple root nodes, uni.getElementById fails to retrieve

## 3.93.2023101913-alpha
### HBuilder
* Fixed a bug that required multiple undoes to restore after formatting the Markdown table
* Language Server: Fixed the bug of not prompting for path when referencing uts plug-in and being unable to define the path to the definition
* Language Server: Fixed the bug of not prompting the uts plug-in to export content after referencing the uts plug-in.
* Fixed a bug that caused the file synchronization to fail when the file path under the project contained special characters caused by version 3.91 of the App running on a real machine.
* Fixed the bug in 5+ projects that when modifying js, css, pictures and other files, the pages that reference these resources will not be automatically refreshed.
* Adjust uni-app manifest.json uni-app and 5+ projects Adjust Android platform support CPU type Default value is `arm64-v8a`
* Added uni-app x project to support uniCloud debugging
* Added uni-app x running configuration to support setting kotlin compiler memory parameters
* Fixed the bug that the uni_modules plug-in upload plug-in does not have uni-app x related categories
### uni-app plugin
* Weixin Mini Program Fixed subscrip component attribute is invalid [Details](https://ask.dcloud.net.cn/question/178893)
* Alipay Mini Program Fixed lottie component attribute is invalid [Details](https://github.com/dcloudio/uni-app/issues/4510)
* TikTok Mini Program Fixed Vue2 project refs invalid in TikTok App 27.2.0 [Details](https://github.com/dcloudio/uni-app/pull/4555)
* Optimize uni.getElementById Support generics
* App-Android fixed uni-app-x project list-view component where the positions of some child nodes are abnormal in certain cases
* Fixed when a ref-bound node is removed, the $refs data is not updated
### App plugin (5+ App & uni-app)
* Android Adjustment The default supported CPU type is arm64-v8a [Details](https://uniapp.dcloud.net.cn/tutorial/app-android-abifilters.html#default)
### uts plugin
* App-Android Updated await supports it with Promise [Details](https://uniapp.dcloud.net.cn/uts/operator.html#await)
### uniCloud plugin
* Update Aliyun The maximum timeout period for function excution has been adjusted from 60 seconds to 120 seconds

## 3.92.2023101106-alpha
### HBuilder
* Fixed the bug of flickering in Markdown image floating preview
* Fixed the bug of falsely reporting a format error when the .editorconfig file contains extended setting items.
* Language Server: Fixed the bug of false reporting in uvue files and optional API props
* Language Server: Fixed uni-app x, conditional compilation, duplicate prompts and incorrect content bugs
* Fixed the bug that caused HBuilderX to crash when the ${} special mark appeared in the update log when uploading the uni_modules plug-in to the plug-in market.
* Fixed the bug that when uni-app creates a new page, the indentation and line breaks of the page when inserted into pages.json are inconsistent with the current editor settings.
* Fixed the bug of uni-app manifest.json crashing occasionally when clicking on certain elements
### uni-app plugin
* App Fixed Cloud packaging Storage related interface settings and content acquisition exceptions. [Details](https://github.com/dcloudio/uni-app/issues/4556)
* App-Android fixed uni-app-x project onLoad lifecycle calls route API interaction exception.
* App-Android fixed uni-app-x project calling uni.switchTab on a non-tabBar home page causes the application to crash.
### App plugin (5+ App & uni-app)
* Android Update the Google Analytics for Firebase SDK to 21.3.0; Update the Firebase Cloud Push SDK to 23.2.1
### uniCloud plugin
* Fixed Invoke uniCloud api report an error when running uni-app-x project on android 6.0

## 3.91.2023092719-alpha
### HBuilder
* Added uni-app-x, no longer using js and webview, compiled into a pure native App, currently only supports Android. [Details](https://uniapp.dcloud.net.cn/uni-app-x/)
* Added HBuilderX version upgrade to support differential updates and improve update speed
* Added HBuilderX support for search setting items (shortcut key: `Alt+Shift+,`)
* Fixed the bug of switching the console back and forth in the menu [View], and then pressing `Alt+Tab`, a new blank console without title will appear.
* Added new project manager, mouse drag and drop to move files, added confirmation pop-up window
* Optimize the performance of large character replacement operations
* Optimize the operation performance of large files and comment thousands of lines of code
* Fixed MacOSX In some cases, HBuilderX crashes when clicking on the top view or help menu
* Fixed multi-file character search, activate the search view for the first time, the search input box does not automatically focus the bug
* Fixed the bug of incorrect indentation of conditional compilation after formatting when writing conditional compilation in template area of vue/uvue file.
* Fixed the bug that when formatting a TS file and selecting an area for formatting, the formatting result may be incorrect when the selected area is smaller than one line.
* Fixed the bug that the HBuilderX plugin-manager Node process cannot exit under certain circumstances
* Fixed the bug of slow device list refresh in the Android device selection window when the App is run on a real device
* Fixed the bug in the Android device selection window when the App is running on a real device. Under Windows, the phone list sometimes displays abnormal data.
* Added uni-app manifest.json App module configuration, Facebook login, added configuration item client_token
* Fixed the bug in uni-app manifest.json, App module configuration->Positioning->Amap positioning, only check Android and verify appkey_ios
### uni-app plugin
* Added Conditional compilation provides universion to distinguish the compiler version. Can be used for plug-in to adapt to different versions of uni-app [Details](https://uniapp.dcloud.net.cn/tutorial/platform.html#uniVersion)
* Added Conditional compilation static directory supports APP and Web sub -directory [Details](https://uniapp.dcloud.net.cn/tutorial/platform.html#static)
* App-Android Fixed uni.downloadFile download wgt files may not have a file suffix [Details](https://ask.dcloud.net.cn/question/176447)
* App-iOS Fixed When the app language is set to English, the nvue map component still displays Chinese [Details](https://ask.dcloud.net.cn/question/178833)
### uts plugin
* Fixed When the for loop contains complex Continue and Break, the execution is incorrect
* Fixed Unable to access external definitions in the class definition of internal attributes and methods of the same name
### App plugin (5+ App & uni-app)
* Android Update Facebook Login SDK to version 16.1.3, resolve sign-in exceptions [Details](https://ask.dcloud.net.cn/question/175402)
### uniCloud plugin
* Added Some interfaces support calls in uni-app x projects [Details](https://uniapp.dcloud.net.cn/uni-app-x/unicloud/)

## 3.8.12.20230802-alpha
### HBuilder
* Fixed the bug that in some cases, after HBuilderX exits, some node processes cannot exit correctly with 100% CPU
* Fixed multi-file search After specifying the search range, switching the editor tab causes the bug that the search range changes
* Fixed single-line comments, when the cursor is at the beginning of the line, the bug that the anti-comment does not take effect
* Language Server: Fixed the bug that the code prompt of the file in the uniCloud directory is slow in some cases
* Language Server: Fixed the bug that the js error in the vue file is incorrect after the js grammar check is turned on
* Language Server: Fixed the bug that the uni-app project cannot recognize the pinia module
* Language Server: Fixed the bug that the built-in module `(eg: @dcloudio/uni-app)` will not be prompted when the module name of the uni-app project is prompted
* Language Server: Fixed the bug that the occasional outline of vue and html files does not take effect
* Language Server: Fixed the html file, some template syntax may cause the bug that the code cannot be prompted
* Fixed the bug that when the uni-app is running on a real machine, unplug the phone and plug it in again, re-running will cause repeated console logs and multiple compilation processes
* Fixed the bug that the `Restart Application` button in the console toolbar does not take effect after being clicked in some cases when the uni-app is running on a real machine
* Added conditional compilation support for the "static" directory in uni-app projects for "app" and "web" directories. [Details](https://uniapp.dcloud.net.cn/tutorial/platform.html#static)
* Added conditional compilation support for uni-app projects, providing "uniVersion" to distinguish compiler versions. [Details](https://uniapp.dcloud.net.cn/tutorial/platform.html#uniVersion)
### uni-app plugin
* uts plugin App-Android Added support Promise [Details](https://uniapp.dcloud.net.cn/uts/buildin-object-api/promise.html)
### uniCloud plugin
* Adjust uni-ai The Baidu LLM api s adjusted to [wenxin workshop](https://cloud.baidu.com/doc/WENXINWORKSHOP/s/jlil56u11)
* Added uni-map-common A common module for aggregating cloud capabilities from multiple map providers [Details](https://uniapp.dcloud.net.cn/uniCloud/uni-map-common.html)
* Added unicloud-map The cloud integrated component is mainly used to display custom POIs in the database and render them on the map [Details](https://uniapp.dcloud.net.cn/uniCloud/unicloud-map.html)
* Added unicloud-map Map management plugin, providing POI management, which can visually mark POIs on the management side [Details](https://uniapp.dcloud.net.cn/uniCloud/unicloud-map-admin.html)
* Added unicloud-city-select City selection component, making it convenient for users to quickly select the components of the target city in the application [Details](https://uniapp.dcloud.net.cn/uniCloud/unicloud-city-select.html)
### App plugin (5+ App & uni-app)
* Android Adapts to support Android 14
* Android Update the cloud packaging compileSdkVersion to 33

## 3.8.11.20230719-alpha
### HBuilder
* Language Server: Fixed the bug that there is no code hint in the vue/nvue file tag event

## 3.8.10.20230714-alpha
### HBuilder
* Language Server: JS, TS supports automatic repair of error checking
* Language Server: Fixed the bug that this in the Vue arrow function cannot access the vue instance
* Language Server: Fixed the bug that Vue API description internationalization fails
* Language Server: Fixed the bug that the text in the floating frame does not support copying by `ctrl + c`
* Added support to type `/**` on the ts method to automatically extract method parameter information to tsdoc
* Fixed the bug that the editor floating frame occasionally floats to other application windows
* Fixed code assistant, the bug that the next page button is still not grayed out when the list cannot be turned to the next page in some cases
* Fixed uni-app manifest.json uncheck the Push module, the bug that the push code will still be compiled in when exporting wgt
### uni-app plugin
* App-iOS Fixed The tabBar styles are abnormal when using font icons [Details](https://ask.dcloud.net.cn/question/173375)
* Douyin Added Support for running to specified pages
### uniCloud plugin
* Added The parameter of Aliyun timing triggered function is align with Tencent cloud function [Details](https://uniapp.dcloud.net.cn/uniCloud/trigger.html#trigger-param)
* Added The _timing function of cloudobject add input parameters [Details](https://uniapp.dcloud.net.cn/uniCloud/trigger.html#cloudobject)
* Added uni-ai supports calling the iFly spark model through the developer's own key [Details](https://uniapp.dcloud.net.cn/uniCloud/uni-ai.html#get-llm-manager)
* Added Http request method uniCloud.request is available [Details](https://uniapp.dcloud.net.cn/uniCloud/cf-functions.html#unicloud-request)
* Added Websocket client method uniCloud.connectSocket is available [Details](https://uniapp.dcloud.net.cn/uniCloud/cf-functions.html#websocket-client)
### App plugin (5+ App & uni-app)
* Android Fixed The default language of the permission denied prompt text on the QR code scanning interface is incorrect [Details](https://ask.dcloud.net.cn/question/174032)
* iOS Fixed After update with wgt, installing the app without removing it cause white screen [Details](https://ask.dcloud.net.cn/question/163393)

## ReleaseNote
[https://update.dcloud.net.cn/hbuilderx/changelog/ReleaseNote_alpha_archive_en_2023.html](https://update.dcloud.net.cn/hbuilderx/changelog/ReleaseNote_alpha_archive_en_2023.html)