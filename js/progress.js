(function(window) {
    function Progress($progressBar, $progressLine, $progressDot) {
        return new Progress.prototype.init($progressBar, $progressLine, $progressDot);
    }
    Progress.prototype = {
        constructor: Progress,
        init: function($progressBar, $progressLine, $progressDot) {
            this.$progressBar = $progressBar;
            this.$progressLine = $progressLine;
            this.$progressDot = $progressDot;
        },
        isMove: false, //是否正在播放
        // 滑动条点击
        progressClick: function(callBack) {
            var $this = this; // 此时此刻的this是progress
            // 监听背景的点击
            this.$progressBar.click(function(event) {
                // 获取滑动条最左侧距离窗口默认的位置
                var normalLeft = $(this).offset().left;
                // 获取点击的位置距离窗口的位置
                var eventLeft = event.pageX;
                // 设置滑动条前景的宽度
                $this.$progressLine.css("width", eventLeft - normalLeft);
                $this.$progressDot.css("left", eventLeft - normalLeft);
                // 计算进度条的比例
                var value = (eventLeft - normalLeft) / $(this).width();
                callBack(value);
            });
        },
        //滑动条滑动
        progressMove: function(callBack) {
            var $this = this;
            // 获取滑动条最左侧距离窗口默认的位置
            var normalLeft = this.$progressBar.offset().left;
            //获取滑动条的总宽度
            var barWidth = this.$progressBar.width();
            var eventLeft;
            // 1.监听鼠标的按下事件
            this.$progressBar.mousedown(function() {
                $this.isMove = true;
                // 监听鼠标的移动事件
                $(document).mousemove(function(event) {
                    // 获取点击的位置距离窗口的位置
                    eventLeft = event.pageX;
                    //移动长度=点击处的视口长度 - 滑动条左端的视口长度
                    var offset = eventLeft - normalLeft;
                    if (offset >= 0 && offset <= barWidth) {
                        // 设置前景的宽度
                        $this.$progressLine.css("width", offset);
                        $this.$progressDot.css("left", offset);
                    }
                });
            });
            // 2.监听鼠标的抬起事件
            $(document).mouseup(function() {
                $(document).off("mousemove");
                $this.isMove = false;
                // 计算进度条的比例
                var value = (eventLeft - normalLeft) / barWidth;
                callBack(value);
            });
        },
        //设置滑动条
        setProgress: function(value) {
            if (this.isMove) return;
            if (value < 0 || value > 100) return;
            this.$progressLine.css({
                width: value + "%"
            });
            this.$progressDot.css({
                left: value + "%"
            });
        }
    }
    Progress.prototype.init.prototype = Progress.prototype;
    window.Progress = Progress;
})(window);