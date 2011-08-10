/*
Radio - 定义一组选项中选择唯一选项的基本操作。
单选框控件，继承自输入框控件，实现了对原生 InputElement 单选框的功能扩展，支持对选中的图案的选择。单选框控件需要分组后
使用，在表单项提交中，一组单选框控件中的第一个单选框保存提交用的表单内容。

单选框控件直接HTML初始化的例子:
<input ecui="type:radio" type="radio" name="test" checked="checked" />
也可以使用其它标签初始化:
<div ecui="type:radio;name:test;checked:true"></div>

属性
_bDefault  - 默认的选中状态
*/
//{if 0}//
(function () {

    var core = ecui,
        ui = core.ui,

        getKey = core.getKey,
        inheritsControl = core.inherits,
        query = core.query,

        UI_INPUT_CONTROL = ui.InputControl,
        UI_INPUT_CONTROL_CLASS = UI_INPUT_CONTROL.prototype;
//{/if}//
//{if $phase == "define"}//
    /**
     * 初始化单选框控件。
     * options 对象支持的属性如下：
     * checked 控件是否默认选中
     * name    控件所属组的名称
     * value   控件的值
     * @public
     *
     * @param {Object} options 初始化选项
     */
    ///__gzip_original__UI_RADIO
    ///__gzip_original__UI_RADIO_CLASS
    var UI_RADIO = ui.Radio =
        inheritsControl(
            UI_INPUT_CONTROL,
            'ui-radio',
            function (el, options) {
                el = this.getInput();

                if (options.checked) {
                    el.defaultChecked = el.checked = true;
                }

                // 保存节点选中状态，用于修复IE6/7下移动DOM节点时选中状态发生改变的问题
                this._bDefault = el.defaultChecked;
            },
            function (el, options) {
                options.hidden = true;
                options.input = 'radio';
            }
        ),
        UI_RADIO_CLASS = UI_RADIO.prototype;
//{else}//
    /**
     * 单选框控件刷新
     * @private
     *
     * @param {ecui.ui.Radio} control 单选框控件
     * @param {boolean|undefined} checked 新的状态，如果忽略表示不改变当前状态
     */
    function UI_RADIO_FLUSH(control, checked) {
        if (checked !== undefined) {
            var el = control.getInput();
            el.defaultChecked = el.checked = checked;
        }
        control.setClass(control.getBaseClass() + (control.isChecked() ? '-checked' : ''));
    }

    /**
     * 鼠标单击控件事件的默认处理。
     * 控件点击时将控件设置成为选中状态，同时取消同一个单选框控件组的其它控件的选中状态。如果控件处于可操作状态(参见 isEnabled)，click 方法触发 onclick 事件，如果事件返回值不为 false，则调用 $click 方法。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_RADIO_CLASS.$click = function (event) {
        UI_INPUT_CONTROL_CLASS.$click.call(this, event);
        this.setChecked(true);
    };

    /**
     * 控件拥有焦点时，键盘事件的默认处理。
     * 屏蔽空格键按下事件。Opera 下仅用 keydown 不能屏蔽空格键事件，还需要在 keypress 中屏蔽。如果控件处于可操作状态(参见 isEnabled)，keydown/keypress/keyup 方法触发 onkeydown/onkeypress/onkeyup 事件，如果事件返回值不为 false，则调用 $keydown/$keypress/$keyup 方法。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_RADIO_CLASS.$keydown = UI_RADIO_CLASS.$keypress = UI_RADIO_CLASS.$keyup = function (event) {
        UI_INPUT_CONTROL_CLASS['$' + event.type].call(this, event);
        if (event.which == 32) {
            if (event.type == 'keyup' && getKey() == 32) {
                this.checked();
            }
            event.exit();
        }
    };

    /**
     * 控件自动渲染全部完成后的处理。
     * 页面刷新时，部分浏览器会回填输入框的值，需要在回填结束后触发设置控件的状态。
     * @protected
     */
    UI_RADIO_CLASS.$ready = function () {
        UI_RADIO_FLUSH(this);
    };

    /**
     * 输入框控件重置的默认处理。
     * @protected
     *
     * @param {Event} event 事件对象
     */
    UI_RADIO_CLASS.$reset = function (event) {
        // 修复IE6/7下移动DOM节点时选中状态发生改变的问题
        this.getInput().checked = this._bDefault;
        UI_INPUT_CONTROL_CLASS.$reset.call(this, event);
    };

    /**
     * 获取与当前单选框同组的全部单选框。
     * getItems 方法返回包括当前单选框在内的与当前单选框同组的全部单选框，同组的单选框选中状态存在唯一性。
     * @public
     *
     * @return {Array} 单选框控件数组
     */
    UI_RADIO_CLASS.getItems = function () {
        //__gzip_original__form
        var i = 0,
            list = this.getInput(),
            form = list.form,
            o = list.name,
            result = [];

        if (form) {
            for (list = form[o]; o = list[i++]; ) {
                if (o.getControl) {
                    result.push(o.getControl());
                }
            }
            return result;
        }
        else if (o) {
            return query({type: UI_RADIO, custom: function (control) {
                return !control.getInput().form && control.getName() == o;
            }});
        }
        else {
            return [this];
        }
    };

    /**
     * 判断控件是否选中。
     * @public
     *
     * @return {boolean} 是否选中
     */
    UI_RADIO_CLASS.isChecked = function () {
        return this.getInput().checked;
    };

    /**
     * 设置单选框控件为选中状态。
     * 将控件设置成为选中状态，同时取消同一个单选框控件组的其它控件的选中状态。
     * @public
     */
    UI_RADIO_CLASS.setChecked = function (checked) {
        if (this.isChecked() != checked) {
            if (checked) {
                for (var i = 0, list = this.getItems(), o; o = list[i++]; ) {
                    UI_RADIO_FLUSH(o, o == this);
                }
            }
            else {
                UI_RADIO_FLUSH(this, false);
            }
        }
    };
//{/if}//
//{if 0}//
})();
//{/if}//