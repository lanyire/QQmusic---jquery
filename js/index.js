$(function() {
    var $audio = $("audio");
    var player = new Player($audio);
    console.log(player)
    var progress;
    var voiceProgress;
    var lyric;

    // 0.自定义滚动条
    $(".content_list").mCustomScrollbar();

    // 1.加载歌曲列表，自发执行
    getPlayerList();

    function getPlayerList() {
        $.ajax({
            url: "../source/musiclist.json",
            dataType: "json",
            success: function(data) {
                player.musicList = data;
                //遍历获取到的数据, 创建每一条音乐
                var $musicList = $(".content_list ul");
                $.each(data, function(index, ele) {
                    var $item = crateMusicItem(index, ele); //
                    $musicList.append($item);
                });
                initMusicInfo(data[0]);
                initMusicLyric(data[0]);
            },
            error: function(e) {
                console.log(e);
            }
        });
    }

    // 2.初始化歌词滑动条和音量滑动条，自发执行
    initProgress();

    function initProgress() {
        var $progressBar = $(".music_progress_bar");
        var $progressLine = $(".music_progress_line");
        var $progressDot = $(".music_progress_dot");
        progress = Progress($progressBar, $progressLine, $progressDot);
        progress.progressClick(function(value) {
            player.musicSeekTo(value);
        });
        progress.progressMove(function(value) {
            player.musicSeekTo(value);
        });


        var $voiceBar = $(".music_voice_bar");
        var $voiceLine = $(".music_voice_line");
        var $voiceDot = $(".music_voice_dot");
        voiceProgress = Progress($voiceBar, $voiceLine, $voiceDot);
        voiceProgress.progressClick(function(value) {
            player.musicVoiceSeekTo(value);
        });
        voiceProgress.progressMove(function(value) {
            player.musicVoiceSeekTo(value);
        });
    }

    // 3.初始化歌曲信息，等待调用
    function initMusicInfo(music) {
        // 获取对应的元素
        var $musicImage = $(".song_info_pic img"); //歌曲封面
        var $musicName = $(".song_info_name a"); //歌曲名称
        var $musicSinger = $(".song_info_singer a"); //歌手名
        var $musicAblum = $(".song_info_ablum a"); //专辑名
        var $musicProgressName = $(".music_progress_name"); //进度条歌曲/歌手
        var $musicProgressTime = $(".music_progress_time"); //进度条时间显示
        var $musicBg = $(".mask_bg"); //以封面为视口背景

        // 给获取到的元素赋值
        $musicImage.attr("src", music.cover);
        $musicName.text(music.name);
        $musicSinger.text(music.singer);
        $musicAblum.text(music.album);
        $musicProgressName.text(music.name + " / " + music.singer);
        $musicProgressTime.text("00:00 / " + music.time);
        $musicBg.css("background-image", "url('" + music.cover + "')");
    }

    // 4.初始化歌词信息，等待调用
    function initMusicLyric(music) {
        lyric = new Lyric(music.link_lrc)
        console.log(lyric)
        var $lyricContainer = $(".song_lyric");
        // 清空上一首音乐的歌词
        $lyricContainer.html("");
        lyric.loadLyric(function() {
            // 创建歌词列表
            $.each(lyric.lyrics, function(index, ele) {
                var $item = $("<li>" + ele + "</li>");
                $lyricContainer.append($item);
            });
        });
    }



    // 5.初始化事件监听
    initEvents();

    function initEvents() {
        // 5.1 监听歌曲的移入移出事件
        $(".content_list").delegate(".list_music", "mouseenter", function() {
            // 显示子菜单
            $(this).find(".list_menu").stop().fadeIn(100);
            $(this).find(".list_time a").stop().fadeIn(100);
            // 隐藏时长
            $(this).find(".list_time span").stop().fadeOut(100);
        });
        $(".content_list").delegate(".list_music", "mouseleave", function() {
            // 隐藏子菜单
            $(this).find(".list_menu").stop().fadeOut(100);
            $(this).find(".list_time a").stop().fadeOut(100);
            // 显示时长
            $(this).find(".list_time span").stop().fadeIn(100);
        });

        // 5.2 监听复选框的点击事件
        $(".content_list").delegate(".list_check", "click", function() {
            $(this).toggleClass("list_checked");
        });

        // 5.3 添加子菜单播放按钮的监听
        var $musicPlay = $(".music_play");
        $(".content_list").delegate(".list_menu_play", "click", function() {
            var $item = $(this).parents(".list_music");
            // 5.3.1 切换播放图标
            $(this).toggleClass("list_menu_play2");

            // 5.3.2 复原其它的播放图标
            $item.siblings().find(".list_menu_play").removeClass("list_menu_play2");

            // 5.3.3 同步底部播放按钮
            if ($(this).hasClass("list_menu_play2")) {
                // 当前子菜单的播放按钮是播放状态
                $musicPlay.addClass("music_play2");
                // 让文字高亮
                $item.find("div").css("color", "#fff");
                $item.siblings().find("div").css("color", "rgba(255,255,255,0.5)");
            } else {
                // 当前子菜单的播放按钮不是播放状态
                $musicPlay.removeClass("music_play2");
                // 让文字不高亮
                $item.find("div").css("color", "rgba(255,255,255,0.5)");
            }

            // 5.3.4 切换序号的状态
            $item.find(".list_number").toggleClass("list_number2");
            $item.siblings().find(".list_number").removeClass("list_number2");

            // 5.3.5 播放音乐
            player.playMusic($item.get(0).index, $item.get(0).music);

            // 5.3.6 切换歌曲信息
            initMusicInfo($item.get(0).music);

            // 5.3.7切换歌词信息
            initMusicLyric($item.get(0).music);
        });

        // 5.4 监听底部控制区域播放按钮的点击
        $musicPlay.click(function() {
            // 判断有没有播放过音乐
            if (player.currentIndex == -1) {
                // 没有播放过音乐
                $(".list_music").eq(0).find(".list_menu_play").trigger("click");
            } else {
                // 已经播放过音乐
                $(".list_music").eq(player.currentIndex).find(".list_menu_play").trigger("click");
            }
        });

        // 5.5 监听底部控制区域上一首按钮的点击
        $(".music_pre").click(function() {
            $(".list_music").eq(player.preIndex()).find(".list_menu_play").trigger("click");
        });

        // 5.6 监听底部控制区域下一首按钮的点击
        $(".music_next").click(function() {
            $(".list_music").eq(player.nextIndex()).find(".list_menu_play").trigger("click");
        });

        // 5.7 监听删除按钮的点击
        $(".content_list").delegate(".list_menu_del", "click", function() {
            // 5.7.1 找到被点击的音乐
            var $item = $(this).parents(".list_music");

            // 5.7.2 判断当前删除的是否是正在播放的
            if ($item.get(0).index === player.currentIndex) {
                $(".music_next").trigger("click");
            }

            $item.remove();
            player.changeMusic($item.get(0).index);

            // 5.7.3 重新排序
            $(".list_music").each(function(index, ele) {
                ele.index = index;
                $(ele).find(".list_number").text(index + 1);
            });
        });

        //5.8 监听播放的进度
        player.musicTimeUpdate(function(currentTime, duration, timeStr) {
            // 5.8.1 同步时间
            $(".music_progress_time").text(timeStr);

            // 5.8.2 同步进度条,计算播放比例
            var value = currentTime / duration * 100;
            progress.setProgress(value);

            // 5.8.3 实现歌词同步
            var index = lyric.currentIndex(currentTime);
            var $item = $(".song_lyric li").eq(index);
            $item.addClass("cur");
            $item.siblings().removeClass("cur");

            // 5.8.4 实现歌词滚动
            if (index <= 2) return;
            $(".song_lyric").css({
                marginTop: (-index + 2) * 30
            });
        });

        // 5.9 监听声音按钮的点击
        $(".music_voice_icon").click(function() {
            // 5.9.1 图标切换
            $(this).toggleClass("music_voice_icon2");

            // 5.9.2 声音切换
            if ($(this).hasClass("music_voice_icon2")) {
                // 变为没有声音
                player.musicVoiceSeekTo(0);
            } else {
                // 变为有声音
                player.musicVoiceSeekTo(1);
            }
        });
    }

    // 6.创建音乐
    function crateMusicItem(index, music) {
        var $item = $(
            `
            <li class="list_music">
            <div class="list_check"><i></i></div>
            <div class="list_number">${index + 1}</div>
            <div class="list_name"> ${music.name}
                 <div class="list_menu">
                      <a href="#" title="播放" class="list_menu_play"></a>
                      <a href="#" title="添加"></a> 
                      <a href="#" title="下载"></a>
                      <a href="#" title="分享"></a>
                 </div>
            </div>
            <div class="list_singer"> ${ music.singer} </div>
            <div class="list_time">
                 <span> ${music.time} </span>
                 <a href="#" title="删除" class="list_menu_del"></a>
            </div>
            </li>
            `
        );

        $item.get(0).index = index;
        $item.get(0).music = music;

        return $item;
    }
});