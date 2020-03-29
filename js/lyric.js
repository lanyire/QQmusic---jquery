(function(window) {
    function Lyric(path) {
        return new Lyric.prototype.init(path);
    }
    Lyric.prototype = {
        constructor: Lyric,
        init: function(path) {
            this.path = path;
        },
        times: [], //歌词对应时间列表
        lyrics: [], //歌词列表
        index: -1,
        //获取歌词信息
        loadLyric: function(callBack) {
            var $this = this;
            $.ajax({
                url: $this.path,
                dataType: "text",
                success: function(data) {
                    // console.log(data);
                    $this.parseLyric(data);
                    callBack();
                },
                error: function(e) {
                    console.log(e);
                }
            });
        },
        //歌词时间数据格式化
        parseLyric: function(data) {
            var $this = this;
            // 一定要清空上一首歌曲的歌词和时间
            $this.times = [];
            $this.lyrics = [];
            var array = data.split("\n");
            var timeReg = /\[(\d*:\d*\.\d*)\]/ //设置获取时间的正则
                // 遍历取出每一条歌词
            $.each(array, function(index, ele) {
                // 处理歌词
                var lrc = ele.split("]")[1]; //用]把数据切成二维数组[ [时间，歌词] [时间，歌词] ]并取出歌词
                // 排除空字符串(没有歌词的)
                if (lrc.length == 1) return true;
                $this.lyrics.push(lrc); //获取到每一条单独的歌词

                // 处理时间,将02:33.75这样的数据转化为153.75
                var res = timeReg.exec(ele);
                if (res == null) return true;
                var timeStr = res[1];
                var res2 = timeStr.split(":");
                var min = parseInt(res2[0]) * 60;
                var sec = parseFloat(res2[1]);
                var time = parseFloat(Number(min + sec).toFixed(2));
                $this.times.push(time);
            });
        },
        // 歌词同步
        currentIndex: function(currentTime) {
            if (currentTime >= this.times[0]) {
                this.index++;
                this.times.shift(); // 删除数组最前面的一个元素
            }
            return this.index;
        }

    }
    Lyric.prototype.init.prototype = Lyric.prototype;
    window.Lyric = Lyric;
})(window);