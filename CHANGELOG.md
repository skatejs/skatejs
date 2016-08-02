<a name="1.0.1"></a>
## [1.0.1](https://github.com/skatejs/skatejs/compare/v1.0.0-beta.20...v1.0.1) (2016-08-02)


### Features

* Update string prop so that it defaults to an empty string. ([1c70077](https://github.com/skatejs/skatejs/commit/1c70077))


### BREAKING CHANGES

* string prop now defaults to an empty string



<a name="1.0.0-beta.20"></a>
# [1.0.0-beta.20](https://github.com/skatejs/skatejs/compare/v1.0.0-beta.19...v1.0.0-beta.20) (2016-08-01)


### Bug Fixes

* **events:** Fix events so onTest binds test instead of Test. ([6ab7bbf](https://github.com/skatejs/skatejs/commit/6ab7bbf))
* attributeChanged fixed ([c86657a](https://github.com/skatejs/skatejs/commit/c86657a))
* fix after merge ([fa4be45](https://github.com/skatejs/skatejs/commit/fa4be45))
* HTMLElement change to normal function instead of arrow ([6174eae](https://github.com/skatejs/skatejs/commit/6174eae))


### Code Refactoring

* Remove support for v0 custom element polyfill and only do simple checks for polyfills as t ([d23b0d9](https://github.com/skatejs/skatejs/commit/d23b0d9))


### BREAKING CHANGES

* removed temporary support for the v0 custom element polyfill.



<a name="1.0.0-beta.19"></a>
# [1.0.0-beta.19](https://github.com/skatejs/skatejs/compare/v1.0.0-beta.18...v1.0.0-beta.19) (2016-07-28)


### Bug Fixes

* **render:** Fix issue causing updated() to not be called on subsequent updates because the renderin ([5fc6abc](https://github.com/skatejs/skatejs/commit/5fc6abc))



<a name="1.0.0-beta.18"></a>
# [1.0.0-beta.18](https://github.com/skatejs/skatejs/compare/v1.0.0-beta.17...v1.0.0-beta.18) (2016-07-28)


### Code Refactoring

* No need to pass the nextProps when calling updated() because you can get that from the ele ([d79e1a0](https://github.com/skatejs/skatejs/commit/d79e1a0))
* Rename beforeRender() to updated(), call it even if render() isn't defined and rename afte ([e344e6c](https://github.com/skatejs/skatejs/commit/e344e6c))


### BREAKING CHANGES

* remove nextProps argument to updated(). Just use the element instead.
* always call updated(). beforeRender() -> updated(). afterRender() -> rendered().



<a name="1.0.0-beta.17"></a>
# [1.0.0-beta.17](https://github.com/skatejs/skatejs/compare/v1.0.0-beta.16...v1.0.0-beta.17) (2016-07-28)


### Code Refactoring

* Remove property events. ([10b46ed](https://github.com/skatejs/skatejs/commit/10b46ed))
* Rename state() to props() to be consistent with what it's operating on. ([2f0e379](https://github.com/skatejs/skatejs/commit/2f0e379))
* Stub out tests for beforeRender() and change existing behaviour so that tests pass. ([9f6cf08](https://github.com/skatejs/skatejs/commit/9f6cf08))


### Features

* **events:** Support onTest and on-test. ([031c860](https://github.com/skatejs/skatejs/commit/031c860))
* beforeRender() now uses a return value instead of a callback. ([60d0648](https://github.com/skatejs/skatejs/commit/60d0648))
* Pass special props through to function helpers and ensure they don't appear as attrs on the el ([5b9a03a](https://github.com/skatejs/skatejs/commit/5b9a03a))


### BREAKING CHANGES

* rename state() to props(). Closes #677.
* remove property events.
* Return value from beforeRender() is now used instead of a callback. It is also
called on the initial render now, too.
* shouldRender() changed to beforeRender() and now uses a callback instead of a
return value to re-render.
* events: ontest no longer works. Implements #694.



<a name="1.0.0-beta.16"></a>
# [1.0.0-beta.16](https://github.com/skatejs/skatejs/compare/v1.0.0-beta.15...v1.0.0-beta.16) (2016-07-27)


### Bug Fixes

* **state:** Fix issue causing props who have a value of undefiend not to be returned in the state. ([b996b73](https://github.com/skatejs/skatejs/commit/b996b73)), closes [#693](https://github.com/skatejs/skatejs/issues/693)



<a name="1.0.0-beta.15"></a>
# [1.0.0-beta.15](https://github.com/skatejs/skatejs/compare/v1.0.0-beta.14...v1.0.0-beta.15) (2016-07-27)



<a name="1.0.0-beta.14"></a>
# [1.0.0-beta.14](https://github.com/skatejs/skatejs/compare/v1.0.0-beta.13...v1.0.0-beta.14) (2016-07-27)


### Performance Improvements

* Ensure perf tests work with polyfills. ([6599fea](https://github.com/skatejs/skatejs/commit/6599fea))



<a name="1.0.0-beta.13"></a>
# [1.0.0-beta.13](https://github.com/skatejs/skatejs/compare/v1.0.0-beta.12...v1.0.0-beta.13) (2016-07-27)


### Bug Fixes

* **ready:** Ready wasn't removed in the last commit. ([59b1eba](https://github.com/skatejs/skatejs/commit/59b1eba))
* **vdom:** Fix refs in IE11. Function.name isn't reliable in IE11. ([49c6c4a](https://github.com/skatejs/skatejs/commit/49c6c4a))


### Code Refactoring

* Remove automatic adding of definedAttribute. ([151543e](https://github.com/skatejs/skatejs/commit/151543e))


### Features

* Move rendering into the connectedCallback() so that no unnecessary renders occur. ([3c0fe15](https://github.com/skatejs/skatejs/commit/3c0fe15))


### Performance Improvements

* Get perf tests running. Ensure we're using the production version of React (still using dev ve ([c4cc5cd](https://github.com/skatejs/skatejs/commit/c4cc5cd))
* Make perf tests async for Firefox, but Firefox is still not running the Skate tests (possibly ([06096db](https://github.com/skatejs/skatejs/commit/06096db))
* Update perf tests to not use keys to see the difference (this might be the more common use cas ([683b2df](https://github.com/skatejs/skatejs/commit/683b2df))


### BREAKING CHANGES

* #688 removed definedAttribute
* ready: ready() callback was removed.
* removed ready() callback. BREAKING CHANGE: removed the render() option from props
in favour of the shouldRender() main callback on the constructor.



<a name="1.0.0-beta.12"></a>
# [1.0.0-beta.12](https://github.com/skatejs/skatejs/compare/v1.0.0-beta.11...v1.0.0-beta.12) (2016-07-20)


### Bug Fixes

* **vdom:** Refine function helper tests and fix code to fix tests (fucntion helpers calling IDOM dir ([5090056](https://github.com/skatejs/skatejs/commit/5090056))


### Features

* change generating unique name ([bb93d02](https://github.com/skatejs/skatejs/commit/bb93d02))



<a name="1.0.0-beta.11"></a>
# [1.0.0-beta.11](https://github.com/skatejs/skatejs/compare/v1.0.0-beta.10...v1.0.0-beta.11) (2016-07-19)


### Bug Fixes

* fixed native polyfill detection ([68cef01](https://github.com/skatejs/skatejs/commit/68cef01))
* fixed registerUniqueName and added a few tests ([b1072eb](https://github.com/skatejs/skatejs/commit/b1072eb))
* **vdom:** Fix issue causing elementVoid() to fail when passed a function helper as a tag name. ([8d92f11](https://github.com/skatejs/skatejs/commit/8d92f11))


### Code Refactoring

* **events:** Remove events functionality in favour of just using the on* syntax in render(). ([910a7ad](https://github.com/skatejs/skatejs/commit/910a7ad))


### BREAKING CHANGES

* events: Remove events spec in favour of on* attributes in render(). Implements #675.



<a name="1.0.0-beta.10"></a>
# [1.0.0-beta.10](https://github.com/skatejs/skatejs/compare/v1.0.0-beta.9...v1.0.0-beta.10) (2016-07-15)


### Bug Fixes

* **symbols:** Revert breaking symbol prefix ($). ([226fb58](https://github.com/skatejs/skatejs/commit/226fb58))



<a name="1.0.0-beta.9"></a>
# [1.0.0-beta.9](https://github.com/skatejs/skatejs/compare/v1.0.0-beta.8...v1.0.0-beta.9) (2016-07-14)


### Features

* **define:** Allow registering of multiple components with the same name. ([9830bc8](https://github.com/skatejs/skatejs/commit/9830bc8))
* **vdom:** Add support for a ref() callback as a prop on any node. ([5911d3b](https://github.com/skatejs/skatejs/commit/5911d3b))



<a name="1.0.0-beta.8"></a>
# [1.0.0-beta.8](https://github.com/skatejs/skatejs/compare/v1.0.0-beta.7...v1.0.0-beta.8) (2016-07-13)


### Bug Fixes

* **event:** Fix issue causing event-delgation matching to fail because we were trying to match again ([0c32662](https://github.com/skatejs/skatejs/commit/0c32662))
* **support:** Fix issue causing the v0 custom element HTMLElement override to be used even in v1 env ([5a52fa0](https://github.com/skatejs/skatejs/commit/5a52fa0))
* **vdom:** Add tests for every argument permutation to vdom.element() and fix the textContent issue. ([c321c1a](https://github.com/skatejs/skatejs/commit/c321c1a))
* **vdom:** Move the return if the value is false to below the props setting for components so that i ([8d98af0](https://github.com/skatejs/skatejs/commit/8d98af0))
* Fixes issue with polyfills overriding native shadowDOM functions ([924d7f7](https://github.com/skatejs/skatejs/commit/924d7f7))
* Test with the stable v0 custom element polyfill and fix tests in it. ([fff7c20](https://github.com/skatejs/skatejs/commit/fff7c20))


### Features

* **vdom:** Add tests for different levels of elements and passing children at each level, and add o ([baee545](https://github.com/skatejs/skatejs/commit/baee545))
* **vdom:** Implement ability to pass functions as tag names to all vdom functions. ([086f6d9](https://github.com/skatejs/skatejs/commit/086f6d9))



<a name="1.0.0-beta.7"></a>
# [1.0.0-beta.7](https://github.com/skatejs/skatejs/compare/v1.0.0-beta.6...v1.0.0-beta.7) (2016-07-01)


### Code Refactoring

* Export only the virtual element functions in Incremental DOM from our vdom module. Test to ([c576183](https://github.com/skatejs/skatejs/commit/c576183))


### BREAKING CHANGES

* export Incremental DOM virtual element functions directly instead of the whole
IncrementalDOM namespace. This removes non-virtual element functions.



<a name="1.0.0-beta.6"></a>
# [1.0.0-beta.6](https://github.com/skatejs/skatejs/compare/v1.0.0-beta.5...v1.0.0-beta.6) (2016-06-28)


### Bug Fixes

* **dist:** Fix webpacked dist so that it exports skate not skatejs to the global. ([3c9fd3a](https://github.com/skatejs/skatejs/commit/3c9fd3a))



<a name="1.0.0-beta.5"></a>
# [1.0.0-beta.5](https://github.com/skatejs/skatejs/compare/v1.0.0-beta.4...v1.0.0-beta.5) (2016-06-28)



<a name="1.0.0-beta.4"></a>
# [1.0.0-beta.4](https://github.com/skatejs/skatejs/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2016-06-27)


### Bug Fixes

* **vdom:** Ensure process is defined so incremental-dom doesn't throw errors. ([895ecdb](https://github.com/skatejs/skatejs/commit/895ecdb))



<a name="1.0.0-beta.3"></a>
# [1.0.0-beta.3](https://github.com/skatejs/skatejs/compare/1.0.0-beta.2...v1.0.0-beta.3) (2016-06-27)


### Bug Fixes

* **events:** Events bound via the on* syntax should catch bubbled events. ([a658dcc](https://github.com/skatejs/skatejs/commit/a658dcc))
* **test:** Fix test that was breaking because element was not in the dom. ([0eef0a4](https://github.com/skatejs/skatejs/commit/0eef0a4))


### Code Refactoring

* **factory:** Remove factory() as it doesn't add much benefit. ([b0cb3ca](https://github.com/skatejs/skatejs/commit/b0cb3ca))
* **vdom:** Removed vdom.* functions and renamed vdom.create() to vdom.element(). ([a45c34b](https://github.com/skatejs/skatejs/commit/a45c34b))
* **version:** Remove version module and tests. ([cc626f9](https://github.com/skatejs/skatejs/commit/cc626f9))


### Features

* **custom elements:** Make compat with v0 API that's native in Chrome and Opera. ([9dc841e](https://github.com/skatejs/skatejs/commit/9dc841e))
* **custom elements:** Prefer custom elements v0. Enable v1 polyfill so tests run in v0 Blink and v1 ([0a956fa](https://github.com/skatejs/skatejs/commit/0a956fa))
* number prop now defaults to zero ([2dda59e](https://github.com/skatejs/skatejs/commit/2dda59e))


### BREAKING CHANGES

* factory: remove factory() #622
* version: remove version module #619
* vdom: #617 - remove vdom.* functions and rename vdom.create() to vdom.element().



<a name="1.0.0-beta.2"></a>
# [1.0.0-beta.2](https://github.com/skatejs/skatejs/compare/v1.0.0-beta.1...1.0.0-beta.2) (2016-06-20)


### Bug Fixes

* **vdom:** Remove node env setting for incremental DOM. This shouldn't be necessary anyomre and some ([05ef1fa](https://github.com/skatejs/skatejs/commit/05ef1fa))



<a name="1.0.0-beta.1"></a>
# [1.0.0-beta.1](https://github.com/skatejs/skatejs/compare/1.0.0-beta.0...v1.0.0-beta.1) (2016-06-15)


### Bug Fixes

* **vdom:** Fix issue causing content elements to be output even when a v1 polyfill was on the page. ([6962420](https://github.com/skatejs/skatejs/commit/6962420))



<a name="1.0.0-beta.0"></a>
# [1.0.0-beta.0](https://github.com/skatejs/skatejs/compare/0.15.3...1.0.0-beta.0) (2016-06-07)


### Bug Fixes

* make sure CustomEvent is properly functional ([fc983ec](https://github.com/skatejs/skatejs/commit/fc983ec))
* Safari 7 does not like defineProperty on Events ([20c7b7d](https://github.com/skatejs/skatejs/commit/20c7b7d))
* use saucelabs latest ([bcc89aa](https://github.com/skatejs/skatejs/commit/bcc89aa))
* **416:** add test for skate 0.14 ([43c7b60](https://github.com/skatejs/skatejs/commit/43c7b60))


### Chores

* **build:** Added dist/ to .gitignore. ([dc042b4](https://github.com/skatejs/skatejs/commit/dc042b4))
* **build:** Remove dist from committed resources. ([ce11571](https://github.com/skatejs/skatejs/commit/ce11571))


### BREAKING CHANGES

* build: Added dist/ to .gitignore.
* build: Removed dist/ from committed files.



<a name="0.15.3"></a>
## [0.15.3](https://github.com/skatejs/skatejs/compare/0.15.2...0.15.3) (2016-03-02)


### Bug Fixes

* build & add to CI run ([300bf45](https://github.com/skatejs/skatejs/commit/300bf45))
* make skate work with multiple versions on one page ([7014aa5](https://github.com/skatejs/skatejs/commit/7014aa5))



<a name="0.15.2"></a>
## [0.15.2](https://github.com/skatejs/skatejs/compare/0.15.1...0.15.2) (2015-12-22)



<a name="0.15.1"></a>
## [0.15.1](https://github.com/skatejs/skatejs/compare/0.15.0...0.15.1) (2015-12-22)



<a name="0.15.0"></a>
# [0.15.0](https://github.com/skatejs/skatejs/compare/0.14.3...0.15.0) (2015-12-04)



<a name="0.14.3"></a>
## [0.14.3](https://github.com/skatejs/skatejs/compare/0.14.2...0.14.3) (2015-12-01)



<a name="0.14.2"></a>
## [0.14.2](https://github.com/skatejs/skatejs/compare/0.14.1...0.14.2) (2015-11-27)



<a name="0.14.1"></a>
## [0.14.1](https://github.com/skatejs/skatejs/compare/0.14.0...0.14.1) (2015-11-15)



<a name="0.14.0"></a>
# [0.14.0](https://github.com/skatejs/skatejs/compare/0.13.2...0.14.0) (2015-11-07)


### Bug Fixes

* "unresolved" callback might never be called, remove that test ([d848b03](https://github.com/skatejs/skatejs/commit/d848b03))
* **test:** properly serialize value for it being used in a .setAttribute call ([4856656](https://github.com/skatejs/skatejs/commit/4856656))
* call build-test directly ([4042de0](https://github.com/skatejs/skatejs/commit/4042de0))
* camelCase property ([881f209](https://github.com/skatejs/skatejs/commit/881f209))
* do not use callback directly ([f6b1ef5](https://github.com/skatejs/skatejs/commit/f6b1ef5))
* do not use short or ([4a81a7f](https://github.com/skatejs/skatejs/commit/4a81a7f))
* MutationObserver for IE11 and innerHTML fixes ([bbca83e](https://github.com/skatejs/skatejs/commit/bbca83e))
* perf build ([ff5df90](https://github.com/skatejs/skatejs/commit/ff5df90))
* **test:** make sure our content document is available ([3df044f](https://github.com/skatejs/skatejs/commit/3df044f))
* used wrong slug for encryption ([d243912](https://github.com/skatejs/skatejs/commit/d243912))
* **IE:** on Internet Explorer, getOwnPropertyDescriptor always returns an object, so we need to set a flag ([d4e5f02](https://github.com/skatejs/skatejs/commit/d4e5f02))
* watching ([b362e53](https://github.com/skatejs/skatejs/commit/b362e53))
* **IE innerHTML:** only enhance once ([a8ed5cf](https://github.com/skatejs/skatejs/commit/a8ed5cf))
* **safari 8:** property would not be defined in Safari; do not read PropertyDescriptor if not needed ([67c1974](https://github.com/skatejs/skatejs/commit/67c1974))
* **saucelabs:** credentials & debugging ([2ddc774](https://github.com/skatejs/skatejs/commit/2ddc774))
* **test:** always exit gulp task ([021f370](https://github.com/skatejs/skatejs/commit/021f370))
* **test:** perf tests ([a581d9a](https://github.com/skatejs/skatejs/commit/a581d9a))
* **tests:** specialties with Saucelabs tests & watching ([946502a](https://github.com/skatejs/skatejs/commit/946502a))


### Performance Improvements

* early exit in case we did not get a callback ([8544df2](https://github.com/skatejs/skatejs/commit/8544df2))



<a name="0.13.2"></a>
## [0.13.2](https://github.com/skatejs/skatejs/compare/0.13.1...0.13.2) (2015-03-18)



<a name="0.13.1"></a>
## [0.13.1](https://github.com/skatejs/skatejs/compare/0.13.0...0.13.1) (2015-03-18)



<a name="0.13.0"></a>
# [0.13.0](https://github.com/skatejs/skatejs/compare/0.12.0...0.13.0) (2015-03-18)



<a name="0.12.0"></a>
# [0.12.0](https://github.com/skatejs/skatejs/compare/0.11.1...0.12.0) (2014-11-19)



<a name="0.11.1"></a>
## [0.11.1](https://github.com/skatejs/skatejs/compare/0.11.0...0.11.1) (2014-10-22)



<a name="0.11.0"></a>
# [0.11.0](https://github.com/skatejs/skatejs/compare/0.10.2...0.11.0) (2014-10-20)



<a name="0.10.2"></a>
## [0.10.2](https://github.com/skatejs/skatejs/compare/0.10.1...0.10.2) (2014-10-14)



<a name="0.10.1"></a>
## [0.10.1](https://github.com/skatejs/skatejs/compare/0.10.0...0.10.1) (2014-10-07)



<a name="0.10.0"></a>
# [0.10.0](https://github.com/skatejs/skatejs/compare/0.9.3...0.10.0) (2014-09-29)



<a name="0.9.3"></a>
## [0.9.3](https://github.com/skatejs/skatejs/compare/0.9.2...0.9.3) (2014-09-11)



<a name="0.9.2"></a>
## [0.9.2](https://github.com/skatejs/skatejs/compare/0.9.0...0.9.2) (2014-08-31)



<a name="0.9.0"></a>
# [0.9.0](https://github.com/skatejs/skatejs/compare/0.8.4...0.9.0) (2014-08-06)



<a name="0.8.4"></a>
## [0.8.4](https://github.com/skatejs/skatejs/compare/0.8.3...0.8.4) (2014-07-10)



<a name="0.8.3"></a>
## [0.8.3](https://github.com/skatejs/skatejs/compare/0.8.2...0.8.3) (2014-07-08)



<a name="0.8.2"></a>
## [0.8.2](https://github.com/skatejs/skatejs/compare/0.8.1...0.8.2) (2014-07-06)



<a name="0.8.1"></a>
## [0.8.1](https://github.com/skatejs/skatejs/compare/0.8.0...0.8.1) (2014-07-04)



<a name="0.8.0"></a>
# [0.8.0](https://github.com/skatejs/skatejs/compare/0.6.3...0.8.0) (2014-07-04)



<a name="0.6.3"></a>
## [0.6.3](https://github.com/skatejs/skatejs/compare/0.6.2...0.6.3) (2014-07-01)



<a name="0.6.2"></a>
## [0.6.2](https://github.com/skatejs/skatejs/compare/0.6.1...0.6.2) (2014-06-30)



<a name="0.6.1"></a>
## [0.6.1](https://github.com/skatejs/skatejs/compare/0.6.0...0.6.1) (2014-06-24)



<a name="0.6.0"></a>
# [0.6.0](https://github.com/skatejs/skatejs/compare/0.4.4...0.6.0) (2014-06-24)



<a name="0.4.4"></a>
## [0.4.4](https://github.com/skatejs/skatejs/compare/0.4.3...0.4.4) (2014-05-05)



<a name="0.4.3"></a>
## [0.4.3](https://github.com/skatejs/skatejs/compare/0.4.2...0.4.3) (2014-05-01)



<a name="0.4.2"></a>
## [0.4.2](https://github.com/skatejs/skatejs/compare/0.4.1...0.4.2) (2014-05-01)



<a name="0.4.1"></a>
## [0.4.1](https://github.com/skatejs/skatejs/compare/0.4.0...0.4.1) (2014-05-01)



<a name="0.4.0"></a>
# [0.4.0](https://github.com/skatejs/skatejs/compare/0.3.0...0.4.0) (2014-05-01)



<a name="0.3.0"></a>
# [0.3.0](https://github.com/skatejs/skatejs/compare/0.2.0...0.3.0) (2014-03-26)



<a name="0.2.0"></a>
# [0.2.0](https://github.com/skatejs/skatejs/compare/0.1.0...0.2.0) (2014-03-19)



<a name="0.1.0"></a>
# [0.1.0](https://github.com/skatejs/skatejs/compare/0.0.0...0.1.0) (2014-02-07)



<a name="0.0.0"></a>
# 0.0.0 (2014-02-01)



