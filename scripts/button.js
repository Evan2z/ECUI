/*
Button - 定义按钮的控件行为。
按钮控件在激活(active)状态下鼠标移出控件区域会失去激活样式，移入控件区域再次获得激活样式。

按钮控件直接HTML初始化的例子，id指定名称，可以通过ecui.get(id)的方式访问控件:
<div ecui="type:button;id:demo">
    <!-- 这里放按钮的文字 -->
    ...
</div>

属性
*/
//{if 0}//
(function () {

    var core = ecui,
        dom = core.dom,
        ui = core.ui,

        setText = dom.setText,

        inheritsControl = core.inherits,

        UI_CONTROL = ui.Control,
        UI_CONTROL_CLASS = UI_CONTROL.prototype;
//{/if}//
//{if $phase == "define"}//
    /**
     * 初始化基础控件。
     * options 对象支持的属性如下：
     * text 按钮的文字
     * @public
     *
     * @param {Object} options 初始化选项
     */
    ///__gzip_original__UI_BUTTON
    ///__gzip_original__UI_BUTTON_CLASS
    var UI_BUTTON = ui.Button =
        inheritsControl(
            UI_CONTROL,
            'ui-button',
            function (el, options) {
                UI_CONTROL.client.call(this, el, options);
                this.setText(options.text);
            }
        ),
        UI_BUTTON_CLASS = UI_BUTTON.prototype;
//{else}//
    /**
     * 鼠标移出事件的默认处理。
     * 鼠标移出控件区域时，控件失去悬停状态，移除状态样式 -hover，如果控件处于激活状态，移除状态样式 -active，移除状态样式不失去激活状态。
     * @protected
     *
     * @param {ecui.ui.Event} event 事件对象
     */
    UI_BUTTON_CLASS.$mouseout = function (event) {
        UI_CONTROL_CLASS.$mouseout.call(this, event);
        if (this.isActived()) {
            this.alterClass('-active', true);
        }
    };

    /**
     * 鼠标移入事件的默认处理。
     * 鼠标移入控件区域时，控件获得悬停状态，添加状态样式 -hover，如果控件处于激活状态，添加状态样式 -active。
     * @protected
     *
     * @param {ecui.ui.Event} event 事件对象
     */
    UI_BUTTON_CLASS.$mouseover = function (event) {
        UI_CONTROL_CLASS.$mouseover.call(this, event);
        if (this.isActived()) {
            this.alterClass('+active');
        }
    };

    /**
     * 设置控件的文字。
     * @public
     *
     * @param {string} text 控件的文字
     */
    UI_BUTTON_CLASS.setText = function (text) {
        setText(this.getBody(), text);
    };
//{/if}//
//{if 0}//
})();
//{/if}//