# HBuilder X - Release Notes
======================================
## 5.07.2026041006
### HBuilder
* Fixed the issue where the iOS icon for the Uni-app package did not take effect caused by version 5.0. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=27902)

## 5.06.2026033105
### HBuilder
* Fixed some bugs

## 5.05.2026032417
### HBuilder
* Fixed the issue where the language service displays incorrect hover results when custom components have the same name as built-in components [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=27507)

## 5.04.2026031801
### HBuilder
- Fixed an issue introduced in v5.0 where the window position was incorrect when using keyboard shortcuts to switch files/views. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=27247)  
- Fixed a performance regression introduced in v5.0 that caused slow code completion in Language Services. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=27139)  
- **Windows:** Fixed an issue introduced in v5.03 where HTML tag `class` attribute completion/IntelliSense was incorrect when multiple class values were present. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=27097)  
- **Windows:** Fixed an issue where opening `uni-agent` in certain cases (e.g., under restricted directories like `C:\Program Files`) could fail to load due to insufficient read/write permissions. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=27185)

## 5.03.2026031210
### HBuilder
* [Important] Added uni-agent. AI programming assistant for uni-app (x) (entry point in HBuilderX top-right corner AI) [Documentation](https://hx.dcloud.net.cn/Tutorial/AI/uni-agent) <https://issues.dcloud.net.cn/pages/issues/detail?id=26435>
* [Important] Added Copilot for HBuilder plugin. Supports AI code completion [Documentation](https://hx.dcloud.net.cn/Tutorial/AI/github-copilot) <https://issues.dcloud.net.cn/pages/issues/detail?id=24781>
* Added uni-app (x) running via `CLI launch` command, facilitating AI automatic problem fixing [Documentation](https://hx.dcloud.net.cn/cli/launch-app) <https://issues.dcloud.net.cn/pages/issues/detail?id=24793>
* Added uni-app (x) running via `CLI launch` command, supports running to specified pages [Documentation](https://hx.dcloud.net.cn/cli/launch-app) <https://issues.dcloud.net.cn/pages/issues/detail?id=26399>
* Added uni-app x running via `CLI screencap` command for screenshots, facilitating AI automatic problem fixing [Documentation](https://hx.dcloud.net.cn/cli/screencap-app) <https://issues.dcloud.net.cn/pages/issues/detail?id=26397>
* Added command(workbench.action.autoUpdate) support for users to configure keyboard shortcuts for automatic updates [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=26043)
* Fixed Windows platform issue where showQuickPick dialog auto-closes after clicking a button without triggering button callback [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=26605)
* Fixed issue where pressing Enter in textEditor within showFormDialog closes the entire dialog, preventing normal line breaks [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=26603)
* Fixed Windows platform issue where search input box in top toolbar search dropdown doesn't auto-focus when clicking character search (multiple files) [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=21247)
* Fixed markdown file issue where certain syntax with kotlin syntax highlighting plugin causes incorrect character coloring after kotlin words [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=21568)
* Fixed markdown file issue where uvue code blocks lack highlighting [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=26341)
* Fixed macOS platform issue where tooltip in bottom console is unclear under cool black and elegant blue themes [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=20959)
* Fixed Windows platform issue where installation path with special characters causes abnormal theme style display [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=26353)
* Fixed plugin debugging issue where switching active breakpoints causes UI state and actual debug state mismatch [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=21306)
* Fixed single-project window (multi-window) issue that causes project confusion in certain situations [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=23011)
* Fixed debug view UI out-of-sync issue, call stack node click doesn't highlight breakpoint jump, sometimes highlight not cleared after exiting debug [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=24773)
* Fixed Windows plugin issue introduced in version 3.87 where plugins using font files fail to uninstall [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=24783)
* Fixed built-in file system issue where switching to large icons causes icon following when moving mouse after clicking a file, long mouse movement causes program crash [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=24868)
* Fixed plugin registered shortcuts sometimes not working [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=25346)
* Fixed user login switch issue where incorrect password occasionally causes duplicate login page popups [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=26041)
* Fixed version 4.81 issue where selecting link text in console triggers link jump, causing unexpected content in clipboard copy [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=25094)
* Fixed project manager issue where using Esc to cancel folder rename causes current position collapse/expand to fail [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=23070)
* Fixed issue where after expanding Jump->Bookmarks submenu, F2 rename in left resource manager becomes ineffective [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=25854)
* Fixed multi-file search issue where search results cannot be replaced with empty [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=24792)
* Fixed Windows multi-file search issue where results don't update timely after replacement [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=24794)
* Fixed Windows multi-file search issue where replacement text error pops up consistency prompt [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=24796)
* Fixed Windows multi-file search issue where Dirty files have duplicate search results [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=24802)
* Fixed issue where viewing local history of open files shows history of other files with same name but different type [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=21079)
* Fixed multi-cursor selection issue where mini map causes multi-cursor selection cancel to fail at certain left positions [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=23065)
* Fixed code highlighting issue where folding code block with conditional compilation grayed out shows abnormal highlighting in hover preview [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=23021)
* Fixed code highlighting issue where conditional compilation parentheses have incorrect coloring [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=25443)
* Fixed code highlighting issue where js, ts, uts files lack partial syntax highlighting under cool black theme [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=26037)
* Fixed code highlighting issue where vue file v-bind shorthand syntax causes incorrect syntax highlighting [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=23004)
* Language Server: Fixed version 4.66 issue where px to rpx completion items no longer show hints. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=24340)
* Language Server: Added support for externalClasses in uni-app x projects. [Documentation](https://doc.dcloud.net.cn/uni-app-x/css/common/style-isolation.html#external-class) <https://issues.dcloud.net.cn/pages/issues/detail?id=25784>
* Language Server: Added support for conditional compilation in UTS plugin root path files. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=20869)
* Language Server: Added support for native file mixed compilation syntax hints for UTS plugin Harmony platform. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=21727)
* Language Server: Added support for conditional compilation in UTS plugin development environment. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=22069)
* Language Server: Fixed UTS plugin package name conditional compilation not compatible with app-js platform causing errors. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=21886)
* Language Server: Fixed platform compatibility display is incorrect. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=22520)
* Language Server: Fixed hovering over conditional compilation comment text shows conditional compilation grayed out hint. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=22739)
* Language Server: Added support for easycom components with withDefault+defineProps to set default values. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=22763)
* Language Server: Added support for vue slots. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=23696)
* Language Server: Added support for Harmony platform steam mode to reference C++ files. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=24390)
* Language Server: Fixed component bool type property completion results are incorrect. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=22771)
* Language Server: Fixed css property value hover results are incorrect. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=23511)
* Language Server: Fixed uni-app x project HTML files cannot show DOM API hints. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=21429)
* Language Server: Fixed special value domain String lacks CSSString. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=22425)
* Language Server: Fixed in certain situations project cannot be deleted. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=22526)
* Language Server: Fixed pages.json subPackages root and path lack code hints. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=22864)
* Language Server: Fixed vue comment in specific syntax line is incorrect. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=25894)
* Fixed built-in browser issue where macOS platform deep theme causes white screen flash when opening built-in browser [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=26039)
* Fixed built-in browser issue where externally dragged files auto-open content [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=26042)
* Fixed built-in browser issue where right-click menu copy, paste, inspect element don't show after first display, subsequent right-click menu items don't appear [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=26045)
* Added AI plugin uni-app x Android memory leak automatic analysis feature [Documentation](https://ext.dcloud.net.cn/plugin?id=23720) <https://issues.dcloud.net.cn/pages/issues/detail?id=24785>
* Fixed visual configuration issue where multiple Associated Domains fail to display after configuration [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=25448)
* Fixed version 4.84 issue where new page window auto-caches all template files [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=26038)
* Added uni-app (x) pages.json page filtering for quick running to specified pages [Documentation](https://uniapp.dcloud.net.cn/tutorial/run/pages-json-filter.html) <https://issues.dcloud.net.cn/pages/issues/detail?id=25453>
* Added uni-app (x) new page cloud integration series built-in template support for uni_modules type [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=26040)
* Fixed uni-app x project manifest.json issue where non-source view cannot respond to view switching and tab switching [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=24780)
* Added uni-app (x) run/release feature to add project directory to antivirus software monitoring exclusion list [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=26400)
* Fixed run menu item order adjustment to place Alipay mini program after WeChat mini program [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=26044)
* Fixed version 4.83.2025101713-alpha Harmony platform hot update issue that may cause white screen [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=22570)
* Fixed App real device running issue where version 4.84 causes Android uts debug breakpoints to not work [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=24799)
* Fixed uniCloud issue where associating service space shows "service space does not exist" [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=23596&ask_id=215483)
* Fixed uniCloud issue where version 4.87 causes "missing appid, please set appid in manifest.json" after creating uniCloud project [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=24935)
* Fixed uniCloud issue where version 4.76 cannot download all public modules [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=25160)
* Fixed uniCloud issue where schema2code generated code cannot be generated to associated projects, only current project, and operation dialog pops up twice each generation [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=25576)
* Added uni_modules plugin CLI mode supplement, platform compatibility adds Xiaohongshu mini program platform [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=25850)

## 4.87.2025121004
### HBuilder
* Added support for running uni-app (x) and obtaining runtime logs via the `CLI logcat` command, facilitating AI access to runtime logs for automatic problem fixing. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=22250)
* Fixed an issue in version 4.84 where the app couldn't run on the iOS 26 simulator under certain circumstances. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=23348)

## 4.85.2025110510
### HBuilder
* Fixed an issue in version 4.84 where the right-click menu for the project's uniCloud directory lacked options such as "Create Cloud Object". [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=22993&ask_id=214980)
* Fixed an issue in version 4.84 in uni-app(x) projects where, after creating a new page under a subpackage and unchecking the "Register in pages.json" option, the selected file location and subpackage did not match when clicking "Create". [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=22990)
* Fixed an issue where uni-app (x) projects were not automatically imported when running on certain versions of WeChat Developer Tools for WeChat Mini Programs.[Details](https://issues.dcloud.net.cn/pages/issues/detail?id=22962)

## 4.84.2025110307
### HBuilder
* Added HBuilder support for the macOS 26 icon style.[Details](https://issues.dcloud.net.cn/pages/issues/detail?id=22025)
* Added a restart function to the HBuilder main menu. Menu location: 【File】-【Restart】 [Doc](https://issues.dcloud.net.cn/pages/issues/detail?id=20854) <https://issues.dcloud.net.cn/pages/issues/detail?id=20854>
* Added HBuilder core plugin version validation to ensure that the plugin version matches the HBuilder version. [Doc](https://issues.dcloud.net.cn/pages/issues/detail?id=20862) <https://issues.dcloud.net.cn/pages/issues/detail?id=20862>
* Fixed the issue where the console automatically scrolls to the bottom when new content is output while scrolling up to view logs. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=20331)
* Fixed an issue where the breakpoint position did not match the expected location when double-clicking the line number to set a breakpoint. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=20823)
* Fixed the issue where saving a file in UTF-8(BOM) encoding in version 4.66 resulted in blank file content. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=21373)
* Fixed an issue where editing a file already open in HBuilder from another software might occasionally cause HBuilder to crash in version 4.73. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=20825)
* Fixed an issue where the console search could cause crashes under certain circumstances in version 4.61. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=20826)
* Fixed incorrect font size in the left-side explorer under specific scenarios. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=21030)
* Fixed incorrect outline font size in specific scenarios. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=21169)
* Fixed the issue where pressing the Enter key in the pages.json text box of uni-app (x) when creating a new page resulted in the insertion of \r and \t characters in the merged pages.json file, causing syntax errors.[Details](https://issues.dcloud.net.cn/pages/issues/detail?id=17766)
* Fixed the issue in version 4.57 where new pages in uni-app (x) could not be created in subfolders of subpackages. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=17947)
* Fixed potential software crash issues when creating new pages in uni-app (x). [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=19888)
* Fixed an issue in uni-app (x) where deleting a page and clicking the status bar to sync to pages.json, then navigating to the pages.json editor, could cause the application to crash. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=20936)
* Multi-file search: Fixed performance and stability optimization. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=18860)
* Multi-file search: Fixed conflict between search result highlighting and current file search result highlighting. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=20839)
* Multi-file search: Fixed issue where no document change prompt appears when continuing to edit the document after search completion and then replacing text. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=20840)
* Multi-file search: Fixed Input fields are editable when in the current directory and when opening a directory. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=20841)
* Multi-file search: Fixed issue where clicking replace directly without initiating a search resulted in no response or prompt. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=20842)
* Multi-file search: Fixed incomplete character search history logging in the compiler. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=21184)
* Multi-file search: Fixed misalignment in file search when UTF8 encoding includes a BOM header. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=21244)
* Multi-file search: Fixed the issue where search history disappears after restarting the IDE on the Windows platform. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=21500)
* Fixed issue with table paste functionality in macOS Markdown files. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=16419)
* Fixed garbled text when entering content after pressing Tab to switch to an unordered list in Markdown files under specific scenarios. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=20689)
* Fixed issue where uncommenting does not take effect in specific scenarios in CSS files. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=21178)
* Fixed incorrect selection area during intelligent double-click on labels in specific scenarios. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=18702)
* Fixed an issue in version 4.03 where the editor did not automatically close open files after their parent directories were deleted. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=19394)
* Language Server: Added support for automatic display of platform compatibility for system APIs. [Doc](https://hx.dcloud.net.cn/Tutorial/Language/jsdoc?id=uniplatform) <https://issues.dcloud.net.cn/pages/issues/detail?id=18641>
* Language Server: Added UTS plugin HarmonyOS platform support for HAR package parsing, with features such as code hints after import. [Doc](https://doc.dcloud.net.cn/uni-app-x/plugin/uts-for-harmony.html#%E9%85%8D%E7%BD%AEuts%E6%8F%92%E4%BB%B6%E4%BE%9D%E8%B5%96) <https://issues.dcloud.net.cn/pages/issues/detail?id=20861>
* Language Server: Fixed Occasionally, clicking to jump to a definition does not respond when multiple "Go to Definition" items are present. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=20793)
* Language Server: Fixed missing data when converting JSON to type in certain code patterns. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=19806)
* Language Server: Fixed error at the reference location after closing the referenced Vue file. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=19992)
* Language Server: Fixed unresponsive language service after repeatedly triggering \"Go to Definition\". [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=20694)
* Language Server: Fixed the validation logic for IDs and classes, now only validating that defined IDs or classes are not used. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=20843)
* Language Server: Fixed issue where uni-app(x) projects referencing UTS plugins did not support conditional compilation for platform differentiation. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=20853)
* Language Server: Fixed issue where conditional compilation graying in uni-app x does not support uniVersion, VUE2, and VUE3. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=20864)
* Language Server: Fixed issue where language service cache resources were not being cleaned up upon HBuilder exit in specific scenarios. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=21179)
* Language Server: Fixed issue where assigning a string type to a union type in UTS files caused red error highlighting. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=20846)
* Language Server: Fixed error when assigning optional parameters to union types in UTS files. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=20847)
* Language Server: Fixed issue where assigning a string value to a UTSJSONObject property that is null causes a red error highlight. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=20850)
* Language Server: Fixed an error when using decorators in the root directory of the utssdk for uts files. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=20868)
* Language Server: Fixed error when adding @override to methods within anonymous classes in UTS files. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=20873)
* Language Server: Fixed an error where required parameters were placed after optional parameters in UTS files. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=20874)
* Language Server: Fixed an issue where the UTS plugin on the iOS platform reported an error for not finding the `contains` property when using `String.contains`. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=20875)
* Language Server: Fixed incorrect validation of vueModifier during tag validation in Vue files. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=19669)
* Language Server: Fixed false positive yellow warnings for attribute definition syntax in scoped slot validation of Vue files. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=19713)
* Language Server: Fixed issue where variables defined under `defineMixin` in a `.uvue` file could not be found in the template. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=20852)
* Language Server: Fixed error when assigning array types and arrays of type 'any' under props in uvue files. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=20855)
* Language Server: Fixed an issue where assigning values to variables under the data section of a uvue file would result in an error if the types were inconsistent.[Details](https://issues.dcloud.net.cn/pages/issues/detail?id=20858)
* Language Server: Fixed error when using any property of an empty object defined under data in a uvue file within the template. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=20867)
* Language Server: Fixed false error reporting for properties and methods when using multi-level nested mixins in uvue files. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=20871)
* Language Server: Fixed issue where template area completion hints were unavailable when computed return values in uvue files contained `this`. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=20876)
* Language Server: Fixed issue where computed properties in uvue files do not support setter and getter methods. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=21128)
* Language Server: Fixed incorrect auto-import path for referenced Vue files in uni-app(x) projects. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=21459)
* Fixed AI Repair When the pop-up prompts to download a plugin after clicking the repair link, text selection occurs when the mouse hovers over the console after canceling the plugin download. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=20116)
* Fixed AI repair issues caused by version 4.72, where HBuilder crashes during the repair process under certain circumstances. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=20838)
* Fixed AI repair caused by version 4.72: No code coloring for new content in the comparison interface. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=20883)
* Fixed Linux HBuilder CLI login error for overseas accounts. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=17471)
* Fixed the built-in browser in Vue3 CLI project that cannot be closed. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=21471)
* manifest.json: Added support for visual configuration of WeChat login and WeChat sharing in 【HarmonyOS App Configuration】. [Doc](https://uniapp.dcloud.net.cn/collocation/manifest.html#app-harmony) <https://issues.dcloud.net.cn/pages/issues/detail?id=19316>
* manifest.json: Added uni-app x Android platform now supports configuring dark mode colors for the splash screen background. [Doc](https://issues.dcloud.net.cn/pages/issues/detail?id=19668) <https://issues.dcloud.net.cn/pages/issues/detail?id=19668>
* manifest.json: Added support for certificate configuration for HarmonyOS Meta Services in manifest.json. [Doc](https://uniapp.dcloud.net.cn/collocation/manifest.html#mp-harmony) <https://issues.dcloud.net.cn/pages/issues/detail?id=19805>
* manifest.json: Added uni-app x Android platform optional module configuration uni-push. [Doc](https://issues.dcloud.net.cn/pages/issues/detail?id=18885) <https://issues.dcloud.net.cn/pages/issues/detail?id=20860>
* manifest.json: Added optional module configuration for uni-barcode-scanning on the uni-app x Android platform. [Doc](https://issues.dcloud.net.cn/pages/issues/detail?id=18903) <https://issues.dcloud.net.cn/pages/issues/detail?id=20865>
* manifest.json: Added support for visual configuration of the Huawei Login client_id in the HarmonyOS App configuration. [Doc](https://uniapp.dcloud.net.cn/collocation/manifest.html#app-harmony) <https://issues.dcloud.net.cn/pages/issues/detail?id=20974>
* manifest.json: Fixed issue where HTTPS was enabled by default in the visualization settings, even though it was not configured in the web settings. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=19743)
* manifest.json: Fixed issue where setting initPrivacyAuthorization to disagree in manifest.json configuration was ineffective in version 4.71. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=20236)
* manifest.json: Fixed editor crash after selecting a plugin in manifest.json visualization -> native plugin configuration. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=22042)
* Mobile App Playground: Added a Bug reporting feature for uni-app x compilation and runtime errors. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=20878)
* Mobile App Playground: Added support for running on Android with automatic detection of memory leaks, displaying data in the runtime console. [Doc](https://issues.dcloud.net.cn/pages/issues/detail?id=18528) <https://issues.dcloud.net.cn/pages/issues/detail?id=18528>
* Mobile App Playground: Fixed issue where debugging could not be used when running on Android while Android Studio was open. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=21181)
* Mobile App Playground: Fixed issue where app fails to auto-start on iOS 17+ systems. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=21183)
* Mobile App Playground: Added assembly of Weixin configuration from manifest.json into the HarmonyOS project during the build and packaging process for the HarmonyOS platform. [Doc](https://uniapp.dcloud.net.cn/collocation/manifest.html#app-harmony) <https://issues.dcloud.net.cn/pages/issues/detail?id=19315>
* Mobile App Playground: Added integration of HarmonyOS Hot Reload capability to enable hot reloading. [Doc](https://uniapp.dcloud.net.cn/tutorial/harmony/runbuild.html#hot-reload) <https://issues.dcloud.net.cn/pages/issues/detail?id=20972>
* Mobile App Playground: Added hot update capability for integrated HarmonyOS atomic services. [Doc](https://uniapp.dcloud.net.cn/tutorial/mp-harmony/intro.html#ascf-serve) <https://issues.dcloud.net.cn/pages/issues/detail?id=20980>
* Mobile App Playground: Fixed an issue in the Uni-App X HarmonyOS platform debug mode where the app might crash if expressions are present in the watch area. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=21171)
* Mobile App Playground: Added support for native hybrid compilation and debugging for iOS. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=19433)
* Mobile App Playground: Added support for breakpoint debugging on iOS 17+ systems. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=21182)
* Mobile App Playground: Fixed the bug where the debug process did not exit after iOS debugging was stopped. debug process did not exit after stopping iOS debugging. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=20172)
* Mobile App Playground: Fixed failure to install the debug base when running on the iOS 26 simulator. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=21734)
* Fixed an issue where submitting an App cloud build for uni-app had a certain probability of causing HBuilder to crash. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=20851)
* Added App Cloud Packaging for uni-app (x): New AppLovin Channel for Overseas Ads. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=20877)
* Fixed issue where the "Build Custom Debug Base" option in the App cloud packaging interface was not automatically checked when selecting "Run to Phone or Emulator" → "Build Custom Base" during the "Run" process. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=19745)
* Added support for CLI packaging of HarmonyOS atomic services. [Doc](https://hx.dcloud.net.cn/cli/pack-mp-harmony) <https://issues.dcloud.net.cn/pages/issues/detail?id=21467>
* Fixed automatic deletion of resource fork files in HarmonyOS project directories on non-mac file systems to prevent HarmonyOS toolchain execution exceptions. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=20975)
* Fixed the issue where the application runs normally during development but reports "unpackage\dist\build\app-harmony\libs\UniAppRuntime.har does not exist" during the build process. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=21877)
* Fixed the bug where the cloud platform compatibility option in the uni_modules plugin was incorrectly selected by default. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=20781)
* Added support for uni_modules UTS API plugins and standard mode components for the HarmonyOS platform. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=21997)


## 4.76.2025082103
### HBuilder
* Language Server: Fixed a bug introduced in version 4.66 where code suggestions for CSS classes were very slow when there were many classes in the project. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=19456&ask_id=211211)
* Fixed a bug introduced in version 4.64 where packaging would fail after modifying the version number. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=18447)
* Fixed an issue where uni-app (x) would incorrectly report that Gradle is not an executable on the Android platform, even when Gradle is properly configured. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=19938)
* uniCloud: Fixed a bug where changes to cloud function code under uni_modules would not be updated in real time when running a uniapp CLI project locally with uniCloud. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=19772)
* uniCloud: Fixed an issue where enabling IP rate limiting during local debugging with uniCloud caused slow response times for local cloud functions. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=19867)
### uniCloud
* Added support for batch updates and deletions in extended database transactions. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=19497)
* Add support for the `uniCloud.getTempFileURL` method to retrieve private file URLs in the Aliyun service space. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=19497)
* Fixed a bug in the Aliyun service space where using the `get` method for JQL permission control caused an error. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=19395&ask_id=210972)

## 4.75.2025071105
### HBuilder
* Add AI Fix for uni-app x: When running on Android/iOS platforms, compilation errors can be automatically fixed through AI [Details](https://doc.dcloud.net.cn/uni-app-x/tutorial/bug_repair.html)
* Added Linux cli [Details](https://hx.dcloud.net.cn/Tutorial/install/linux-cli)
* Language Server: Added support for symbol renaming. [Details](https://hx.dcloud.net.cn/Tutorial/Language/refactor)
* Fixed a bug where HBuilderX would crash when closing an editor tab after using AI code completion. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=18507)
* Language Server: Fixed a bug where no code completion was provided when one of multiple overloaded APIs contained the internal tag. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=19058)
* Language Server: Fixed a bug where, due to changes introduced in version 4.44, easycom components in uni-app x projects had no code hints and were incorrectly marked as errors. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=19040)
* Language Server: Fixed a bug where the error Cannot read properties of undefined (reading 'getSyntacticDiagnostics') could occur. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=17048)
* Language Server: Fixed a bug that caused a crash in certain situations. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=17195)
* Language Server: Fixed the bug that the language service reported an error when opening and closing files quickly[Details](https://issues.dcloud.net.cn/pages/issues/detail?id=18499)
* Language Server: Fixed an issue in uni-app x where conditional compilation code blocks were not grayed out when using the subpackage configuration in pages.json [Details](https://hx.dcloud.net.cn/Tutorial/Language/language_service_target_support?id=%e6%9d%a1%e4%bb%b6%e7%bc%96%e8%af%91%e4%bb%a3%e7%a0%81%e5%9d%97%e7%bd%ae%e7%81%b0)
* Language Server: Added error codes to the UTS error message popup, allowing users to click and navigate to the corresponding documentation. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=18231)
* Language Server: Fixed an issue introduced in version 4.63 where the button descriptions in the Vue usage tips popup were incorrect.[Details](https://issues.dcloud.net.cn/pages/issues/detail?id=17960)
* Language Server: Fixed an issue introduced in version 4.61 where validation could occasionally be inaccurate after switching the target.[Details](https://issues.dcloud.net.cn/pages/issues/detail?id=17282)
* Language Server: Fixed an issue introduced in version 4.61 where "Go to Definition" returned redundant results. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=17156)
* Language Server: Fixed an issue introduced in version 3.94 where certain JSON suggestion completions were inaccurate.[Details](https://issues.dcloud.net.cn/pages/issues/detail?id=17157)
* Language Server: Fixed the bug where the underline for "Go to Definition" of CSS variables in inline styles was incorrect. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=18328)
* Language Server: Fixed the bug where CSS properties did not provide code suggestions for CSS variables. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=18334)
* Language Server: Fixed the bug in the language service where CSS variables in uni-app x were incorrectly reported as errors. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=18233)
* Language Server: Fixed the bug in uni-app x where no variable suggestions were provided when using setProperty in the script section. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=18324)
* Language Server: Fixed an bug in uni-app (x) where code completion for relative import paths in the script section was incorrect.[Details](https://issues.dcloud.net.cn/pages/issues/detail?id=16816)
* Language Server: Fixed the bug where the uni ext api functionality would become unavailable when adding or removing uni_modules plugins. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=18434)
* Language Server: Fixed a bug caused by version 4.28 where, in Vue Composition API scenarios, functions in the template were incorrectly displayed as properties. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=19135)
* Fixed a bug introduced in version 4.61-alpha where the "Find corresponding DOM node in code" feature did not work in the built-in hx browser on MacOS (Intel). [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=19165)
* Fixed a bug caused by version 4.41 where the project import dialog would appear blank when importing a project from issues. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=19323)
* Fixed an bug where some class members were lost when parsing JAR files in the uni-app (x) uts plugin. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=18571)
* Fixed an bug where formatting code in Kotlin files of uni-app (x) uts plugins on Windows resulted in garbled Chinese characters. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=18019)
* Fixed a macOS bug where pasting into the reproduction steps input box of the bug report sometimes pasted content directly into the underlying editor. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=12911)
* Fixed a bug introduced in version 4.64 where copying an ordered list in Markdown, pressing Enter for a new line, and then pasting would cause a crash.[Details](https://issues.dcloud.net.cn/pages/issues/detail?id=18002)
* Fixed a bug introduced in version 4.64 where the built-in file explorer's large icon view was not working on macOS (Intel) and Windows. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=18188)
* Fixed a bug in version 4.55 where on macOS (Arm) the toolbar multi-file text search did not respond after entering content and clicking search. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=18129)
* Fixed a bug in version 4.64 where on macOS (Arm), the editor’s favorite theme selection did not take effect on first installation. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=18186)
* Fixed a bug in version 4.55 where on macOS (Arm), after the computer wakes from sleep, the editor’s main view became unclickable. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=16829)
* manifest.json: Added a visual interface for uni-app manifest, supporting Android/iOS module configuration and Maps, including an entry for Baidu Maps configuration.
* manifest.json: Added visual configuration for iOS and Android in uni-app x manifest.json.  [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=15976)
* manifest.json: Adjusted HarmonyOS platform run and build process so that if uni-push and one-click login modules are enabled but the services are not activated or configuration parameters are insufficient, only warnings are issued without blocking the process. [Details](https://doc.dcloud.net.cn/uni-app-x/collocation/manifest-harmony.html)
* manifest.json: Adjusted the dialog for configuring HarmonyOS signing certificates in manifest.json to include a certificate fingerprint display box, making it easier for users to fill in related information in the developer console. [Details](https://uniapp.dcloud.net.cn/tutorial/harmony/runbuild.html#signing-configs)
* manifest.json: Fixed a bug where creating a new project with a duplicate name triggered a user selection dialog, and if the user clicked cancel, the original project's manifest would be unintentionally modified. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=17850)
* Mobile App Playground: The Android platform has been added to the uni-app x project, supporting native linking, which facilitates the hybrid development of native projects and uni-app x. [Details](https://doc.dcloud.net.cn/uni-app-x/native/debug/android.html)
* Mobile App Playground: Add support for native co-compilation on the HarmonyOS platform for uni-app x projects, enabling easier hybrid development between native projects and uni-app x. [Details](https://doc.dcloud.net.cn/uni-app-x/native/debug/harmony.html)
* Mobile App Playground: Added a prompt to install Rosetta 2 when running on Apple Silicon chips. [Details](https://hx.dcloud.net.cn/Tutorial/install/macosx-install-rosetta)
* Mobile App Playground: Added support for wireless device connection when running on Android. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=16395)
* Mobile App Playground: Fixed a bug in uni-app 4.62 that caused compilation errors when running uni-app-cli Vue2 projects inside HBuilderX. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=17535)
* Mobile App Playground: Adjusted the Harmony Meta Service platform to allow users to specify a custom public registry via the environment variable NPM_CONFIG_REGISTRY during runtime and packaging.
* Mobile App Playground: Add support for running uni-app x projects on HarmonyOS x64 platform emulator when using App real-device run. [Details](https://uniapp.dcloud.net.cn/tutorial/harmony/runbuild.html#compatibility)
* Mobile App Playground: Fixed the log collection method during debugging and running of the Harmony Meta Service to resolve log collection failures caused by underlying changes in the HarmonyOS system. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=18216)
* Mobile App Playground: Fixed the issue where subpackage pages showed blank screens by modifying the way the HarmonyOS toolchain is invoked during debugging and running of the Harmony Meta Service, addressing changes caused by the ascf plugin. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=18218)
* Mobile App Playground: Adjusted so that when the push and one-click login modules are enabled in the project, if the services are not yet activated, it will not block the build and run processes.
* Mobile App Playground: Fixed a bug where 5+ projects could not perform hot updates on Windows systems, caused by version 4.63. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=18477)
* Mobile App Playground: Fixed a bug introduced in version 4.64 where the Android console title displayed as "Undefined" during execution.[Details](https://issues.dcloud.net.cn/pages/issues/detail?id=19083)
* App Publish: Added uni-app x support for Web publishing and App packaging with Sourcemap generation.[Details](https://issues.dcloud.net.cn/pages/issues/detail?id=18208)
* App Publish: HarmonyOS platform supports App resource packaging [Details](https://uniapp.dcloud.net.cn/tutorial/harmony/runbuild.html#publish-resources)
* App Publish: Added CLI packaging support for the HarmonyOS platform. [Details](https://hx.dcloud.net.cn/cli/pack-app-harmony)
* App Publish: HarmonyOS platform supports CLI packaging of App resources [Details](https://hx.dcloud.net.cn/cli/publish-app-harmony)
* App Publish: Adjusted the uni-app x project's manifest.json editor interface for HarmonyOS app configuration to remove the checkboxes for Real-Name Authentication, uni-push, and One-Click Login modules; these modules are now automatically detected and enabled by the compiler. [Details](https://doc.dcloud.net.cn/uni-app-x/collocation/manifest-harmony.html)
* Fixed a bug where breakpoints could not be set in UTS files during HarmonyOS collaborative debugging. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=18977)
* Added uni_modules plugin platform compatibility distinction between uni-app and uni-appx platforms, with added support for dark mode, multi-language, and widescreen options. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=18241)
* unicloud: Fixed the bug that switching projects during the transfer from the distribution website to the front-end web hosting would cause the files to be uploaded to the wrong service space. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=18445)
* unicloud: Fixed the bug where all cloud functions cannot be downloaded when there is no uni_modules directory in the uni-app project. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=19105)
* uniCloud: Adjust the sorting order of uniCloud service providers when creating a new uniCloud project. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=19266)

## 4.66.2025051912
### HBuilder
* Fixed the bug where, in certain situations, entering the characters `(,` would cause the editor to freeze for 1-2 seconds. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=16804)
* Fixed the bug caused by uni-app 4.64 version that caused the uts plugin cache to be invalid when running to the custom base for the first time [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=17904)
* Fixed a bug in uni-app (x) UTS plugin where formatting a Swift file would delete code if the file had unsaved changes. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=17821)
* Fixed a bug in the uni-app (x) UTS plugin where, in certain cases, formatting a Kotlin file would fail and display a message asking to check for syntax errors in the code. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=17824)

## 4.65.2025051206
### HBuilder
* Added Uni-app manifest visual interface supports the configuration entry for Baidu Maps.
* Fixed the bug caused by version 4.64 that caused an error in compiling the uni-app-cli Vue2 project in HBuilderX [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=17535) 

## 4.64.2025042916
### HBuilder
* Adjusted HBuilder for Windows to 64-bit, discontinuing support for 32-bit systems.[Details](https://hx.dcloud.net.cn/Tutorial/install/windows)
* Added a phone number and password login option to the HBuilderX user login window.
* Added support for character search in the console. [Details](https://hx.dcloud.net.cn/Tutorial/UserGuide/ConsoleViewSearch)
* Fixed a bug where the selected area was cleared when logs were printed in the run console. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=15814)  
* Fixed a bug where the Select Same Variable option in the editor's right-click menu did not work. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=16413)
* Fixed a bug where bulk closing projects in the project manager could cause freezes and crashes when too many projects were open. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=16410)  
* Fixed a bug where opening a large compressed file with excessive error checks caused the editor to lag. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=16411)  
* Fixed a bug where automatic conversion of Chinese punctuation was incorrect in certain cases. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=16220&ask_id=206467)  
* Fixed a bug on macOS where clicking "Restart Now" after upgrading HBuilderX sometimes failed to restart properly. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=16399)  
* Fixed an issue on macOS ARM where the right-click menu did not display shortcut keys. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=16414)
* Fixed a bug on macOS ARM where the Git commit interface would automatically go fullscreen. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=15910)
* Fixed a bug in the Git/SVN plugin (version 4.52) where the download link for Tortoise Git/SVN tools was invalid during project import. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=16407)  
* Fixed a bug in the Git plugin where using Git functions caused incorrect error messages in the console. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=16408)  
* Added support for intelligent editing, smart pairing, and folding features for Swift, Kotlin, and other plugin marketplace extensions.  
* Language Server: Added uni-app x project conditional compilation support to gray out inactive platform code blocks [Details](https://hx.dcloud.net.cn/Tutorial/Language/language_service_target_support)
* Language Server: Added multi-result support for "Go to Definition" in the language service. [Details](https://hx.dcloud.net.cn/Tutorial/UserGuide/goto?id=goto-definition)  
* Language Server: Added formatting support for Swift and Kotlin files in the UTS plugin within the language service. [Details](https://hx.dcloud.net.cn/Tutorial/Language/uts_hybrid_support)  
* Language Server: Added code hint support for Swift hybrid development in the UTS plugin. [Details](https://hx.dcloud.net.cn/Tutorial/Language/uts_hybrid_support)  
* Language Server: Fixed a bug in the language service where variables defined using `computed` in uvue files of uni-app x had incorrect hints in the template section. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=15813)  
* Language Server: Optimized the language service in uni-app x projects to improve the performance of "Go to Definition" under conditional compilation.
* Language Server: Fixed a Bug where language service prompts Could not find source file when quickly opening and closing files [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=16804)
* Language Server: Fixed the bug in the UniApp X project where the path to the Vue file cannot be navigated to its definition. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=16879)
* Language Server: Added When hovering over the grayed-out code blocks in the UniApp X project due to conditional compilation, a prompt should be displayed. [Details](https://hx.dcloud.net.cn/Tutorial/Language/language_service_target_support?id=%E6%9D%A1%E4%BB%B6%E7%BC%96%E8%AF%91%E4%BB%A3%E7%A0%81%E5%9D%97%E7%BD%AE%E7%81%B0)
* Added HarmonyOS debugging support for uni-app x, enabling debugging of UTS, UVue, and UTS plugin mixed ArkTS files. [Details](https://uniapp.dcloud.net.cn/tutorial/debug/uni-uts-debug-harmony.html)  
* Added Android debugging support in uni-app x for UVue and UTS plugin mixed Kotlin file breakpoint debugging. [Details](https://uniapp.dcloud.net.cn/tutorial/debug/uni-uts-debug.html)  
* Added support for running a custom base on an already installed base when running uni-app (x) on Android.  
* Adjusted the Android device list in uni-app (x) to display device brand and model.  
* Upgraded the built-in ADB in the real device running plugin from version 29.0.4 to 35.0.2.  
* Changed the installation method for installed bases from "Uninstall & Install" to "Overwrite Install." [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=16397)
* Adjust secure packaging apktool update to solve 2.11.1, peace of mind when packaged ` android: foregroundServiceType Bug ` parameter values will be changed [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=16895)

## 4.57.2025032507
### HBuilder
* Fixed some bugs

## 4.56.2025031210
### HBuilder
* Fixed some bugs

## 4.55.2025030718
### HBuilder
* Added support for the ARM version of macOS.
* Added user login interface, added mobile phone number verification code login method
* HBuilderX CLI: Adjusted the HBuilderX CLI for uni-app H5 distribution to extend the `--provider` parameter, now supporting more service providers: [aliyun | alipay | tcb]. [Details](https://hx.dcloud.net.cn/cli/publish-h5)
* HBuilderX CLI: Added `--ssrHost` and `--ssrProvider` parameters to the HBuilderX CLI for uni-app H5 distribution. [Details](https://hx.dcloud.net.cn/cli/publish-h5)
* Added a configuration option to control whether open editors under a project are automatically closed when the project is removed or closed. (Menu: [Settings - Commonly Used])
* Adjusted the language for .ets files from TypeScript to ArkTs, with syntax highlighting functionality migrated to a plugin implementation. [Details](https://ext.dcloud.net.cn/plugin?id=21741)
* Fixed a bug on macOS where pressing `Alt + Shift + Tab` for reverse selection in the tab switch panel inserted a `\t` character into the editor. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=14977)
* Fixed a bug in version 3.99 where the code map could not be disabled for files when an `.editorconfig` file was present in the project.[Details](https://issues.dcloud.net.cn/pages/issues/detail?id=14863)
* Fixed a bug in version 4.31 where pressing `Esc` after triggering the search bar with `Ctrl+F` caused HBuilderX to crash in certain cases. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=14978)
* Fixed a bug where incorrect encoding detection caused garbled text when opening certain files. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=12395)
* Fixed a bug where the file name was reset when selecting a template during file creation.
* Language Server: Fixed a bug in version 4.44 where custom code blocks did not work if the scope was not defined. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=14982)
* Language Server: Fixed a bug in uni-app (x) Vue files where Emmet syntax completion for "implicit tag names" was incorrect. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=14374)
* Fixed a bug in version 4.31 where, after the hover code hint appeared, double-clicking the hovered code would not select it. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=15055)
* Language Server: Added support for code suggestions, "Go to Definition," and other features for imported Kotlin files in the uni-app (x) UTS plugin. [Details](https://hx.dcloud.net.cn/Tutorial/Language/uts_hybrid_support)
* Language Server: Optimized the initialization speed of uni-app x related features when the language service is first launched.
* Language Server: Fixed a bug in the language service for uni-app x where using variables defined with `ref` in templates caused errors.[Details](https://issues.dcloud.net.cn/pages/issues/detail?id=14968)
* Language Server: Fixed a bug in the language service for uni-app `Vue3 + TypeScript` where global `globalProperties` attributes or methods were not suggested. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=14972)
* Language Server: Fixed a bug in the uni-app (x) UTS plugin where overwriting properties in a class caused incorrect type validation errors for certain native platform types and TypeScript types. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=15172)
* Language Server: Fixed a bug in the uni-app (x) UTS plugin where type validation errors were incorrectly reported in ternary expressions for certain native platform types and TypeScript types. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=15173)
* Language Server: Adjust the uni-app x project to automatically fill in the object literal parameter braces when the uni api code prompts
* Language Server: Fixed a bug in Vue files where search results for references to `id` and `class` were incorrect in certain cases. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=15171)
* Fixed a bug in the uni_modules plugin on macOS where canceling the file selection dialog for a screenshot in the "Publish Plugin to Plugin Market" dialog caused an issue with dialog layering. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=14979)

## 4.45.2025010502
### HBuilder
* Language Server: Fixed a bug in version 4.44 where opening Vue files in uni-app projects occasionally caused the language service to fail to find getOptionsDiagnostics [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=14778)
* uni-app: Fixed a bug in macOS version 4.29 where exporting WGT with native obfuscation for JS/NVUE files failed. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=14682)
* uni-app: Fixed a bug in macOS version 4.44 where uni-app CLI projects running on mobile devices would hang during compilation on some computers due to the inability to retrieve the system Node.js path. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=14754) 
* uni-app: Added support for disabling the runtime log echo to the HBuilder console when running uni-app projects in WeChat, Baidu, Alipay, or Douyin Mini Program Developer Tools. [Details](https://uniapp.dcloud.net.cn/tutorial/run/mp-log.html)
* uni-app: Fixed a bug in version 4.44 where running uni-app projects on WeChat Mini Programs failed to launch the developer tools in certain cases.[Details](https://issues.dcloud.net.cn/pages/issues/detail?id=14830)
* uni-app: Fixed a bug in version 4.44 where the previously saved compilation mode was lost when running uni-app projects on WeChat Mini Programs.[Details](https://issues.dcloud.net.cn/pages/issues/detail?id=14822)
* uni-app: Adjusted the default value of the Node.js startup memory parameter in the HBuilderX settings for Uni-app compiler configuration to 3072 MB.

## 4.44.2024123110
### HBuilder
* Optimize the activation time of the Node plugin.
* Fixed the bug where the status bar height is abnormal on some computers when creating a new HBuilder window. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=13755)
* Fixed the bug where rendering lags occur when opening large compressed files, especially when there are many errors during error checking. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=13769)
* Language Server: Optimize the language service uni-app x code hint performance
* Language Server: Fixed the bug introduced in version 3.5.3, where the cursor position is incorrect in custom code blocks containing Chinese characters. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=10900)
* Language Server: Fixed the bug introduced in version 3.94, where the code block area in markdown does not fold correctly. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=12767)
* Language Server: Fixed the bug in UTS validation where errors are incorrectly reported for object literal types when they are used as optional parameters. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=13734)
* Language Server: Fixed the bug where, in certain cases, string-type variables are incorrectly recognized as methods, leading to unwanted parentheses being added. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=13763)
* Language Server: Fixed the bug in uni-app where incorrect error validation occurs due to caching of the `type` in `x`. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=13752)
* Language Server: Fixed the bug where code suggestions are not provided when a `wxs` script is present. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=13756)
* Language Server: Fixed the bug where code suggestions do not appear after opening a file ignored in `tsconfig.json` and then closing it. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=13760)
* Language Server: Fixed the bug in the uni-app UTS plugin where code suggestions are not provided when writing `uvue`. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=13759)
* Language Server: Fixed the bug in uni-app where an error is incorrectly reported for `this.globalData` not being found in the `App.uvue` file. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=13915)
* Language Server: Fixed the bug that when this.xxx goes to definition multiple times in uni-app Vue file, subsequent failure may occur [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=14082)
* Language Server: Fixed the bug introduced in version 4.29, where using "Find References" in markdown causes a language service error. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=13739)
* Language Server: Fixed the bug in version 4.29 where writing multiple link syntaxes on a single line in markdown causes code suggestions to appear in the description position. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=13270)
* Language Server: Fixed the bug in version 4.31 where special i18n values in a domain of type String may cause TypeScript language service errors. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=13561)
* Language Server: Fixed the bug in version 4.31 where project cache data is not deleted when closing a project. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=13750)
* Language Server: Fixed the bug in version 3.5.3 where URI.parse causes language service errors. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=13738)
* Language Server: Fixed the bug in version 3.5.3 where hovering over a component with multiple hyperlinks causes F1 to jump to the wrong hyperlink. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=13841)
* Language Server: Fixed the bug in version 3.5.3 where JSON code suggestions continuously fetch data from the code assistant. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=14030)
* Language Server: Fixed the bug in version 4.36 where the special String value domain and AttrString event property suggestions return incorrect autocomplete results. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=14031)
* Language Server: Adjust the special value domains `FontURIString`, `ImageURIString`, `AudioURIString`, `VideoURIString`, `PageURIString`, `NPageURIString`, and `UPageURIString` in uni-app (x) projects so that code suggestions only support project-relative paths.
* uni-app: Added the feature to run or publish a uni-app x project to WeChat Mini Program. [Details](https://doc.dcloud.net.cn/uni-app-x/mp)
* uni-app: Added the feature to run a uni-app project on the WeChat, Baidu, Alipay, and Douyin Mini Program Developer Tools, with support for logging to the HBuilder console. [Details](https://uniapp.dcloud.net.cn/tutorial/run/mp-log.html)
* uni-app: Added support for logging to the HBuilder console when running a uni-app project on HarmonyOS.
* uni-app: Added the feature to run or publish a uni-app project to Xiaohongshu Mini Program.
* uni-app: Added the feature to right-click on package.json in a uni-app project and use the built-in npm to install dependencies. [Details](https://hx.dcloud.net.cn/Tutorial/installDependencies)
* uni-app: Added support for configuring certificate library passwords in uni-app App cloud packaging.
* uni-app: Adjusted the uni-app toolbar to hide all Mini Program options by default in the "Run" menu group, except for WeChat and HarmonyOS services.
* uni-app: Adjusted the uni-app x toolbar to display only supported platforms in the "Run" menu.
* uni-app: Adjusted the uni-app CLI to use the node from the system environment variables for project run/publish, instead of defaulting to the built-in node. [Details](https://hx.dcloud.net.cn/Tutorial/configureEnvironmentVariables)
* uni-app: Fixed the bug introduced in uni-app version 3.5.3, where code suggestions for conditional compilation in pages.json incorrectly replace content when pressing Enter in certain cases. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=13715)

## 4.36.2024112817
### HBuilder 
* uni-app directly runs and publishes Hongmeng applications in HBuilderX, and no longer needs to configure templates in Hongmeng development tools
* uni-app manifest visual interface, added Hongmeng visual settings, the original App settings were renamed Android/iOS settings
* Language Server: Added UTS plugin development support with prompts for HarmonyOS APIs.
* Added syntax highlighting for JSON5 files. [Details](https://ext.dcloud.net.cn/plugin?id=19383)
* Optimized the performance of highlighting selected identical words in large documents to prevent UI lag.
* Optimized resource and memory usage when managing a large number of projects in the project manager.
* Fixed: The order of switching view files after restarting hx is inconsistent with that when shutting down [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=11094)
* Adjusted the priority of file associations in the macOS system. [Details](https://ask.dcloud.net.cn/question/90668)
* Adjusted the shortcut for removing the duplicate insertion of the currently selected word (`Ctrl+Insert`) to avoid conflicts with some AI tools. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=7238)
* Fixed a bug where the `Alt+/` shortcut for triggering code suggestions occasionally triggered hover hints instead. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=9955)
* Fixed a bug where switching focus to an external program and then back to the editor caused the code area to scroll incorrectly during character searches. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=6050)
* Fixed a bug in macOS where the function to highlight corresponding elements in the built-in browser when previewing HTML files was not working. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=10011)
* Language Server: Added language service support for theme.json in uni-app (x). [Details](https://uniapp.dcloud.net.cn/tutorial/darkmode.html#themejson)
* Language Server: Added automatic import support for built-in packages: @dcloudio/uni-app, pinia, and vuex.
* Language Server: Optimized memory usage.
* Language Server: Optimized code hinting performance for Vue files.
* Language Server: Fixed a bug where the `$` symbol was lost after pressing Enter when the suggestion contained $ and was followed by parentheses. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=10021)
* Language Server: Fixed a bug where JS files would report errors in certain cases within uni-app x projects. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=10014)
* Language Server: Fixed a bug where the language service reported errors when defining properties with the same name in certain cases within uni-app projects. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=10476)
* Language Server: uni-app Easycom component tag attributes and event prompts support the attributes and events defined in defineProps and defineEmits
* Language Server: Fixed the bug in uni-app X where resources are not correctly released when opening multiple projects, causing language service errors.[Details](https://issues.dcloud.net.cn/pages/issues/detail?id=11379)
* Language Server: Fixed the bug where executing `npm i` within a project could trigger language service errors, particularly when using features like "Go to Definition". [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=10240)
* Language Server: Fixed the bug where language service reported an error: `No Project.` in certain cases. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=11395)
* Language Server: Fixed the bug where modifying the `script lang` in a referenced Vue file caused language service errors when hovering over the script section. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=12187)
* Language Server: Fixed the bug where language service errors occurred when quickly navigating to a Vue file in a CLI project right after initialization. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=11807)
* Language Server: Fixed the bug where language service errors occurred in HTML files when writing Vue code in certain cases. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=9966)
* Language Server: Fixed the bug where file paths under the plugin could not be suggested in the UTS plugin development environment. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=12200)
* Language Server: Fixed the bug where hovering over custom component properties could cause language service errors. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=12215)
* Language Server: Fixed the bug introduced in version 3.8.12 where the special value domain String, `cssSelectorString`, was not functioning correctly. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=11764)
* Language Server: Fixed the bug introduced in version 3.8.12 where the special value domains `VideoIdString` and `WebviewIdString` were not being suggested correctly. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=11766)
* Language Server: Fixed the bug introduced in version 3.8.12 where the suggestions for the special value domain `colorString` were displayed in the wrong order. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=11769)
* Language Server: Fixed the bug introduced in version 3.8.12 where the suggestion items for the special value domain `cssPropertyString` were not sorted correctly. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=11770)
* Language Server: Fixed the bug introduced in version 3.8.12 where, in certain cases, the autocompletion suggestions for the special value domain `ScriptImportURIString` were incorrect. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=11773)
* Language Server: Fixed a bug in version 3.8.0 where `document.getElementById()` did not provide type hints based on the actual DOM element type in HTML files. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=9588)
* Language Server: Fixed a bug in version 3.5.3 where attribute-related code blocks did not provide hints in HTML code blocks. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=8959)
* Language Server: Fixed a bug in version 3.5.3 where the positions of attribute values in HTML code blocks were incorrectly suggested. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=8956)
* Language Server: Fixed a bug in version 3.5.3 where incorrect suggestions were made in the attribute selectors of style code blocks. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=8953)
* Language Server: Fixed a bug in version 3.5.3 where certain code blocks did not provide suggestions in the script area. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=8949)
* Language Server: Fixed a bug in version 3.5.3 where HTML files in uni-app projects lacked conditional compilation. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=8957)
* Language Server: Fixed a bug in version 3.5.3 where circular reference errors occurred with the `foreignKey` field in `*.schema.json` files. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=9797)
* Language Server: Fixed a bug in version 3.5.3 where path suggestions occasionally caused errors in the language service. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=9800)
* Language Server: Fixed a bug in version 3.5.3 where jsDoc suggestions caused errors in the language service. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=10075)
* Language Server: Fixed a bug in version 3.5.3 where `URI.parse` could potentially cause errors in the language service. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=10108)
* Language Server: Fixed a bug in version 3.91 where style code blocks were duplicated in uni-app x projects. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=8946)
* Language Server: Fixed a bug in version 3.5.3 where the completion results for jsDoc code blocks were incorrect. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=8873)
* Language Server: Fixed a bug in version 4.08 where the right-click feature for "Find References" returned no results. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=8022)
* Language Server: Fixed a bug in version 3.6.11 where manually specifying associated languages in the editor could lead to incorrect error highlighting. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=7676)
* Language Server: Fixed a bug in version 3.98 where there were no code suggestions when typing in the middle of a key in `manifest.json` files. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=5798)
* Language Server: Fixed a bug in version 3.99 where deprecated `upx` still provided suggestions. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=5331)
* Language Server: Fixed a bug in version 3.99 where the descriptions for style code suggestions were incorrect. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=5213)
* Language Server: Fixed a bug in version 3.94 where the JSON to type conversion function produced incorrect results in specific cases. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=3930)
* Language Server: Fixed a bug in version 3.6.5 where anchor link suggestions in Markdown were incorrect. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=1788)
* Language Server: Fixed a bug in version 3.99 where jumping to the definition of class names led to the wrong file. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=861)
* Language Server: Fixed a bug in the UTS plugin where overriding methods of an interface when developing Android plugins incorrectly reported errors. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=10034)
* Language Server: Fixed the bug that the status bar reported an error when searching for files and triggering function signatures on Windows computers for the uts plug-in iOS platform [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=11428)
* Adjust the default value of Windows HBuilderX "Run Configuration" - "Kotlin compiler maximum heap memory size" to 2048
* Fixed a bug in uni-app where the WeChat Developer Tool occasionally crashed when closing the runtime console. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=10012)
* uni-app: Added manifest.json HarmonyOS configuration to the visual interface.
* uni-app x: Added support for AAB, channel packages, and ad configurations in uni-app x cloud packaging.
* uni-app x: Added uvue breakpoint debugging support for uni-app x on iOS. [Details](https://uniapp.dcloud.net.cn/tutorial/debug/uni-uts-debug-ios.html)
* uni-app x: Create a new uni_modules plug-in and add a classified UTS plug-in-standard mode component
* Added the built-in `uni-im` message notification plugin, which flashes unread messages in the bottom right corner.

## 4.29.2024093009
### HBuilder
* Fixed the bug that h5+ application cannot create wgt package caused by version 4.28 [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=9606&ask_id=198971)

## 4.28.2024092502
### HBuilder
* Adjusted the amazon-corretto plugin, upgraded from 11.0.14 to 17.0.12, and Windows from 32-bit to 64-bit [Details](https://hx.dcloud.net.cn/Tutorial/App/notsupportJava)
* Language Server: Optimize code prompt speed
* Language Server: Optimize type inference performance in Vue files
* Language Server: Adjust uni-app x project syntax prompt and verification platform to support multiple selection [Details](https://hx.dcloud.net.cn/Tutorial/Language/language_service_target_support)
* Language Server: Optimize the display of uni-app x project platform compatibility information [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=2734)
* Language Server: Fixed the bug that the vue tag prompt still prompts the top-level tag in the sub-tag scope [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=2419)
* Language Server: Fixed the bug that the vue tag prompt shows the Emmet code block under the text tag[Details](https://issues.dcloud.net.cn/pages/issues/detail?id=1791)
* Language Server: Fixed a bug in some cases where the code prompts an error after going to the definition in the HTML file [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=4126)
* Language Server: Fixed the bug caused by version 4.08, where the deleted id and class still exist in the code hint[Details](https://issues.dcloud.net.cn/pages/issues/detail?id=7293)
* Language Server: Fixed the bug of uts plugin reporting "Could not find source file" caused by version 4.25 [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=8029)
* Language Server: Fixed the bug of invalid reference search in uniapp x project caused by language service version 4.25 [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=8134)
* Language Server: Fixed a bug caused by version 3.5.3, in some cases, the style attribute selector completion item prompt was incorrect [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=7072)
* Language Server: Fixed a bug in the vue file code that caused the language service to report an error when there was an automatic package guide prompt item [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=2550)
* Language Server: Fixed a bug in which the detailed information on the right side of the code assistant was not displayed correctly in some cases in vue files [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=2573)
* Language Server: Fixed a bug in which when using easycom components in vue files, the component path was recognized as a folder in some cases, causing the language service to report an error. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=2589)
* Language Server: Fixed the bug that after the Vue file goes to the definition of a certain Easycom component tag, the script area of ​​the opened component file becomes invalid [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=2527)
* Language Server: Fixed the bug that caused the language service to report an error when some variable boundaries were moved to definitions in the template area of ​​the vue file. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=2529)
* Language Server: Fixed a bug in the uniCloud directory where, when file A is referenced by file B, if file B is opened first and then file A, the code prompt and other functions of file A will become invalid. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=2698)
* Language Server: Fixed a bug that occasionally caused the language service to report an error when renaming files [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=3089)
* Language Server: Fixed the bug caused by version 4.11, where there were two duplicate items in the less and scss code hints [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=6685)
* Language Server: Fixed a bug that caused the language service to report an error in some cases when there was a tsconfig.json file in the cli project [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=2603)
* Language Server: Fixed the bug that there is no uniCloud related prompt in uniCloud environment in uniapp x project [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=2853)
* Language Server: Fixed the bug that special value fields String, UPageURIString and ScriptImportURIString are not effective [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=5822)
* Language Server: Fixed the bug that when the i18n key floating prompt is triggered in the uni-app project, if the translation file is missing, the language service will report an error [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=2914)
* Language Server: Fixed the bug of missing CSS pseudo-class: before prompt item caused by version 3.6.5 [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=6745)
* Language Server: Fixed the bug of missing uvue file code prompt caused by version 4.14 [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=4886)
* Language Server: Fixed the bug in version 4.14 where the order of language service queue messages was wrong, causing tsserver service errors [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=2581)
* Language Server: Fixed the bug caused by version 4.18 that caused the uni ext api to not work in some cases [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=2254)
* Fixed the bug caused by version 4.0 that in some cases, when uniapp is released to H5, clicking the menu does not respond. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=7071)
* Fixed the bug that caused HBuilderX to crash under Chinese input method when switching language mode in the lower right corner of the editor [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=3729)
* Fixed a bug in Markdown preview where some images would not be rendered when the directory level was deep [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=4122)
* Adjustment: After HBuilderX is updated, if you do not choose to restart immediately, it will automatically update the next time you start the software after exiting it. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=4120)
* Fixed the bug that after HBuilderX upgrade successfully, clicking Restart Now did not restart successfully in some cases. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=4118)
* Fixed the bug that the file collection function needs to press the shortcut key twice to trigger [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=2311)
* Fixed a bug where the drop-down menu would disappear automatically in some cases when switching between search categories in the toolbar, causing the mouse to not be able to select the item [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=2076)
* Fixed a bug where the position of the pop-up interface was incorrect when clicking the arrow after the project name when the address bar displayed the Git branch name. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=2196)
* New support for linking multiple uni-app (x) project pages, components, API and other directories to a specified project through soft links [Details](https://hx.dcloud.net.cn/Tutorial/App/softLink)
* Added uni-app x project to generate local packaged native iOS resources [Details](https://doc.dcloud.net.cn/uni-app-x/native/use/ios.html)
* Added uni-app project and ran it in Hongmeng DevEco Studio [Details](https://uniapp.dcloud.net.cn/tutorial/harmony/dev.html)
* Added uni-app cloud packaging, supports Android anti-re-signing [Details](https://uniapp.dcloud.net.cn/tutorial/app-android-antiresigne.html)
* Fixed the bug that when deleting the `ad` parameter in manifest.json of uni-app cloud packaging, `ad:{}` will be added again during packaging [Details](https://ask.dcloud.net.cn/question/194093)
* Adjust the uts plugin, uts Android plugin development configuration items to Settings-Run Configuration [Details](https://uniapp.dcloud.net.cn/tutorial/run/uts-development-android.html)
* uni-app (x): Fixed the bug that the Run menu does not respond after renaming the project in uni-app (x) [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=7700)
* uni-app (x): Fixed the bug that the App content is not updated after switching projects when running uni-app (x) to iOS (18.0) simulator [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=9027)

## 4.24.2024072208
### uni-app
* App Platform: Fixed the bug that the uni.chooseLocation page reported an error when getting the current location [Details](https://ask.dcloud.net.cn/question/195066)
* Web Platform: Fixed the bug that failed to obtain the gcj02 coordinate system position when using Tencent positioning/map [Details](https://ask.dcloud.net.cn/question/195113)

## 4.23.2024070804
### HBuilder
* Language Server: Added support for displaying the language service status in the status bar, making it easier to modify the language service settings [Details](https://hx.dcloud.net.cn/Tutorial/Language/lsStatus)
* Language Server: Added status bar prompt and quick bug reporting function when serious errors occur
* Language Server: Added support for code hints when referencing an encryption plugin when a type declaration file exists
* Language Server: Adjust the uni-app x project to turn off syntax checking of uts, uvue, and css files by default, which can be turned on through the language service status bar
* Language Server: Optimize uni ext api code prompt performance
* Language Server: Optimize the performance of code hints and syntax checking in uni-app x projects
* Language Server: Fixed the bug that an error message is reported when a literal object is assigned to the union type of UTSJSONObject and null in the uni-app x project [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=2584)
* Language Server: Fixed a bug that caused occasional language service errors when the referenced file path was inconsistent with the local real path in some cases [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=2468)
* Language Server: Fixed the bug that ext api is not prompted when there is only one uni. in the uni-app (x) page [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=2503)
* Language Server: Fixed the bug that there is no CSS hint in the markdown code area [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=2230)
* Language Server: Fixed the bug that uni-app x project html has no tag hint [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=1798)
* Language Server: Fixed the bug that component attribute verification in uni-app x project does not support recognition of upper and lower camel case writing [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=2056)
* Language Server: Fixed the bug that uts reports an error when assigning a named type [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=2050)
* Language Server: Fixed the bug that the uts plugin web client reported an error when referencing the package name [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=2051)
* Language Server: Fixed the bug that scss and less use nested writing to report an error [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=1451)
* Language Server: Fixed the bug that there is no code hint at the end of the closing tag [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=1581)
* Language Server: Fixed a bug where after deleting a file, the contents of the deleted file still had code hints in some cases [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=1564)
* Language Server: Fixed a bug that caused the mouse hover function of the imported package name to fail in some cases [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=2052)
* Language Server: Fixed the bug that vue's built-in directive v-bind does not prompt existing attributes [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=1637)
* Language Server: Fixed a bug in the uni-app x project where the reference results were duplicated in some cases. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=1904)
* Language Server: Fixed the bug that the language service only works on a single platform when conditional compilation specifies multiple platforms in the pages.json file of the uni-app x project [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=1905)
* Language Server: Fixed the bug that the instanceof keyword in uni-app x project cannot prompt interface or type type [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=1906)
* Fixed the bug that the html file will not be automatically refreshed when running it in the browser and modifying the css and js that the file depends on [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=2008)
* Fixed the bug that double-clicking to open a uts encrypted file in the project manager would cause HBuilderX to start continuously [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=1949)
* Fixed the bug that HBuilderX crashed when running the scripts command under package.json when the project has package.json [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=1983)
* Added uni-app x project to generate local packaged native Android resources [Details](https://doc.dcloud.net.cn/uni-app-x/native/use/android.html)
* Added uni-app x real machine running iOS platform (iOS17 and below) uts plug-in breakpoint debugging [Details](https://uniapp.dcloud.net.cn/tutorial/debug/uni-uts-debug-ios.html)
* Fixed the bug that there is no running log in the base console after modifying the uts plug-in and re-signing the base console when running uni-app x on a real machine in the iOS simulator [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=1963)
* Fixed the bug caused by uni-app (x) 4.13, which caused the UTS plugin Android debug to be unusable due to Node upgrade [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=1979)
* Fixed the bug that the output log color was wrong in some cases when running the uni-app x project console
* Optimize the format of the log output in the console of uts plugin when running uni-app (x) on iOS
* Fixed the bug that the logs printed by uni-app (x) running to the iOS console cannot be redirected [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=1288)
* Fixed the bug that when checking the old version of DCloud certificate in the uni-app old project's safe packaging, the prompt "Custom base does not support safe packaging, please switch to normal packaging" is incorrect

## 4.15.2024050802
### HBuilder
* Language Server: Fixed the bug that when an absolute path in the form of "@/" is used in the uni-app project, there is no code prompt and syntax verification error. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=1590)
* Fixed the uni-app x manifest.json Android startup interface setting. When the splash image is a relative path, the image resource is lost after submitting the cloud package [Details](https://issues.dcloud.net.cn/pages/issues/ detail?id=1814)
### uni-app plugin
* Web Platform Fix The bug that some event listener report an error in version 4.14. [Details](https://ask.dcloud.net.cn/question/190670)
* Web Platform Fix The bug that using v-bind in css and the value contains rpx is invalid in version 4.14. [Details](https://ask.dcloud.net.cn/question/190828)
* Web Platform Fix The bug that running ssr project report an error in version 4.14. [Details](https://ask.dcloud.net.cn/question/190830)
* App Platform Fix The bug that scroll-view refresher style loss in version 4.14. [Details](https://ask.dcloud.net.cn/question/190805)
* WeChat Mini Program platform, fix version 4.14 throwing span tag compilation exception [Details](https://ask.dcloud.net.cn/question/190418)
### uni-app x plugin
* Web Platform Fix The bug that using v-bind in css and the value contains rpx is invalid in version 4.14. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=1830)
### uniCloud插件
* Fix Bugs where cloud functions call other cloud functions and report errors when calling local cloud functions in version 4.14. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=1708)

## 4.14.2024043013
### HBuilder
* Adjust the built-in node version to be upgraded from v16.17.0 to v18.20.0
* Adjust the minimum supported version of macOS to 10.15
* Language Server: Added new language service uni-app x to support css syntax verification [Details](https://hx.dcloud.net.cn/Tutorial/Language/cssValidate)
* Language Server: Added new language service uni-app x to support uvue tag syntax verification [Details](https://hx.dcloud.net.cn/Tutorial/Language/vueValidate)
* Language Server: Newly added language service uts plug-in iOS platform supports the api of the third-party framework used by prompts (only supported by Mac version)
* Language Server: Adjust the language service. The uts plug-in iOS platform language service no longer takes effect under the windows version of HBuilderX.
* Language Server: Fixed the bug of using inner class in language service uts syntax verification to incorrectly report errors when defining generics
* Language Server: Fixed the bug of language service uts syntax verification when the special value range string and string type variables are assigned to each other.
* Language Server: Fixed the bug that when the language service uni-app x platform verification error prompts, the platform error order is inconsistent with the order when setting the platform.
* Language Server: Fixed the bug of language service uts syntax verification error: "undefined cannot be assigned to type null" [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=1461)
* Language Server: Fixed the bug of language service uts syntax verification error: "number type cannot be assigned to number literal type" [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=1460)
* Language Server: Adjust the language service and upgrade the d.ts version of the built-in vue framework from 3.2.26 to 3.4.21
* Language Server: Fixed language service uvue tag syntax verification bug that falsely reports that v-slot and v-bind are not recognized
* Language Server: Added uni-app x typeof operator return value to support platform-specific types [Details](https://doc.dcloud.net.cn/uni-app-x/uts/operator.html#typeof)
* Language Server: Added new language service. An error warning will appear when referencing iOS platform-related modules in a non-uts plug-in development environment.
* Language Server: Fixed the bug that the language service cannot be recognized when importing custom uvue components [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=1397)
* Language Server: Fixed the bug that when a syntax error occurs in the language service scss, the prompt cannot be displayed normally in some cases [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=1466)
* Language Server: Fixed a Bug in windows platform where the selection of syntax hints in uni-app x projects and the validation platform did not take effect in some cases [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=1653)
* Fixed the bug that the F11 shortcut key does not take effect in the default shortcut key scheme when switching windows to do not disturb mode
* Fixed the bug that Chinese ￥ cannot be input after vue file `{{}}` [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=924)
* Fixed the bug of inserting a blank line upward when the cursor is on the first line, inserting incorrect content
* Fixed the bug where go to a newly opened file defined when the file is relatively large may cause the cursor to return to the beginning of the file when it rolls back.
* Fixed the bug that after uninstalling and reinstalling the Prettier plug-in, if there is a formatting conflict, the plug-in name will appear repeatedly in the pop-up box [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=849)
* Fixed a bug that may cause HBuilderX to crash in some cases when right-clicking on the editor and `Find References` [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=1246)
* Fixed the bug of unsaved tag cards, in the inactive state, the modified content is not restored correctly after exiting and reopening HBuilderX [Details](https://issues.dcloud.net.cn/pages/issues/detail?id =1317)
* Fixed the bug that closing all tabs will cause UI lag when there are too many tabs [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=1348)
* Fixed a bug in the editor floating prompt, where the link color in the prompt message is not clearly visible under dark themes [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=1094)
* Fixed the bug that when text search is already displayed in the search area, shortcut keys trigger replacement and the replacement area cannot be automatically displayed [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=1207 )
* Fixed the bug that `ctrl+tab` cannot trigger view switching when there is no open file in the single project window [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=1365)
* Fixed the problem when uni-app prints multiple object type parameters, clicking a hyperlink will jump to the last [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=890)
* Fixed In some cases, when closing a modified file, the pop-up box will crash when saving.  [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=1648)
* Fixed a bug that would cause some plug-in installations to fail when package.json, package-lock.json, and node_modules exist in the upper-level directory of the HBuilderX installation directory. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=1649)
* Added bug feedback plug-in uni-app x classification, supports web and iOS platform, and allows multiple selections
* Added uni-app x running on iOS platform added the function of clearing build cache. The cache directory is unpackage/cache/.app-ios
* Adjust the Android platform build cache directory unpackage/cache/.kotlin to unpackage/cache/.app-android when uni-app
* Added uni-app (x) to publish to app, iOS icon configuration can only be 1024*1024 pixels
* Fixed the App cloud packaging uni-app project, the bug is always stuck at 40% after submitting the package [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=1630)
### uni-app plugin
* [Important] Web Platform adjustment vue version was upgraded from 3.2.47 to 3.4.21, and new features such as defineOptions, defineModel, and toValue were supported
* The Vue3 project upgraded the compiler dependent vite version to 5.2.8
* Web Platform fixed a Bug where vue3 version scroll-view could not be refreshed using custom pull-down
* Web platform repair onNavigationBarSearchInputClicked life cycle In some browsers don't trigger the Bug [details] (https://ask.dcloud.net.cn/question/189465)
* App platform repair vue3 project configuration after native js confusion, cloud packaging operation not normal Bug [details] (https://ask.dcloud.net.cn/question/190488)
* App platform repair Vue2 cli project using webpack5. X, part of cases, resource files can't find the Bug [details] (https://ask.dcloud.net.cn/question/188778)
* New skyline built-in components supported by wechat mini program platform: draggable-sheet, grid-builder, list-builder, nested-scroll-body, nested-scroll-header, open-container, Share - element, the snapshot, span [details] (https://ask.dcloud.net.cn/question/178372)
* baidu small application platform to repair the public static resources into wrong path leads to the problem of the ICONS don't show [details] (https://ask.dcloud.net.cn/question/189033)
* pay treasure small application platform New support join - group chat, subscribe message open components [details] (https://ask.dcloud.net.cn/question/190053)
### uni-app x plugin
* [Important] Added compilation to iOS platform
* [Important] Web Platform adjustment vue version was upgraded from 3.2.47 to 3.4.21, and new features such as defineOptions, defineModel, and toValue were supported
* Added API $getPageStyle and $setPageStyle, Get and set pages. The json page style [details] (https://doc.dcloud.net.cn/uni-app-x/api/get-current-pages.html)
* Support for passing generics when adding cloud objects and cloud function calls ] [cloud object client API documentation (https://doc.dcloud.net.cn/uni-app-x/api/unicloud/object.html), client API documentation] [cloud function (https://doc.dcloud.net.cn/uni- app-x/api/unicloud/function.html)
* Added API $getPageStyle and $setPageStyle, Get and set pages. The json page style [details] (https://doc.dcloud.net.cn/uni-app-x/api/get-current-pages.html)
* Support for passing generics when adding cloud objects and cloud function calls ] [cloud object client API documentation (https://doc.dcloud.net.cn/uni-app-x/api/unicloud/object.html), client API documentation] [cloud function (https://doc.dcloud.net.cn/uni- app-x/api/unicloud/function.html)
* repair script compiler grammar error in the nodes, the line number is not correct the Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1290)
* The App platform adjusts the message event callback parameter of the web-view component detail.data type to Array<UTSJSONObject>. The detail.url of the load and loading event callback parameter is the detail.src attribute [details] (https://doc.dcloud.net.cn/uni-app-x/component/web-view.html#%E4%BA%8B%E4%BB%B6)
* App Platform adjustment uni.getSystemInfo returns uniPlatform field values divided into 'app-Android' and 'app-ios' [details] (https://doc.dcloud.net.cn/uni-app-x/api/get-system-info.html#getsysteminfo-%E5%85%BC%E5%AE%B9%E6%80%A7)
* App Platform fixed a Bug where the padding layout of the parent element was inconsistent with the web when CSS position was set absolute [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1219)
* App-Android platform added page style configuration item to support pageOrientation to achieve horizontal screen or spin adaptation [details] (https://doc.dcloud.net.cn/uni-app-x/collocation/pagesjson.html#pages-json)
* App-Android API FileSystemManager supports file operation methods such as appendFile and readCompressedFile [details] (https://doc.dcloud.net.cn/uni-app-x/api/get-file-system-manager.html)
* the App - new Android platform API uni. $off support the second parameter is optional [details] (https://doc.dcloud.net.cn/uni-app-x/api/event-bus.html#off)
* New API UniResizeObserver for App-Android platform to monitor size changes of UniElement elements [details] (https://doc.dcloud.net.cn/uni-app-x/dom/uniresizeobserver.html)
* App-Android platform fixed a Bug that cloud packaging error was reported when the project included cloud objects but uniCloud was not used in the page
* App - the Android platform application runtime exception leads to repair the template node flash Bug back [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1578)
* App-Android platform fixed the Bug of defineSlots definition scope slot compilation error under script setup [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1551)
* App - Android platform after repair the uts packaging custom plugin base, compile error depends on can't find the Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1379)
* the App - Android platform repair ref type data interpolation shown on the template is not correct the Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1344)
* App-Android platform fixed when script setup defined ref type binding v-model, Compile possible error Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1338)
* App - Android platform repair script function declarations under setup cannot recursive call Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1312)
* the App - repair Android platform version 4.02 of a runtime exception information display incorrect [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1518)
* App-Android platform fixed a Bug where component view set overflow to visible outside the parent element area could not respond to click and touch events [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=157)
* App-Android platform fixed a Bug where the scroll-view subelement setting overflow to visible did not take effect [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1175)
* App-Android platform fixed a Bug that the sticky header component might overlap with the list-view drop-down refresh area after petting [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1242)
* App-Android platform fixes bugs that may be overwritten by list-view in some scenes after sticky-header capping [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1241)
* App-Android platform fixed a Bug where a drop-down refresh after swiper nested scroll-view could prevent swiper from sliding left and right [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1231)
* App - Android platform repair component input, textarea in some cases may be input method keep out bugs [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=947)
* App - Android platform repair component textarea set auto - height resulting in abnormal high Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1298)
* App - Android platform width of the slider to change or repair components after the change of the parent container size display confusion of Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=296)
* App-Android platform repair component keep-alive combined with Component, Open the switch components may appear blank Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1189)
* repair component web App - Android platform - the view cannot get accurate location information of Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1563)
* App - Android platform repair exit when the application may have temporarily show bad Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=896)
* App-Android platform fixes a Bug where the DOM API UniResizeObserver monitors element size changes with inaccurate callbacks in some scenarios [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1696)
* App-Android platform adjustment component switch when the background color is changed from #e5e5e5 to #e9e9ea, With other platforms zazi [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1705)
* the App - new iOS runtime exception information display source position [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1519)
* the App - iOS new onPageScroll life cycle [details] (https://doc.dcloud.net.cn/uni-app-x/page.html)
* the App - iOS new web - view support horizontalScrollBarAccess, verticalScrollBarAccess component attributes [details] (https://doc.dcloud.net.cn/uni-app-x/component/web-view.html#%E5%B1%9E%E6%80%A7)
* The filePath attribute of API uni.downloadFile added to the App-iOS platform supports uni.env [details] (https://doc.dcloud.net.cn/uni-app-x/api/download-file.html#%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9)
* the App - iOS new CSS transition - property support all | none [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1381)
* App - iOS repair component scroll - view because calculation accuracy problems may lead to vertical and horizontal sliding Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1463)
* App-iOS platform fixed the Bug that the height of the text component was not normal when it set the value of line-height without unit through class [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1458)
* App - iOS repair components switch parent element has a click event cannot respond click gesture Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1475)
* the App - iOS repair component input v - type attribute dynamic assignment modol invalid Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1510)
* App - iOS repair component textarea set cursor attributes will trigger the Bug of focus [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1465)
* App-iOS platform fixed a Bug where the cursor color turned white when textarea set CURSOR-color to null [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1469)
* App - iOS repair component textarea set auto - height resulting in abnormal high Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1298)
* App - iOS repair components after the textarea input content placeholder no hidden Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1526)
* App - iOS repair progress the component initialization failed to assign the Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1504)
* App - iOS repair component slider click slide will not trigger a change event Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1485)
* App - iOS repair component picker - view initialization assignment can not be the immediate execution of a Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1506)
* App-iOS repair component video If only the video component is used and createVideoContext is not used, Cloud packaging lack of video module Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1556)
* web App - iOS repair components - the view does not trigger the load event of Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1322)
* the App - iOS repair component swiper set the current default value is invalid Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1543)
* the App - iOS repair component nesting child component style cannot inherit the parent component style Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1505)
* the App - iOS API selectorQuery. Repair in the incoming component instance invalid Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1507)
* App-iOS platform fixed a Bug where the DrawableContext set font failed when the font information (such as "13px Arial") was present [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1472)
* App-iOS platform fixed a Bug where the confirm parameter value in the API uni.showModal click Cancel button callback function was true [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1326)
* App-iOS platform fixes Bug where API uni-getSystemInfo returns incorrect windowTop values [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1577)
* App - iOS repair CSS element width or height of 0 when set the background gradient leads to the application of flash back Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1471)
* - iOS App to repair the CSS box - shadow set to none may show the white shadow Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1467)
* App-iOS platform fixed the Bug that the CSS backgroundColor lacked transparency when doing transition animation, causing the color to be incorrect [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1468)
* App-iOS fixed a Bug where border-radius was invalid when CSS border-style was solid and border-width was set [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1470)
* the App - iOS repair CSS position from fixed dynamic switch to other value is invalid Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1527)
* the App - iOS repair CSS pointer events - is set to none effect not Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1530)
* App - iOS repair CSS transition animations in some cases, abnormal Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1531)
* the App - iOS repair CSS element dynamic Style null switching effect not Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1589)
* the App - iOS repair event bubbling in some cases may be automatically stop bugs [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1509)
* the App - repair iOS App. Uvue does not support multiple style tags Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1699)
* the App - iOS repair keep alive - rendering result incorrect Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1627)
* the App - iOS swiper some cases first repair component as a swiper - item content does not display the Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1618)
* App-iOS platform fixes a Bug where the change event callback parameter detail.current may be incorrect after the swiper component turns on the loop [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1706)
* the App - iOS repair API uni. UploadFile upload multiple files crash Bug when [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1625)
* App-iOS platform fixes Bug where API uni.getAppBaseInfo standard BaseInfo gets appId attribute value incorrectly when running on real machine [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1672)
* the App - iOS repair CSS background image - in some cases, invalid Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1667)
* - iOS App to repair the CSS border - the radius dynamic Settings take effect may not be bugs [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1619)
* App-iOS platform fixed a Bug where the transform animation of CSS transition was incorrectly animated when the translate value was set to percentage [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1633)
* App-iOS platform fixed the CSS border-color runtime expansion style error Bug [Details]
* Web platform will adjust the rollback HBuilderX version 4.11 z - the adjustment of the index defaults to 0 [details] (https://doc.dcloud.net.cn/uni-app-x/css/z-index.html)
* the Web platform, App - iOS swallow the $callMethod support call defineExpose exported method [details] (https://doc.dcloud.net.cn/uni-app-x/component/#callmethod)
* the Web platform, App - iOS structure UniError fixes no support, no parameters and a Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1455)
* within the Web platform to repair the CSS using v - bind invalid Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1370)
* Web platform repair backgroundColorContent show highly inaccurate Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1427)
* Web platform to repair the textarea components dynamically switch autoHeight can't immediate effect [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1502)
* Web platform fixed the Bug that the cursor style was invalid when the textarea and input components were disabled
* Web platform repair request interface returned array error handling in order to UTSJSONObject Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1582)
* Web platform adjustment interface related Api (showLoading, showToast, showModal, showActionSheet) style adjustment, align the App side
* Web platform fixed a Bug that the dynamic change of enablePullDownRefresh for $setPageStyle to true was invalid [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1632)
Swallow the $* Web platform callMethod support call defineExpose exported method [details] (https://doc.dcloud.net.cn/uni-app-x/component/#callmethod)
* Web platform added page styles and globalStyle support for backgroundColorContent [details] (https://doc.dcloud.net.cn/uni-app-x/collocation/pagesjson.html#pages-globalstyle)
* Web platform new scroll view, the list view support custom dropdown refresh [details] (https://doc.dcloud.net.cn/uni-app-x/component/scroll-view.html)
* new list - view the Web platform supporting the drop-down to refresh the relevant properties and events [details] (https://doc.dcloud.net.cn/uni-app-x/component/list-view.html)
* Web platform structure UniError fixes no support, no parameters and a Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1455)
* within the Web platform to repair the CSS using v - bind invalid Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1370)
* Web platform repair request interface returned array error handling in order to UTSJSONObject Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1582)
* Web platform fixed scroll - view components drop-down refresh related event attributes of the lack of dy Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=932)
* Web platform to repair the navigator component wife element part of the style the invalid Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1025)
* Web platform repair input, textarea components within maxlength cannot restrict set the value of the Bug in uts [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1204)
* Web platform to repair the textarea components dynamically switch autoHeight can't immediate effect [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1502)
* Web platform fixed the Bug that the cursor style was invalid when the textarea and input components were disabled
* Web platform adjustment interface related Api (showLoading, showToast, showModal, showActionSheet) style adjustment, align the App side
* The Web platform adjusts the textarea and input maxlength properties to an illegal value without limiting the length. The default adjustment is not limiting the length
* The Web platform adjusts the progress component's percent attribute to 0% when passed an illegal value, up from NaN
* font-family of the body is adjusted to "-apple-system", HelveticaNeue; ', consistent with system fonts on iOS
* The background color of the Web platform adjustment component when switch is off is changed from rgba(0,0,0,.1) to #e9e9ea
* Adjust the default z-index of built-in components and page containers on the Web platform from auto to 0
### uts plugin
* when repairing and deconstructing Web platform, the default value cannot override the Bug of null [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1076).
* the compiler fixed the Bug that the dynamic library related to the compiler on the Windows platform did not have a digital signature, which may be intercepted by some antivirus software and lead to compilation failure.
* App platform fixes optional attributes in interface that may compile incorrect Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1202).
* App platform optimizes unierror.uts error object constructor in API plug-in template, which is compatible with web platform.
* App platform fixed the Bug of compiling errors when regular expressions contain double quotes [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1428).
* App-Android platform fixes Bug that cannot be assigned again after declaring UTSJSONObject type [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=851).
* when the App-Android platform repair switch statement default statement contains only break, the Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=852)) of the error is compiled.
* App-Android platform fixes Bug where String.match is inconsistent with web platform [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=835).
* App-Android platform fixes Bug whose results of RegExp.exec matching capture group are inconsistent with those of web platform [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=954).
* App-Android platform fixes Bug where the date data returned by Date toISOString/toJSON may deviate by one day [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1464).
* iOS platform repair object failed to convert to specified type of Bug when literal as is converted to type in uni-module app-js [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1314).
* Bug error reported when repairing if else empty statements on App-iOS platform [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1351).
* when App-iOS platform fixes class definition of no-parameter constructor, compiling error Bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1342).
* App-iOS platform fixes getter of boolean type defined by class and Bug of error when setter is compiled [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=1332)
### App插件
* the uni-AD module adjusts the advertising provider identity returned in the getProvider method of advertising object and the onVerify callback event of motivating video object. The range of values are china and global.
* Android platform updates the map / positioning module Amap SDK is version 10.0.600, Gaode location SDK is version 6.4.3, to solve some cases of positioning failure Bug [details] (https://ask.dcloud.net.cn/question/187119)).
* the core component SDK for updating UniPush on Android platform is version 3.2.13.0, and the version of SDK is version 3.3.5.0, which solves the Bug [details] (https://ask.dcloud.net.cn/question/188266)) that frequently collects information from compliance reports.
* the manual killing process of Android platform repair may report the Bug of java.util.ConcurrentModificationException [details] (https://ask.dcloud.net.cn/question/186990).
* Android platform fixed incorrect Bug of filename returned after successful download when plus.downloader.createDownload saved some device settings files illegally [details] (https://ask.dcloud.net.cn/question/188982)).
* Android platform update statistics module Youmeng Statistics SDK is version 9.6.8 [details] (https://ask.dcloud.net.cn/question/189922).
* iOS platform updates uni-AD SDK Tencent Youquan SDK version 4.14.70; Kuaishou ad SDK 3.3.63, Kuaishou content Alliance SDK 3.3.61; Pangolin & GroMore SDK 6.0.0.5; Sigmob Advertising Alliance SDK 4.12.4; Baidu Baiqing Advertising SDK 5.34.
* iOS platform fixes Bug in native plug-ins that use shared files to report no permission errors.
* iOS platform update push module FCM SDK is version 10.23.1.
* iOS platform update statistics module Google Statistics SDK is version 10.23.1.
* iOS platform update login module Facebook SDK is version 17.0.0; Google SDK is version 7.1.0.
* iOS platform fixes Bug flickering during runtime of offline SDK integration PDFNet.framework.
* iOS platform repair one-click login to replace the mobile phone card may still return the Bug of the previous mobile phone number.
* iOS platform fixes atob to handle Bug with possible exceptions to specific strings.
* [important] Privacy list for iOS platform is added to meet the new compliance requirements of Appstore from May 1st [documentation] (https://uniapp.dcloud.net.cn/tutorial/app-ios-privacyinfo.html).
* update uni-AD module Quickhand Advertising and Kuaishou content Alliance SDK Android version 4.14.32; Google AdMob SDK iOS version 11.2.0
### uniCloud plugin
* Fixed the bug caused by version 4.07 that cannot be uploaded to front-end web hosting [Details](https://ask.dcloud.net.cn/question/188503)

## 4.08.2024040127
### HBuilder
* Fixed the bug that the uni-app cli project vue3 cannot run when using vite [Details](https://ask.dcloud.net.cn/question/188578)

## 4.07.2024032720
### HBuilder
* Fixed the bug that when uni-app is run on a real machine and the simulator supports multi-cpu architecture, the standard base falsely reports that it is not supported [Details](https://ask.dcloud.net.cn/question/186863)
* Fixed the bug that when the built-in browser of uni-app is opened, switching files causes unrunning projects to run automatically [Details](https://ask.dcloud.net.cn/question/188432)
* Fixed the bug that the release directory prompt of the uni-app cli project is that the web is actually packaged into h5 [Details](https://ask.dcloud.net.cn/question/188468)
* Fixed the bug that the custom running of uni-app to web package.json does not take effect when running to the built-in browser [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=1084)
### uni-app plugin
* Web, App platform, Fixed the bug in version 4.06 where the border style was incorrect after changing the button's border-radius [Details](https://ask.dcloud.net.cn/question/188417)
### uni-app x plugin
* Web platform, Fixed the bug in version 4.06 where the border style was incorrect after changing the button's border-radius

## 4.06.2024032513
### HBuilder
* Language Server: Added uni-app x to support multi-platform code prompts and grammar verification, and can switch language services by platform [Details](https://hx.dcloud.net.cn/Tutorial/Language/language_service_target_support)
* Language Server: Added uni ext api, supporting interface.uts specification [Details](https://uniapp.dcloud.net.cn/api/extapi.html#%E5%A6%82%E4%BD%95%E5%BC%80%E5%8F%91uni-ext-api)
* Language Server: Upgrade the built-in typescript library from `4.5.5` to `5.2.2`
* Language Server: Fixed the bug of $ appearing in tag code completion when opening a file in a shared directory [Details](https://ask.dcloud.net.cn/question/182857)
* Language Server: Fix: In some cases, css cannot be transferred to the defined bug [Details](https://ask.dcloud.net.cn/question/184780)
* Language Server: Fix the bug that pages.json, path prompts incorrect page path [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=466)
* Language Server: Fix the bug that caused the file to be occupied and unable to be renamed after displaying the reference results after searching for references.
* Language Server: Fixed the bug that causes performance degradation when uni-app x uts code imports too many Android platform libraries
* Language Server: Fixed the bug that the globalProperties attribute defined in uni-app x main.uts cannot be prompted in other uvue pages
* Language Server: Fixed the bug that when uni-app x import imports uvue files, the path cannot go to the defined bug
* Language Server: Fixed the bug that when opening multiple html files, switching to the previous html, variables floating, going to definition, etc. may not be correct if it is not modified.
* Language Server: Fixed the bug that uni api is not prompted under uni_modules utssdk
* Language Server: Fixed the bug that caused the code prompts to become slower and slower when developing uniCloud cloud functions and cloud objects.
* Language Server: Fixed the bug of importing vue type error when using vue3+ts in uni-app project [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=720)
* Language Server: Fixed the bug where the pinia module search error caused false alarms when using ts in the uni-app project [Details](https://ask.dcloud.net.cn/question/185148)
* Language Server: Fixed uts Android, automatically fix the bug that when there are multiple import package options, the import result of selecting an option other than the first one is incorrect.
* Language Server: UTS plugin, Auto-importing packages without a newline after the first line when no other import nodes exist in the current file.
* Language Server: uts syntax check, When the function parameter type is `UTSJSONObject`, when calling the function and using a literal object to pass parameters, a false positive type mismatch bug occurs
* Language Server: uts syntax check `instanceof` does not allow the type defined by type to be used as a value.
* Added Git-blame plug-in to display git log at the end of the code line, which needs to be downloaded from the plug-in market. [Details](https://ext.dcloud.net.cn/plugin?id=16568) [Details](https://hx.dcloud.net.cn/Tutorial/SourceControl/Git/git_blame)
* Plug-in: New im-notifier plug-in Receive new message notifications from uni-im and prompt users [Details](https://ext.dcloud.net.cn/plugin?name=im-notifier)
* Plug-in: Adjust the bug reporting plug-in. The HBuilder running logs, uni-app console logs, etc. that are checked when reporting bugs are uploaded to be visible only to administrators.
* Plug-in: Optimize the bug reporting plug-in. After submitting a bug, click the details to jump to the issues system to support automatic login.
* Plug-in: Repair bug reporting plug-in macOSX cannot paste pictures when reporting bugs [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=372)
* Fixed AI virtual row style exception when switching themes. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=360)
* Optimize network error prompts in HBuilderX login interface
* Added support for system associated icons for windows uts and uvue files
* Fixed the bug that prompts HBuilderX to prevent shutdown when Windows computer is shut down
* Fixed the bug that when a menu pops up in a certain window in MacOSX multi-window situation, and then the mouse clicks on another window, the focus state and activated window are incorrect.
* Fixed a bug in the MacOSX project manager & built-in resource management that uses shortcut keys to rename file names. When entering the editing state, triggering the shortcut keys again will not automatically commit the changes. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=795)
* Fixed a bug that caused memory leaks when part of the memory was not recycled properly when the editor was opened or closed.
* Fixed a bug where a certain position may be lost when returning to the previous cursor position when quickly going to the definition continuously.
* Fixed the bug that may cause the interface to become unresponsive in a weak network environment when creating a new project
* Fixed the bug that the preview interface cannot disappear when the folded line in the code folding preview is at the last line of the screen
* Fixed the bug that the Prettier plug-in does not recognize the embedded uts code when formatting uvue [Details](https://ext.dcloud.net.cn/plugin?id=2025)
* Fixed the bug that when the console file link is clicked to jump to the editor, if the target line is collapsed, it will not automatically expand.
* Fixed the bug of incorrect coloring of jsdoc @tag under vue file script.
* MarkDown: Fixed a bug that caused the preview to fail when the markdown preview file name contained a + sign or other special symbols. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=463)
* MarkDown: Fixed a bug in markdown preview that caused the preview to fail if the file name was modified after previewing. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=369)
* MarkDown: Fixed the bug that markdown preview cannot be parsed and rendered normally when embedded html code [Details](https://ask.dcloud.net.cn/question/184421)
* Html preview: Fixed the bug in html preview where external html files cannot be run into the browser [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=411)
* Html preview: Fixed the bug that the reference to relative path resources in html preview does not take effect
* Html preview: Fixed the bug that the built-in browser log cannot be output to the console when the html file path of the html preview contains Chinese characters.
* Html preview: Fixed the bug that the Html preview sub-menu item `Save and automatically refresh the browser` is not displayed in the run menu [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=721)
* Html preview: Fixed the bug of 404 reported when previewing html files when the project directory name contains the character '.'
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
* Fixed the bug that uni-app (x) HBuilderX may falsely report that the `uniapp-extension` plug-in has been tampered with when it is started and click Run immediately.
* Fixed a bug in uni-app (x) that caused HBuilderX to crash when clicking preview after opening an image file in the editor.
* Adjust uni-app (x) to run on the web, adjust the console log output format
* Adjust uni-app x to run on Android, adjust console log output format
* Fixed uni-app x, project contains uts plugin, run to custom base, Bug in running error when `Clean build cache` is checked [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=781)
* Mobile App Playground: Fixed uni-app, after the iOS standard base is signed, it will not be automatically deleted during the next upgrade, causing the re-signed base that runs after the upgrade to be a bug in the previous version
* Mobile App Playground: Fixed the bug of uni-app x custom debugging base. After upgrading HBuilderX, the base version mismatch was not prompted.
* Added uts plug-in uts Android plug-in development, supporting Gradle 8.x [Details](https://uniapp.dcloud.net.cn/tutorial/run/uts-development-android.html#%E9%85%8D%E7%BD%AE-gradle-jdk)
* uni-app: Fixed the bug that the format of manifest.json is incorrect when copying permissions to the Android permission configuration interface [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=370)
* uni-app: Fixed the bug that when the plug-in market imports a project and the project only supports vue2, the vue3 button on the import interface can still be clicked.
### uni-app plugin
* App-Android platform, fix the bug that the location list cannot be obtained after the first call of uni.chooseLocation after installation [details](https://ask.dcloud.net.cn/question/183239)
* App-Android platform, fix the bug that the outer swiper cannot slide when the nvue swiper component is embedded in the swiper setting disable-touch
* App Fixed the bug that the nvue page of the Vue2 project cannot reference static resources in non-static directories.
* App platform Fixed the bug of compile error in nvue page of Vue2 Cli project [Details](https://ask.dcloud.net.cn/question/186784)
* App-Android platform Added API uni.getChannelManager to get the notification channel manager [Details](https://uniapp.dcloud.net.cn/api/plugins/push.html#getChannelManager)
* App-Android platform, fix the first installation call uni.scanCode may have a black screen bug [details](https://ask.dcloud.net.cn/question/185913)
* Web platform, new vue3 scroll-view component supports show-scrollbar attribute
* Web App-Vue Added input component supports cursor-color attribute. [Details](https://uniapp.dcloud.net.cn/component/input.html#input)
* Web App-Vue Added textarea component supports cursor-color attribute. [Details](https://uniapp.dcloud.net.cn/component/textarea.html#textarea)
* Web Fixed the bug of duplicate static resources after packaging the Vue2 project. [Details](https://ask.dcloud.net.cn/question/184480)
* Web Optimize the vue3 project getCurrentPages() returns the options property. [Details](https://ask.dcloud.net.cn/question/183580)
* Web Fixed the bug of Vue3 project ssr running error [Details](https://ask.dcloud.net.cn/question/185205)
* Web Fixed the bug of Vue3 project ssr packaging error [Details](https://ask.dcloud.net.cn/question/184125)
* Web Adjust The A label in the node rendered by the navigator component is moved from the outside of the uni-navigator label to the inside of the uni-navigator label.
* Web Fixed the bug of Vue3 project automation testing element.input method error [Details](https://ask.dcloud.net.cn/question/184815)
* Web platform Fix the bug of conditional compilation failure for .scss files in Vue3 project.
* Web platform Fixed The previous page is blank during iOS safari gesture back [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=941)
* Mini Program Fixed the bug of slow compilation when there are large base64 characters on the page. [Details](https://ask.dcloud.net.cn/question/4661)
* Weixin Mini Program Fixed the bug in the vue2 project where workers are configured as objects. [Details](https://github.com/dcloudio/uni-app/issues/4589)
* Weixin Mini Program Fixed a bug in Vue2 project where class line breaks cause errors in mini program compilation. [Details](https://ask.dcloud.net.cn/question/184192)
* Weixin Mini Program Added uni.requestVirtualPayment API [Details](https://uniapp.dcloud.net.cn/api/plugins/virtualPayment.html)
* TikTok Mini Program Fixed the bug with invalid rtc room component properties. [Details](https://github.com/dcloudio/uni-app/issues/4627)
* Alipay Mini Program platform, fix the bug that globalObjectMode is configured to enable compilation error [details](https://ask.dcloud.net.cn/question/183499)
* Alipay Mini Program platform, fix, native Mini Program component delivery props invalid bug [details](https://github.com/dcloudio/uni-app/issues/4376)
* TikTok Mini Program Added The component supports virtualHost configuration [Details](https://uniapp.dcloud.net.cn/tutorial/vue3-api.html#其他配置)
* TikTok Mini Program Fixed the bug of attribute loss when Vue3 project uses plug-in [Details](https://ask.dcloud.net.cn/question/185513)
* TikTok Mini Program Fixed the bug in Vue2 project using internationalization error [Details](https://ask.dcloud.net.cn/question/161008)
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
* Web Adjust The A label in the node rendered by the navigator component is moved from the outside of the uni-navigator label to the inside of the uni-navigator label.
* Web Adjust When the getStorage and getStorageSync operations return data of the object type, it is converted to the UTSJSONObject type
* Web Adjust The data returned by the request operation is converted to the UTSJSONObject type
* Web Fixed Unused easycom components contain errors or unsupported usage on the web side that cause compilation errors
* Web Fixed In some scenarios, an error occurs when using the literal value of an object as a specified type.
* Web Fixed When referencing a .uvue file, the module cannot be found without a suffix.
* Web Fixed In some scenarios, the conditional compilation in the uts file is invalid.
* Web Adjust Type validation failures are adjusted from an error to a warning without interrupting compilation.
* Web Added Map types are supported when binding classes and styles.
* Web platform, Added The list-view and list-item components are supported [Details](https://doc.dcloud.net.cn/uni-app-x/component/list-view.html)
* Web platform, Added The sticky-section and sticky-header components are supported [Details](https://doc.dcloud.net.cn/uni-app-x/component/list-view.html)
* Web platform, Fixed In some scenarios, the type inference does not use the object literal as UTSJSONObject [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=819)
* Web platform, Fixed The bug that prevents instances from being created correctly when any[] is included in the type literal [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=767)
* Web platform, Fixed The bug that does not automatically create an instance when a variable is declared as non-globally declared type [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=782)
* Web platform, Fixed The bug that $forceUpdate failed to update the contents of the built-in component slot [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=776)
* Web platform, Fixed The bug that the exported type cannot be found when the newly exported type in the hot-update UTS file is used [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=823)
* Web platform, Fixed The request, uploadFile, and downloadFile APIs timeout immediately when timeout parameter is null [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=805)
* Web, App-Android platform, Fixed UniElement The tagName and nodeName is not consistent with the component name [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=766)
* Web, App-Android platform, Fixed The bug that $parent does not skip the built-in components [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=773)
* Web, App-Android platform, Added API uni.rpx2px [Details](https://doc.dcloud.net.cn/uni-app-x/api/rpx2px.html)
* Web platform Adjust When running to the browser, compile the code in the script tag into compatible code that can be run in earlier browsers
* Web platform Optimized Reduce compilation time
* Web platform Fixed Api uni.rpx2px report an error after the project is released [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=930)
* Web platform Fixed An error is reported by using instanceof UniXXXElement [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=940)
* Web platform Fixed In some cases, the picker-view and picker-view-column values are displayed incorrectly, and the change event is triggered. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=1009)
* App-Android platform, Fixed the bug where the template unexpectedly compiles an object into a map. [details](https://issues.dcloud.net.cn/pages/issues/detail?id=244)
* App-Android platform, fix the bug that occurs when deleting child elements inside slots of special elements (list-view, etc.) [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=388)
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
* App-Android platform, updated, cloud packaging environment compileSdkVersion is 34
* App-Android platform, fix the bug that clicking tab switch crashes when tabBar configures pagePath incorrectly [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=779)
* App-Android platform, fix the bug that may compile an error when using UTSAndroid.getJavaClass to get imported classes [details](https://issues.dcloud.net.cn/pages/issues/detail?id=809)
* App-Android platform, fix unicloud-db component, use setup syntax, the bug that data cannot be used in the scope slot [details](https://issues.dcloud.net.cn/pages/issues/detail?id=761)
* App-Android platform  fix A bug occurs when a numeric error code is returned by a cloud object [details](https://issues.dcloud.net.cn/pages/issues/detail?id=840)
* App-Android platform, optimize the construction of type-type responsive objects, avoid the use of reflection, and optimize performance
* Fixed the bug on the App-Android platform where conditional compilation in APP-PLUS was effective.  [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=910)
* Fixed the bug where conditional compilation was not effective during pre-check in pages.json. [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=909)
### uts plugin
* Fixed An error was reported when compiling the array type of the special value field string.
* Android platform, add'typeof 'operator to support platform-specific character type'Char' [Details] (https://doc.dcloud.net.cn/uni-app-x/uts/operator.html#typeof)
* App-Android platform, fix the bug that the constructor uses super to report an error when locally defining a class [Details] (https://issues.dcloud.net.cn/pages/issues/detail?id=802)
* App-Android platform, add interface.uts file to support export declare syntax [Details] (https://issues.dcloud.net.cn/pages/issues/detail?id=744)
* App-Android platform, fix import * as Types from'xxx 'import type compilation error bug [details] (https://issues.dcloud.net.cn/pages/issues/detail?id=696)
* App-iOS platform, add @UTSiOS.keyword ('fileprivate') annotation to solve the access control of custom swift classes and properties
### uniCloud Plugin
* Plug-in: uni-pay supports virtual payments for WeChat mini programs [Details](https://doc.dcloud.net.cn/uniCloud/uni-pay/wxpay-virtual.html)
* Added uni-pay-x, uni-app x version of uni-pay [Details](https://doc.dcloud.net.cn/uniCloud/uni-pay/uni-app-x.html)
* Added `uniCloud.httpProxyForEip.get` API to support headers field
* Added Alipay Mini Program Cloud Database to support geographical location query
* Added: When running a cloud function, the console can click on the cloud function name to jump to the corresponding cloud function.
* Added: When the local node version of the cloud function is inconsistent with the cloud node version, uploading the cloud function will prompt the local node version and the cloud node version.
* Fixed the bug caused by version 3.98 that caused the cli project to be unable to download to the specified location when downloading cloud functions or public modules
* Fixed the bug that the cloud function will still be uploaded after failure to install dependencies when uploading cloud functions
* Fixed the bug that the node_modules directory would not be removed when uploading public modules
* Fixed the bug that the geographical location query/index API cannot be used when running locally
* Fixed the bug that the associated service space is not displayed when opening the cloud space again after the project is closed [Details](https://ask.dcloud.net.cn/question/186741)
* Fixed the bug that the unicloud directory is incorrectly recognized when running associated with other projects
* Fixed the bug of no response when clicking the associated service space when not logged in
* Fixed the bug that the virtual directory cannot be displayed correctly when Alipay Mini Program Cloud, Alibaba Cloud, and Tencent Cloud spaces exist at the same time
* Fixed The security network client verification function cannot be used caused by version 3.97.
* Fixed the bug that the selected statement will not be executed in the JQL manager [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=534)
* Fixed the bug that Alipay applet cloud Redis local debugging cannot run
* Fixed the bug that the front-end web hosting upload did not automatically select the service space bound to the current project
* Fixed a bug where associated projects can still be switched when switching cloud vendors in the associated service space
* Fixed the bug that the "upload schema extension js configuration" timeout was too short, causing the upload to fail.
* Fixed the bug that projects created by cli cannot upload schema [Details](https://issues.dcloud.net.cn/pages/issues/detail?id=592)
* Fixed the bug of invalid query using native MongoDB $ in Alipay Mini Program Cloud Database [Details](https://ask.dcloud.net.cn/question/183811)
* Fixed the bug of JQL connection table query in Alipay Mini Program Cloud Database [Details](https://ask.dcloud.net.cn/question/185177)
* Fixed the bug that cloud functions can only be associated with public functions under uni_modules [Details](https://ask.dcloud.net.cn/question/184434)
* Adjust Aliyun The size limit of URL request body is adjusted from 1 MB to 2 MB, and the size limit of response body is adjusted from 1 MB to 2 MB

## ReleaseNote
[https://download1.dcloud.net.cn/hbuilderx/changelog/ReleaseNote_release_archive_en_2023.html](https://download1.dcloud.net.cn/hbuilderx/changelog/ReleaseNote_release_archive_en_2023.html)
