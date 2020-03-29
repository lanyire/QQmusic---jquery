(function(window) {
    function Player($audio) {
        return new Player.prototype.init($audio);
    }
    Player.prototype = {
        constructor: Player,
        musicList: [], //歌曲列表
        init: function($audio) {
            this.$audio = $audio;
            this.audio = $audio.get(0); //音频标签<audio src=""></audio>
        },
        currentIndex: -1, //当前播放歌曲的索引位
        // 播放按钮的点击
        playMusic: function(index, music) {
            // 判断是否是同一首音乐
            if (this.currentIndex == index) {
                // 同一首音乐
                if (this.audio.paused) {
                    this.audio.play();
                } else {
                    this.audio.pause();
                }
            } else {
                // 不是同一首
                this.$audio.attr("src", music.link_url);
                this.audio.play();
                this.currentIndex = index;
            }
        },
        //切换上一首
        preIndex: function() {
            var index = this.currentIndex - 1;
            if (index < 0) {
                index = this.musicList.length - 1;
            }
            return index;
        },
        //切换下一首
        nextIndex: function() {
            var index = this.currentIndex + 1;
            if (index > this.musicList.length - 1) {
                index = 0;
            }
            return index;
        },
        //删除歌曲
        changeMusic: function(index) {
            // 删除歌曲对应的索引位
            this.musicList.splice(index, 1);
            // 判断当前删除的是否是正在播放音乐的前面的音乐
            if (index < this.currentIndex) {
                this.currentIndex = this.currentIndex - 1;
            }
        },
        //音乐播放时间
        musicTimeUpdate: function(callBack) {
            var $this = this;
            this.$audio.on("timeupdate", function() {
                var duration = $this.audio.duration;
                var currentTime = $this.audio.currentTime;
                var timeStr = $this.formatDate(currentTime, duration);
                callBack(currentTime, duration, timeStr);
            });
        },
        //播放时间格式化
        formatDate: function(currentTime, duration) {
            var endMin = parseInt(duration / 60);
            var endSec = parseInt(duration % 60);
            if (endMin < 10) {
                endMin = "0" + endMin;
            }
            if (endSec < 10) {
                endSec = "0" + endSec;
            }

            var startMin = parseInt(currentTime / 60);
            var startSec = parseInt(currentTime % 60);
            if (startMin < 10) {
                startMin = "0" + startMin;
            }
            if (startSec < 10) {
                startSec = "0" + startSec;
            }
            return startMin + ":" + startSec + "/" + endMin + ":" + endSec;
        },
        //进度条的进度等于当前时间/总时长,通过判断进度条当前的位置百分比value逆推出歌曲当前时间
        musicSeekTo: function(value) {
            if (isNaN(value)) return;
            this.audio.currentTime = this.audio.duration * value;
        },
        //音量滑动条this.audio.volume的取值为0-1
        musicVoiceSeekTo: function(value) {
            if (isNaN(value)) return;
            if (value < 0 || value > 1) return;
            this.audio.volume = value;
        }
    }
    Player.prototype.init.prototype = Player.prototype;
    window.Player = Player;
})(window);